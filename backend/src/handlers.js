import {
    createPlaywrightRouter,
    enqueueLinks,
    EnqueueStrategy,
    log,
    KeyValueStore,
} from 'crawlee';
import crypto from 'crypto';
import { text } from 'stream/consumers';

export const router = createPlaywrightRouter();

function makeKeyFromOrgName(orgName) {
    return crypto
        .createHash('sha256')
        .update(orgName)
        .digest('hex');
}

// get links from the org page on gsoc orgs. 
router.addHandler('ORG', async ({ page, request, log, enqueueLinks }) => {
    // --- ORG handler: initialize one KVS entry per org (using hashKey) ---
    const { orgData, imageData, allOrgData, allImgData } = request.userData || {};
    // console.log("✅✅✅✅ here in org handler");
    // console.log("Current org:", orgData);
    // console.log("Matching image:", imageData);

    await page.waitForSelector('.org-info-wrapper');

    // Extract fields as before
    const techContent = await page.locator('.tech__content').textContent();
    const topicContent = await page.locator('.topics__content').textContent();
    const contactSelector = 'app-org-info-contact-card li'
    await page.waitForSelector(contactSelector).catch(() => { })

    const info = await page.locator(contactSelector).all()

    let contactInfo = []
    for (const li of info) {
        const a = li.locator('a').first();
        if (await a.count()) {
            const href = await a.getAttribute('href');

            // Option A: only direct text nodes (skips <mat-icon> "email")
            const label = await a.evaluate(el =>
                Array.from(el.childNodes)
                    .filter(n => n.nodeType === Node.TEXT_NODE)
                    .map(n => n.textContent.trim())
                    .filter(Boolean)
                    .join(' ')
            );

            // Option B (fallback): visible text, may include icon text in some cases
            // const label = (await a.innerText()).trim();

            contactInfo.push({ href, text: label });
        } else {
            let text = (await li.textContent())?.trim() ?? '';
        }
    }



    const orgName = await page
        .locator('.constrainer--line-length h2 span')
        .textContent();
    const websiteLink = await page
        .locator('.link__wrapper a')
        .getAttribute('href');

    const projectsData = await page.evaluate(() => {
        const projects = [];

        // Find all project containers (each .content div represents a project)
        const projectContainers = document.querySelectorAll('div.content:has(.contributor)');

        if (projectContainers.length === 0) {
            // Method 2: Fallback - select all .content divs and filter manually
            projectContainers = Array.from(document.querySelectorAll('div.content')).filter(container => {
                return container.querySelector('.contributor') !== null;
            });
        }


        projectContainers.forEach((container, index) => {
            const project = {
                // Extract contributor information
                contributor: container.querySelector('.contributor__content')?.textContent?.trim() || '',

                // Extract mentor information
                mentor: container.querySelector('.mentor__content')?.textContent?.trim() || '',

                // Extract organization (note: uses .mentor__content class in your HTML)
                organization: container.querySelector('.organization .mentor__content')?.textContent?.trim() || '',

                // Extract project title
                title: container.querySelector('.title')?.textContent?.trim() || '',

                // Extract project description
                description: container.querySelector('.description')?.textContent?.trim() || '',

                // Extract project details link
                projectDetailsLink: container.querySelector('a[href*="/archive/"][href*="/projects/"]')?.href || '',

                // Extract "View code" link
                codeLink: container.querySelector('a[href]:not([href*="/archive/"])')?.href || '',

                // Additional metadata
                index: index
            };

            projects.push(project);
        });

        return projects;
    });

    const foundLink = await page.$$eval('a.mdc-button--outlined', (links) =>
        links
            .filter((link) => {
                const label = link.querySelector('span.mdc-button__label');
                return (
                    label &&
                    label.textContent.trim().toLowerCase() === 'view code'
                );
            })
            .map((link) => link.href)
    );
    const projectLinks = foundLink || [];

    let techTags = techContent
    techTags = techTags.split(",").map(e => e.trim())

    let topicTags = topicContent
    topicTags = topicTags.split(",").map(e => e.trim())

    // Build the value we want to store (including the original orgName)
    console.log("YEAR", process.env.YEAR)
    const baseData = {
        orgName,
        year: process.env.YEAR,
        logoUrl: imageData.src,
        url: request.url,
        techContent: techTags || [],
        topicContent: topicTags || [],
        websiteLink: websiteLink || '',
        contactInfo,
        projectsData,
        projectLinks: projectLinks,
        githubLinksFromWebsite: [],
        githubLinksFromProjects: [],
        lastUpdated: new Date().toISOString(),
    };
    // Compute a “safe” key
    const key = makeKeyFromOrgName(orgName);
    const store = await KeyValueStore.open('org-data');
    await store.setValue(key, baseData);

    // Enqueue the website (if exists), passing only k  ey
    if (websiteLink) {
        log.info(`Enqueuing websiteLink for ORGLINK (key=${key}): ${websiteLink}`);
        await enqueueLinks({
            urls: [websiteLink],
            label: 'ORGLINK',
            strategy: EnqueueStrategy.All,
            userData: { key },
        });
    } else {
        log.warning(`No websiteLink for org="${orgName}". KVS entry created.`);
    }
});

