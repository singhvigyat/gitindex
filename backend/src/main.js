import { PlaywrightCrawler, log } from 'crawlee';
import { router } from './handlers.js';
import 'dotenv/config'

log.setLevel(log.LEVELS.DEBUG);

log.debug('Setting up crawler.');
const crawler = new PlaywrightCrawler({
    requestHandler: router,
});

await crawler.run([`https://summerofcode.withgoogle.com/archive/${process.env.YEAR}/organizations`]);


