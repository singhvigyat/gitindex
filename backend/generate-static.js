import path, { dirname } from "path"
import { fileURLToPath } from "url"
import * as fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const filePath = path.join(__dirname, 'data')
const finalOrgs = path.join(filePath, 'final_orgs')
const outputDir = path.join(__dirname, '..', 'frontend', 'public')

const generateStaticData = () => {
    let allOrgs = []
    let allOrgsMap = new Map()
    let allYearsSet = new Set();
    let allTechnologies = new Set();
    let allTopics = new Set();

    fs.readdirSync(finalOrgs).forEach(files => {
        const file = files;
        const yearFilePath = path.join(finalOrgs, `${file}`)
        const jsonData = fs.readFileSync(yearFilePath, 'utf-8')
        const orgsOfYear = JSON.parse(jsonData);
        const year = file?.split('_')[1];

        const techContentInFile = Object.values(orgsOfYear).flatMap(org => org.techContent)
        const topicContentInFile = Object.values(orgsOfYear).flatMap(org => org.topicContent)

        techContentInFile.forEach(ele => allTechnologies.add(ele))
        topicContentInFile.forEach(ele => allTopics.add(ele))

        allOrgs.push({ year, orgsOfYear });
        allOrgsMap.set(year, orgsOfYear)
        allYearsSet.add(year)
    })

    let allYearsArray = Array.from(allYearsSet);
    let allTechnologiesArray = Array.from(allTechnologies)
    let allTopicsArray = Array.from(allTopics)

    const responseFormat = {
        allOrgs,
        allOrgsMap: Object.fromEntries(allOrgsMap),
        allYearsArray,
        allTopicsArray,
        allTechnologiesArray
    }

    const outputFilePath = path.join(outputDir, 'data.json')
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(responseFormat, null, 2))
    console.log(`✅ Successfully generated ${outputFilePath}`);
}

generateStaticData()
