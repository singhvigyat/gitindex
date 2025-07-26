const { MAIN_WORLD } = require("puppeteer");

/**
 * Extracts GitHub links that belong to the organization shown on the page.
 * 
 * @param {PuppeteerPage} page - The Puppeteer page instance.
 * @returns {Promise<string[]>} - An array of matched GitHub links.
 */
async function getOrgGitHubLinks(page) {
    // 1. Extract the organization name from the page
    const orgDisplayName = await page.$eval(
        '.organization .mentor__content',
        el => el.textContent.trim()
    );

    const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const orgKey = normalize(orgDisplayName); // e.g., "fossasia" or "helloworld"

    // 2. Extract all GitHub links
    const allGitHubLinks = await page.$$eval('a', anchors =>
        anchors
            .map(a => a.href)
            .filter(href => href.startsWith('https://github.com/'))
    );

    // 3. Filter GitHub links to match org
    const matchedLinks = allGitHubLinks.filter(link => {
        try {
            const url = new URL(link);
            const owner = url.pathname.split('/')[1]; // github.com/<owner>/...
            return normalize(owner) === orgKey;
        } catch {
            return false;
        }
    });

    return matchedLinks;
}



// second code->
/**
 * Extracts GitHub links and classifies them by how closely they match the org name.
 *
 * @param {PuppeteerPage} page - The Puppeteer page instance.
 * @returns {Promise<Array<{ url: string, matchType: 'exact' | 'fuzzy' | 'unverified' }>>}
 */
async function getOrgGitHubLinks(page) {
    // Get org name from the page
    const orgDisplayName = await page.$eval(
        '.organization .mentor__content',
        el => el.textContent.trim()
    );

    const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const orgKey = normalize(orgDisplayName);

    // Extract all GitHub links
    const allGitHubLinks = await page.$$eval('a', anchors =>
        anchors
            .map(a => a.href)
            .filter(href => href.startsWith('https://github.com/'))
    );

    // Determine match level
    const results = allGitHubLinks.map(link => {
        try {
            const owner = new URL(link).pathname.split('/')[1];
            const normOwner = normalize(owner);

            if (normOwner === orgKey) {
                return { url: link, matchType: 'exact' };
            } else if (
                orgKey.includes(normOwner) ||
                normOwner.includes(orgKey) ||
                normOwner.startsWith(orgKey.slice(0, 4))
            ) {
                return { url: link, matchType: 'fuzzy' };
            } else {
                return { url: link, matchType: 'unverified' };
            }
        } catch {
            return { url: link, matchType: 'unverified' };
        }
    });

    return results;
}

module.exports = { getOrgGitHubLinks };

// main.js -> 
const { getOrgGitHubLinks } = require('./getOrgGitHubLinks');
const { PuppeteerCrawler, Dataset } = require('crawlee');

const crawler = new PuppeteerCrawler({
    async requestHandler({ request, page }) {
        const matchedLinks = await getOrgGitHubLinks(page);

        await Dataset.pushData({
            url: request.url,
            orgGitHubLinks: matchedLinks,
        });
    }
});

await crawler.run(['https://summerofcode.withgoogle.com/archive/2024/projects/...']);