// get links from website.
router.addHandler('ORGLINK', async ({ request, page, log, enqueueLinks }) => {
    // --- ORGLINK handler: merge website-level GitHub links ---
    const { key } = request.userData; // this is the hex-hash key
    log.info(`🔁 ORGLINK handler for key=${key}, URL=${request.url}`);

    // Scrape all <a> that contain “github.com”
    const githubLinksFromWebsite = await page.$$eval('a[href]', (anchors) =>
        anchors
            .map((a) => a.href)
            .filter((href) => href.includes('github.com'))
    );
    log.info(`Found ${githubLinksFromWebsite.length} GitHub links on website.`);

    // Open the same KVS store and merge
    const store = await KeyValueStore.open('org-data');
    const existing = await store.getValue(key);
    if (!existing) {
        log.error(`KVS entry not found for key=${key}. Did ORG run?`);
        return;
    }

    // Merge & dedupe into githubLinksFromWebsite
    const mergedWebsite = Array.from(
        new Set([...existing.githubLinksFromWebsite, ...githubLinksFromWebsite])
    );
    await store.setValue(key, {
        ...existing,
        githubLinksFromWebsite: mergedWebsite,
        lastUpdated: new Date().toISOString(),
    });

    // Enqueue each project link for PROJECTS handler
    if (existing.projectLinks.length) {
        log.info(`Enqueuing ${existing.projectLinks.length} projectLinks for PROJECTS (key=${key}).`);
        await enqueueLinks({
            urls: existing.projectLinks,
            label: 'PROJECTS',
            strategy: EnqueueStrategy.All,
            userData: { key },
        });
    } else {
        log.warning(`No projectLinks in KVS for key=${key}.`);
    }
});

// get github links from the projects given on the gsoc organizations page. 
router.addHandler('PROJECTS', async ({ request, page, log }) => {
    // --- PROJECTS handler: merge project-page GitHub links ---
    const { key } = request.userData;
    log.info(`🏗 PROJECTS handler for key=${key}, URL=${request.url}`);

    // Scrape all “github.com” <a> on this project page
    const githubLinksFromThisProject = await page.$$eval('a[href]', (anchors) =>
        anchors
            .map((a) => a.href)
            .filter((href) => href.includes('github.com'))
    );
    log.info(`PROJECTS: found ${githubLinksFromThisProject.length} GitHub links.`);

    const store = await KeyValueStore.open('org-data');
    const existing = await store.getValue(key);
    if (!existing) {
        log.error(`KVS entry missing for key=${key}.`);
        return;
    }

    // Merge & dedupe into githubLinksFromProjects
    const mergedProjects = Array.from(
        new Set([
            ...existing.githubLinksFromProjects,
            ...githubLinksFromThisProject,
        ])
    );
    await store.setValue(key, {
        ...existing,
        githubLinksFromProjects: mergedProjects,
        lastUpdated: new Date().toISOString(),
    });
});

