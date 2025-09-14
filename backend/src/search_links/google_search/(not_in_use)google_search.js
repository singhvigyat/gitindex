
import axios from 'axios'
import 'dotenv/config';
// import stringSimilarity from 'string-similarity';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function googleSearch(query, apiKey, searchEngineId) {
    try {
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=3`;

        const response = await axios.get(url);
        const results = response.data.items || [];

        // Extract top 3 links
        const topLinks = results.map((item, index) => ({
            rank: index + 1,
            title: item.title,
            link: item.link,
            snippet: item.snippet
        }));

        return topLinks;

    } catch (error) {
        console.error('Search failed:', error.message);
        return [];
    }
}


async function parsefile(inputFile, outputFile) {
    const raw = await fs.readFile(inputFile, 'utf8');
    const data = JSON.parse(raw);
    const API_KEY = process.env.GOOGLE_JSON_SEARCH_API;
    const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;
    const out = {};
    let totalOrgs = 0;
    let withLink = 0;
    let withoutLink = 0;

    for (const [key, org] of Object.entries(data)) {
        totalOrgs++;
        // const normName = normalize(org.orgName);
        // const threshold = 0.9;
        // const rawName = org.orgName

        if (org.githubLink == null) {
            const orgName = org.orgName
            const query = `site:github.com ${orgName}`;
            // const query = `${orgName} github`;


            console.log(`Searching for: "${query}"`);
            console.log('─'.repeat(50));

            const links = await googleSearch(query, API_KEY, SEARCH_ENGINE_ID);

            // if (links.length > 0) {
            //     links.forEach(result => {
            //         console.log(`${result.rank}. ${result.title}`);
            //         console.log(`   ${result.link}`);
            //         console.log(`   ${result.snippet.substring(0, 100)}...`);
            //         console.log();
            //     });
            // } else {
            //     console.log('No results found');
            // }

            const githubLink = links[0].link
            console.log("| github link fetched is this -> 😭🫡🫡", githubLink)

            if (githubLink) withLink++;
            else withoutLink++;


            out[key] = {
                ...org,
                githubLink: githubLink || null,
                lastUpdated: new Date().toISOString(),
            };
        } else {
            withLink++;

            out[key] = {
                ...org,
                lastUpdated: new Date().toISOString(),
            };
        }

        console.log(`Total orgs processed: ${totalOrgs}`);
        console.log(`Orgs with at least one GitHub link: ${withLink}`);
        console.log(`Orgs with no GitHub links: ${withoutLink}`);

        await fs.writeFile(outputFile, JSON.stringify(out, null, 2));
        console.log(`✅ Filtered data written to ${outputFile}`);
    }
}

// Usage example
async function main() {


    console.log(path.dirname(__dirname))
    const input = path.resolve(__dirname, '..', '..', '..', `data\\filtered_orgs\\github_search_filtered_orgs\\orgs_${process.env.YEAR}_github_search_filtered.json`);

    const output = path.resolve(__dirname, '..', '..', '..', `data\\filtered_orgs\\google_filtered_orgs\\orgs_${process.env.YEAR}_google_filtered.json`);

    await parsefile(input, output);




}

// Run the search
main();