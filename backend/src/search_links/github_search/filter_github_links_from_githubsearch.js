// src/filter_github_links.js
import fs from 'fs/promises';
import path from 'path';
import jaroWinkler from 'jaro-winkler';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import fetch from 'node-fetch';



// Define __filename and __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__dirname)

// score ->0.85 then links wo github  -> 59
// score ->0.9 then links  wo github -> 72

const STOPWORDS = new Set(['the', 'a', 'an']);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateSearchTerms(orgName) {
    const terms = [];
    const raw = orgName.trim();

    // 1️⃣ HIGHEST PRIORITY: If there's text in parentheses (likely an acronym), add it if ≥ 3 chars

    terms.push(raw)

    const parenMatch = raw.match(/\(([^)]+)\)/);
    if (parenMatch && parenMatch[1]) {
        const inside = parenMatch[1].trim();
        if (inside.length >= 3) {
            terms.push(inside);
        }
    }

    // Remove parentheses and punctuation, then split into words
    const withoutParen = raw.replace(/\([^)]*\)/g, '').trim();
    const noPunct = withoutParen.replace(/[^a-zA-Z0-9 ]+/g, '').trim();
    const words = noPunct.split(/\s+/).filter(Boolean);

    // 2️⃣ HIGH PRIORITY: First word only if it isn’t a stopword and ≥ 3 chars
    if (words.length > 0) {
        const first = words[0];
        if (first.length >= 3 && !STOPWORDS.has(first.toLowerCase())) {
            terms.push(first);
        }
    }

    // 3️⃣ MEDIUM-HIGH PRIORITY: If more than one word, combine all words first
    if (words.length > 1) {
        const allJoined = words.join('');
        if (allJoined.length >= 3) {
            terms.push(allJoined);
        }
        const allDashed = words.join('-');
        if (allDashed.length >= 3) {
            terms.push(allDashed);
        }

        // Acronym from first letters, only if length 3–5
        const acronym = words.map(w => w.charAt(0).toUpperCase()).join('');
        if (acronym.length >= 3 && acronym.length <= 5) {
            terms.push(acronym);
            terms.push(acronym.toLowerCase());
        }
    }

    // 4️⃣ MEDIUM PRIORITY: Combine just the first two words (if ≥ 3 chars)
    if (words.length >= 2) {
        const twoJoined = words.slice(0, 2).join('');
        if (twoJoined.length >= 3) {
            terms.push(twoJoined);
        }
        const twoDashed = words.slice(0, 2).join('-');
        if (twoDashed.length >= 3) {
            terms.push(twoDashed);
        }
    }

    // 5️⃣ LOWER PRIORITY: Cleaned version (no punctuation) if ≥ 3 chars and not identical to raw
    if (noPunct.length >= 3 && noPunct !== raw) {
        terms.push(noPunct);
    }

    // 6️⃣ LOWEST PRIORITY: Original full phrase if ≥ 5 chars (avoid very short generics)
    if (raw.length >= 5) {
        terms.push(raw);
    }

    // Remove duplicates while preserving order, and filter out anything < 3 chars
    const seen = new Set();
    return terms.filter(term => {
        const key = term.toLowerCase();
        if (term.length < 3 || seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}
// Helper: normalize strings for comparison
function normalize(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ' ')   // keep letters & digits
        .replace(/\s+/g, ' ')         // collapse spaces
        .trim();
}

async function githubSearchOrgs(term, perPage = 5) {
    const token = process.env.GITHUB_TOKEN;
    const q = encodeURIComponent(`${term} type:org`);
    const url = `https://api.github.com/search/users?q=${q}&per_page=${perPage}`;

    const headers = {
        Accept: 'application/vnd.github.v3+json',
        ...(token && { Authorization: `Bearer ${token}` })
    };

    while (true) {
        const resp = await fetch(url, { headers });

        // grab rate-limit headers
        const remaining = parseInt(resp.headers.get('x-ratelimit-remaining') || '0', 10);
        const resetTime = parseInt(resp.headers.get('x-ratelimit-reset') || '0', 10) * 1000; // to ms

        // if we've depleted our quota, wait until reset
        if (remaining === 0) {
            const now = Date.now();
            const waitMs = resetTime - now + 1000;  // add 1s buffer
            console.log(`⚠️ Rate limit reached. Waiting ${Math.ceil(waitMs / 1000)}s until ${new Date(resetTime).toISOString()}`);
            if (waitMs > 0) await sleep(waitMs);
            continue;  // then retry the fetch
        }

        // if still not OK (e.g. 500), throw error
        if (!resp.ok) {
            const body = await resp.json().catch(() => ({}));
            throw new Error(`GitHub API error: ${resp.status} ${resp.statusText} → ${JSON.stringify(body)}`);
        }

        // successful response with some remaining quota
        const data = await resp.json();
        return (data.items || []).map(item => {
            const { score, ...rest } = item;
            return { ...rest, isFuzzyMatch: false };
        });
    }
}

async function fallbackFuzzySearch(orgName) {
    const token = process.env.GITHUB_TOKEN;
    const url = `https://api.github.com/search/users?q=type:org&per_page=20`;
    const headers = { Accept: 'application/vnd.github.v3+json' };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const resp = await fetch(url, { headers });
    if (!resp.ok) return [];
    const { items = [] } = await resp.json();

    // Compute similarity of each login to our orgName
    console.log("comparing 🫡 ");
    items.forEach((item) => {
        const similarity = jaroWinkler(item.login.toLowerCase(), orgName.toLowerCase());
        console.log(`${item.login.toLowerCase()} vs ${orgName.toLowerCase()} = ${similarity.toFixed(3)}`);
    });
    console.log("END 🫡 ");

    const scores = items.map(item => {
        const { score, ...itemWithoutScore } = item; // Remove GitHub's internal score
        return {
            ...itemWithoutScore,
            fuzzyScore: jaroWinkler(item.login.toLowerCase(), orgName.toLowerCase()),
            isFuzzyMatch: true
        };
    });

    // Sort descending by score, keep top few
    scores.sort((a, b) => b.fuzzyScore - a.fuzzyScore);
    return scores.filter(x => x.fuzzyScore > 0.2).slice(0, 3); // threshold = 0.2, take top 3
}

async function smartSearchOrg(orgName) {
    const terms = generateSearchTerms(orgName);
    console.log('🔑 Candidate search terms (in priority order):', terms);

    for (const term of terms) {
        console.log(`\n➡️ Trying search term: "${term}"`);
        try {
            const res = await githubSearchOrgs(term, 5);
            if (res.length > 0) {
                console.log(`✅ Got ${res.length} result(s) for "${term}".`);
                return { termUsed: term, results: res };
            } else {
                console.log(`⚠️  No results for "${term}".`);
            }
        } catch (err) {
            console.error(`❌  Error while searching for "${term}":`, err.message);
        }
    }

    console.log('\n🔄 All heuristic searches failed; falling back to fuzzy matching on top orgs.');
    const fuzzyResults = await fallbackFuzzySearch(orgName);
    if (fuzzyResults.length > 0) {
        console.log(`✅  Fuzzy‐matched ${fuzzyResults.length} top candidate(s).`);
        return { termUsed: '[fallback-fuzzy]', results: fuzzyResults };
    }

    console.log('❌  No candidates found even after fallback.');
    return { termUsed: null, results: [] };
}


// Extract the “owner” segment from a GitHub URL.
// function extractOwner(githubUrl) {
//     try {
//         const u = new URL(githubUrl);
//         const host = u.hostname.toLowerCase();
//         if (host !== 'github.com' && host !== 'www.github.com') return null;
//         const parts = u.pathname.split('/').filter(Boolean);
//         if (parts.length === 0) return null;
//         return [parts[0], parts[1] || null];
//     } catch {
//         return null;
//     }
// }

async function parsefile(inputFile, outputFile) {
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
        const rawName = org.orgName

        if (org.githubLink == null) {
            const { termUsed, results } = await smartSearchOrg(rawName);

            if (!termUsed) {
                console.log('\nNo matching GitHub organization found for:', rawName);
                process.exit(0);
            }

            console.log(`\n▶ Term that finally worked: "${termUsed}"`);
            console.log('▶ Top candidates:\n');

            // results.forEach((item, idx) => {
            //     if (item.login && item.html_url) {
            //         console.log(`${idx + 1}. login: ${item.login}`);
            //         console.log(`   URL:   ${item.html_url}`);

            //         // Only show fuzzy score for fuzzy matches
            //         if (item.isFuzzyMatch && typeof item.fuzzyScore === 'number') {
            //             console.log(`   Fuzzy Score: ${item.fuzzyScore.toFixed(3)}`);
            //         }
            //         console.log('');
            //     }
            // });

            console.log("first result is this -> ")
            console.log(results[0].login)
            let githubLink = null
            // if (jaroWinkler(results[0].login, normalize(org.orgName)) >= 0.85 && jaroWinkler(results[0].login, normalize(org.orgName)) < 0.9) {
            //     console.log("github link for low score was-> ", normalize(org.orgName))
            //     console.log("❤️❤️❤️❤️❤️❤️the orgName was-> ", results[0].login)
            //     console.log(jaroWinkler(results[0].login, normalize(org.orgName)) )
            // }
            if (jaroWinkler(results[0].login, normalize(org.orgName)) >= 0.9) {
                githubLink = results[0].html_url
                console.log("saved github link -> ", githubLink)
            } else {
                console.log("No GithubLink Found")
            }

            if (githubLink) withLink++;
            else withoutLink++;

            out[key] = {
                ...org,
                githubLink: githubLink,
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

// Usage: node filter_github_links.js
(async () => {
    console.log(path.dirname(__dirname))
    const input = path.resolve(__dirname, `orgs_${process.env.YEAR}_filtered.json`);

    const output = path.resolve(__dirname, `orgs_${process.env.YEAR}_github_filtered.json`);
    await parsefile(input, output);
})();