// get all the organizations first. 
router.addDefaultHandler(async ({ request, page, enqueueLinks, log }) => {
    log.debug(`Processing listing page: ${request.url}`);
    console.log("Starting listing page handler");

    let pageNumber = 1;
    let hasMorePages = true;

    while (hasMorePages) {
        console.log(`Processing listing page ${pageNumber}`);

        // Wait for organization links to load
        await page.waitForSelector('.org-wrapper a', { timeout: 10000 });
        await page.waitForSelector('.img-wrapper img', { timeout: 10000 })


        const orgData = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.org-wrapper a')).map((link, index) => ({
                url: link.href,
                dataId: link.getAttribute('data-id') || '',
                index: index,
            }));
        })

        const imgData = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.img-wrapper img')).map((img, index) => ({
                src: img.src,
                index: index
            }));
        })

        const matchedData = orgData.map(org => {
            const matchingImage = imgData.find(img =>
                img.index === org.index || img.dataId === org.dataId
            )

            return {
                ...org,
                imageData: matchingImage
            }
        })


        // await Dataset.pushData( matchedData)

        // Extract URLs from orgData first
        for (let i = 0; i < orgData.length; i++) {
            const org = orgData[i];
            const matchingImage = imgData.find(img => img.index === org.index)
            await enqueueLinks({
                urls: [org.url],
                label: 'ORG',
                userData: {
                    orgData: org,
                    imageData: matchingImage,
                    allOrgData: orgData,
                    allImgData: imgData
                }

            })
        }
        // Now handle pagination - look for next button on the listing page
        const nextButtonSelector = 'button.mat-mdc-paginator-navigation-next';
        const nextButton = await page.$(nextButtonSelector);

        if (nextButton) {
            const isDisabled = await nextButton.evaluate(button => button.disabled);

            if (!isDisabled) {
                console.log(`Moving to listing page ${pageNumber + 1}...`);

                try {
                    // Get current page identifier to detect when content changes
                    const currentOrgCount = await page.$$eval('.org-wrapper a', links => links.length);
                    const firstOrgText = await page.$eval('.org-wrapper a',
                        link => link.textContent?.trim() || ''
                    ).catch(() => '');

                    // Click next button
                    await nextButton.click();

                    // Wait for the listing content to change
                    await page.waitForFunction(
                        ({ oldCount, oldFirstOrg }) => {
                            const currentLinks = document.querySelectorAll('.org-wrapper a');
                            const currentFirstOrg = currentLinks[0]?.textContent?.trim() || '';

                            // Content has changed if first org is different
                            return currentFirstOrg !== oldFirstOrg;
                        },
                        { oldCount: currentOrgCount, oldFirstOrg: firstOrgText },
                        { timeout: 15000 }
                    );

                    // Additional wait for network to settle
                    await page.waitForLoadState('networkidle', { timeout: 10000 });

                    pageNumber++;
                    console.log(`Successfully moved to listing page ${pageNumber}`);

                } catch (error) {
                    log.error(`Error navigating to next page: ${error.message}`);
                    console.log("Failed to load next page, ending pagination");
                    hasMorePages = false;
                }
            } else {
                console.log("Next button is disabled - reached last page");
                hasMorePages = false;
            }
        } else {
            console.log("No next button found - this might be a single page or pagination structure is different");
            hasMorePages = false;
        }
    }
    log.warning(`⚠️ No matching handler for: ${request.url}, label: ${request.label}`);

    console.log(`Completed processing all listing pages. Total pages processed: ${pageNumber}`);
});
