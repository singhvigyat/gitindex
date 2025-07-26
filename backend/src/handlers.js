import {
    createPlaywrightRouter,
    enqueueLinks,
    EnqueueStrategy,
    log,
    KeyValueStore,
} from 'crawlee';
import crypto from 'crypto';

export const router = createPlaywrightRouter();

function makeKeyFromOrgName(orgName) {
    return crypto
        .createHash('sha256')
        .update(orgName)
        .digest('hex'); 
}

router.addHandler('ORG', async ({ page, request, log, enqueueLinks }) => {
    // --- ORG handler: initialize one KVS entry per org (using hashKey) ---
    await page.waitForSelector('.org-info-wrapper');

    // Extract fields as before
    const techContent = await page.locator('.tech__content').textContent();
    const topicContent = await page.locator('.topics__content').textContent();
    const orgName = await page
        .locator('.constrainer--line-length h2 span')
        .textContent();
    const websiteLink = await page
        .locator('.link__wrapper a')
        .getAttribute('href');

    // Find all “View Code” (project) links
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

    // Build the value we want to store (including the original orgName)
    const baseData = {
        orgName,       // store the real name inside the data
        url: request.url,
        techContent: techContent?.trim() || '',
        topicContent: topicContent?.trim() || '',
        websiteLink: websiteLink || '',
        projectLinks,                   
        githubLinksFromWebsite: [],
        githubLinksFromProjects: [],
        lastUpdated: new Date().toISOString(),
    };

    // Compute a “safe” key
    const key = makeKeyFromOrgName(orgName);
    const store = await KeyValueStore.open('org-data');
    await store.setValue(key, baseData);

    // Enqueue the website (if exists), passing only key
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

router.addDefaultHandler(async ({ request, page, enqueueLinks, log }) => {
    log.debug(`Processing listing page: ${request.url}`);
    console.log("Starting listing page handler");

    let pageNumber = 1;
    let hasMorePages = true;

    while (hasMorePages) {
        console.log(`Processing listing page ${pageNumber}`);

        // Wait for organization links to load
        await page.waitForSelector('.org-wrapper a', { timeout: 10000 });

        // Get all organization links on current page
        const orgLinks = await page.$$eval('.org-wrapper a', (links) => {
            return links.map(link => link.href);
        });

        console.log(`Found ${orgLinks.length} organization links on page ${pageNumber}`);

        // Enqueue all organization links from current page
        await enqueueLinks({
            urls: orgLinks,
            label: 'ORG',
        });

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
