import FireCrawlApp from '@mendable/firecrawl-js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import path from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log(path.resolve(__dirname + '..\\..\\..\\..\\.env'))
dotenv.config({ path: path.resolve(__dirname + '..\\..\\..\\..\\.env') })

console.log(process.env.FIRE_CRAWL)
const app = new FireCrawlApp({ apiKey: process.env.FIRE_CRAWL });

try {
    // const searchResult = await app.search(
    //     'Top restaurants in San Francisco',
    //     {
    //         limit: 5,
    //         scrapeOptions: {
    //             "formats": ["markdown"]
    //         }
    //     }
    // );


    app.search("site:github.com gitlab", { limit: 1 })
        .then(searchResult => {
            // Process the search results
            searchResult.data.forEach(result => {
                console.log(`🔍Title: ${result.title}`);
                console.log(`🔗URL: ${result.url}`);
                console.log(`Description: ${result.description}`);
            });
        });


    // const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=3`;

    // const response = await axios.get(url);
    // const results = response.data.items || [];

    //     // Extract top 3 links
    //     const topLinks = results.map((item, index) => ({
    //         rank: index + 1,
    //         title: item.title,
    //         link: item.link,
    //         snippet: item.snippet
    //     }));

    //     return topLinks;

} catch (error) {
    console.error('Search failed:', error.message);

}


