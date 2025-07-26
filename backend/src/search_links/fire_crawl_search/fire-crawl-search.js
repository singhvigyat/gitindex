// Install with npm install @mendable/firecrawl-js
import FireCrawlApp from '@mendable/firecrawl-js';

const app = new FireCrawlApp({ apiKey: 'fc-2a0ad14d4c6a41ff8c3e42bba8ff55fb' });


try {
    const searchResult = await app.search(
        'Top restaurants in San Francisco',
        {
            limit: 5,
            scrapeOptions: {
                "formats": ["markdown"]
            }
        }
    );


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
    return [];
}


