
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
import { constructGlobObjectsFromGlobs } from 'crawlee';

export const getOrgs = (req: any, res: any) => {
    const { year } = req.query;
    // const str = JSON.stringify(year);
    // console.log(str);
    // console.log(`this is from controller in be: ${year}`);
    // console.log(year)

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename)
    const filePath = path.join(__dirname, '..', '..', '/data')
    const orgFilePath = path.join(filePath, `/final_orgs/orgs_${year}_firecrawl_filtered.json`)
    const jsonData = fs.readFileSync(orgFilePath, 'utf-8')
    const organizations = JSON.parse(jsonData)

    res.json({
        organizations
    })
}