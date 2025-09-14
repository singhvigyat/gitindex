import path from "path";
import fs from 'fs/promises'
import { fileURLToPath } from "url";
import { channel } from "diagnostics_channel";

interface OrgData {
    orgName: string;
    githubLink?: string | null;
    year?: string;
    logoUrl?: string;
    url?: string;
    techContent?: string[];
    topicContent?: string[];
    websiteLink?: string;
    contactInfo?: any;
    projectsData?: any;
    projectLinks?: string[];
    githubLinksFromWebsite?: string[];
    githubLinksFromProjects?: string[];
    lastUpdated?: string;
    [key: string]: any;
}

let orgCache: Map<string, OrgData> | null = null;
let cacheStats = {
    totalOrgs: 0,
    orgsWithGithubLinks: 0,
    lookups: 0,
    hits: 0
}

async function buildCache(): Promise<Map<string, OrgData>> {
    const cache = new Map<string, OrgData>();
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const projectRoot = path.resolve(__dirname, '..', '..')
    const finalOrgs = path.join(projectRoot, 'src', 'data', 'final_orgs')

    console.log(`Building Github Link cache...`);
    console.log(`Scanning: ${finalOrgs}`)

    let files: string[]
    try {
        files = await fs.readdir(finalOrgs);
    }
    catch (err: any) {
        console.error(`❌ Cannot read directory ${finalOrgs}:`, err.message);
        throw err;
    }

    console.log(`Processing ${files.length} files...`)
    for (const fileName of files.filter(f => f.endsWith('.json'))) {
        const filePath = path.join(finalOrgs, fileName);

        try {
            const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));

            for (const [key, value] of Object.entries(data)) {
                const org = value as OrgData;
                const orgName = org.orgName?.toString().trim();

                if (orgName) {
                    cacheStats.totalOrgs++;

                    // Case-insensitive storage
                    const normalizedName = orgName.toLowerCase();
                    cache.set(normalizedName, org);

                    // Track orgs with GitHub links
                    if (org.githubLink && org.githubLink.trim() !== '') {
                        cacheStats.orgsWithGithubLinks++;
                    }
                }
            }
        } catch (err: any) {
            console.warn(`⚠️ Skipping ${fileName}: ${err.message}`);
        }
    }

    const years = new Set(Array.from(cache.values()).map(org => org.year).filter(Boolean));


    console.log('✅ Cache built successfully!');
    console.log(`📊 ${cacheStats.totalOrgs} total organizations`);
    console.log(`🔗 ${cacheStats.orgsWithGithubLinks} with GitHub links`);
    console.log(`📅 Years found: ${Array.from(years).sort().join(', ')}`);

    const crossYearBenefit = cacheStats.orgsWithGithubLinks;
    console.log(`⚡ Potential API savings for future years: ${crossYearBenefit} searches`);

    return cache;

}

export async function cacheValidator(orgName: string): Promise<string | null> {
    if (!orgCache) {
        orgCache = await buildCache()
    }
    cacheStats.lookups++;
    const normalizedName = (orgName ?? "").toString().trim().toLowerCase()

    if (!normalizedName) return null;

    const found = orgCache.get(normalizedName);
    if (found) {
        cacheStats.hits++;
    }
    // console.log("this is what is found", found)
    // console.log(found!.githubLink)
    // console.log(found!['githubLink'])
    if (found)
        return found!.githubLink || null;
    else return null;
}


export function getCacheStats() {
    console.log("in get cache stats")
    const hitRate = cacheStats.lookups > 0 ? ((cacheStats.hits / cacheStats.lookups) * 100).toFixed(1) : '0.0';

    return { ...cacheStats, hitRate: `${hitRate}%` }
}

export function logCacheSession(): void {
    const stats = getCacheStats()
    console.log('\n📈 Cache Session Summary:');
    console.log(`   🔍 Total lookups: ${stats.lookups}`);
    console.log(`   ✅ Cache hits: ${stats.hits}`);
    console.log(`   📊 Hit rate: ${stats.hitRate}`);

    if (stats.hits > 0) {
        console.log(`   💰 API calls saved: ${stats.hits}`);
        console.log(`   ⏱️ File I/O operations saved: ${stats.hits * stats.totalOrgs}`);
    }
}