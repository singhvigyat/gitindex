import FireCrawlApp from '@mendable/firecrawl-js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log(path.resolve(__dirname + '..\\..\\..\\..\\.env'))
dotenv.config({ path: path.resolve(__dirname + '..\\..\\..\\..\\.env') })

console.log(process.env.FIRE_CRAWL)
const app = new FireCrawlApp({ apiKey: process.env.FIRE_CRAWL });

function truncateURL(url) {
    return url.split("/").slice(0, 4).join("/") + "/"
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function fireCrawlSearch(query) {
    while (true) {
        try {
            let links = []

            const result = await app.search(`${query}`, { limit: 1 })
                .then(searchResult => {
                    // Process the search results
                    searchResult.data.forEach(result => {
                        links.push(result.url),
                            console.log(`🔍Title: ${result.title}`);
                        console.log(`🔗URL: ${result.url}`);
                        console.log(`Description: ${result.description}`);
                    });
                });
            console.log("link recieved is this -> ", links)
            console.log(Array.isArray(links));

            return links;

        } catch (error) {
            console.error('Search failed, waiting 1 minute before retry', error.message);
            await sleep(60000);
            continue;
            // return null;
        }
    }
}

async function parsefile(inputFile, outputFile) {
    const raw = await fs.readFile(inputFile, 'utf8')
    const data = JSON.parse(raw)
    const API_KEY = process.env.FIRE_CRAWL

    const out = {}
    let totalOrgs = 0;
    let withLink = 0;
    let withoutLink = 0;

    for (const [key, org] of Object.entries(data)) {
        totalOrgs++;
        if (org.githubLink == null) {
            const orgName = org.orgName;
            const query = `site:github.com ${orgName}`

            console.log(`Searching for: ${query}`);
            console.log('-'.repeat(50))

            const links = await fireCrawlSearch(query, API_KEY);


            let githubLink = links[0];
            const truncatedLink = truncateURL(githubLink);

            githubLink = truncatedLink

            // console.log(links[0]);

            console.log("recieved this truncated github link -> ", githubLink)
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
                lastUpdated: new Date().toISOString()
            }
            console.log(`Total orgs processed: ${totalOrgs}`);
            console.log(`Orgs with at least one GitHub link: ${withLink}`);
            console.log(`Orgs with no GitHub links: ${withoutLink}`);

            await fs.writeFile(outputFile, JSON.stringify(out, null, 2));
            console.log(`✅ Filtered data written to ${outputFile}`);
        }
    }

}

async function main() {
    console.log(path.dirname(__dirname));
    const input = path.resolve(__dirname, '..', '..', '..', `data\\filtered_orgs\\github_search_filtered_orgs\\orgs_${process.env.YEAR}_github_search_filtered.json`);
    const output = path.resolve(__dirname, '..', '..', '..', `data\\filtered_orgs\\firecrawl_filtered_orgs\\orgs_${process.env.YEAR}_firecrawl_filtered.json`);

    await parsefile(input, output);
}

main(); 
