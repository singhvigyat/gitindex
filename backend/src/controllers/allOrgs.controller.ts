import path, { dirname } from "path"
import { fileURLToPath } from "url"
import * as fs from 'fs'


export const getAllOrgs = (req: any, res: any) => {

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const filePath = path.join(__dirname, '..', '..', '/data')
    const finalOrgs = path.join(filePath, '/final_orgs/')
    const numberOfFiles = fs.readdirSync(finalOrgs).length
    // console.log(`total years are : ${numberOfFiles}`)
    let allOrgs: any = []
    let allOrgsMap = new Map()
    let allYearsSet = new Set();

    fs.readdirSync(finalOrgs).forEach(files => {
        const file = files;
        const yearFilePath = path.join(finalOrgs, `/${file}`)
        const jsonData = fs.readFileSync(yearFilePath, 'utf-8')
        const orgsOfYear = JSON.parse(jsonData);
        const year = file?.split('_')[1];
        // console.log("year ", year);
        allOrgs.push({ year, orgsOfYear });
        allOrgsMap.set(year, orgsOfYear)
        allYearsSet.add(year)
        // console.log(allOrgsMap)
        // console.log(allOrgs.length)
    }


    )
    console.log("all orgs are:", allYearsSet)

    console.log("final length is ", allOrgsMap.size)

    let allYearsArray = Array.from(allYearsSet);
    res.json({
        allOrgs
        , allOrgsMap: Object.fromEntries(allOrgsMap),
        allYearsArray
    })


}
