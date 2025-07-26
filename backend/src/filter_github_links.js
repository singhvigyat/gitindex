// src/filter_github_links.js
import fs from 'fs/promises';
import path from 'path';
import jaroWinkler from 'jaro-winkler';
import { fileURLToPath } from 'url';
import 'dotenv/config'

// Define __filename and __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: normalize strings for comparison
function normalize(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ' ')   // keep letters & digits
        .replace(/\s+/g, ' ')         // collapse spaces
        .trim();
}

// Extract the “owner” segment from a GitHub URL.
function extractOwner(githubUrl) {
    try {
        const u = new URL(githubUrl);
        const host = u.hostname.toLowerCase();
        if (host !== 'github.com' && host !== 'www.github.com') return null;
        const parts = u.pathname.split('/').filter(Boolean);
        if (parts.length === 0) return null;
        return [parts[0], parts[1] || null];
    } catch {
        return null;
    }
}

async function filterOrgFile(inputFile, outputFile) {
    const raw = await fs.readFile(inputFile, 'utf8');
    const data = JSON.parse(raw);

    const out = {};
    let totalOrgs = 0;
    let withLink = 0;
    let withoutLink = 0;

    for (const [key, org] of Object.entries(data)) {
        totalOrgs++;
        const normName = normalize(org.orgName);
        const threshold = 0.9;

        function filterLinks(arr = []) {
            return arr.filter(link => {
                const owner = extractOwner(link);
                if (!owner) return false;
                const [orgPart, repoPart] = owner;
                const scoreOrg = orgPart ? jaroWinkler(normName, normalize(orgPart)) : 0;
                const scoreRepo = repoPart ? jaroWinkler(normName, normalize(repoPart)) : 0;
                return scoreOrg >= threshold;
            });
        }

        const filteredProjectLinks = filterLinks(org.projectLinks);
        const filteredWebsiteLinks = filterLinks(org.githubLinksFromWebsite);
        const filteredProjectPageLinks = filterLinks(org.githubLinksFromProjects);


        // out[key] = {
        //     ...org,

        //     lastUpdated: new Date().toISOString(),
        // };


        const allLinks = [
            ...org.projectLinks,
            ...org.githubLinksFromWebsite,
            ...org.githubLinksFromProjects
        ];

        // Find the best matching link
        let best = { url: null, score: 0 };
        for (const link of allLinks) {
            const pair = extractOwner(link);
            if (!pair) continue;
            const [orgPart, repoPart] = pair;
            const scoreOrg = orgPart ? jaroWinkler(normName, normalize(orgPart)) : 0;
            const scoreRepo = repoPart ? jaroWinkler(normName, normalize(repoPart)) : 0;
            const score = scoreOrg;
            if (score > best.score) {
                best = {
                    url: `https://github.com/${orgPart}`,
                    score
                };
            }
        }

        // Assign the selected githubLink if it meets threshold
        let githubLink = null;
        if (best.url && best.score >= threshold) {
            githubLink = best.url;
            withLink++;
        } else {
            withoutLink++;
        }

        out[key] = {
            ...org,
            githubLink,
            projectLinks: filteredProjectLinks,
            githubLinksFromWebsite: filteredWebsiteLinks,
            githubLinksFromProjects: filteredProjectPageLinks,
            lastUpdated: new Date().toISOString(),
        };

    }

    console.log(`Total orgs processed: ${totalOrgs}`);
    console.log(`Orgs with at least one GitHub link: ${withLink}`);
    console.log(`Orgs with no GitHub links: ${withoutLink}`);

    await fs.writeFile(outputFile, JSON.stringify(out, null, 2));
    console.log(`✅ Filtered data written to ${outputFile}`);
}

// Usage: node filter_github_links.js
(async () => {
    const input = path.resolve(path.dirname(__dirname), 'all-organizations.json');
    const output = path.resolve(__dirname, `orgs_${process.env.YEAR}_filtered.json`);
    await filterOrgFile(input, output);
})();