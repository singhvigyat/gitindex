import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';


// export async function cacheValidator(orgName: string) {
//     const __dirname = path.dirname(fileURLToPath(import.meta.url));
//     const projectRoot = path.resolve(__dirname, '..', '..')
//     const finalOrgs = path.join(projectRoot, 'src', 'data', 'final_orgs')
//     let foundOrg ;

//     console.log('🔍 Reading files from:', finalOrgs)
//     let files;

//     try {
//         files = await fs.readdir(finalOrgs);
//     } catch (err: any) {
//         console.error(`Cannot read directory ${finalOrgs}: `, err.message);
//         process.exit(1);
//     }
//     console.log(`Found ${files.length} files`);

//     for (const fileName of files.filter(f => f.endsWith('.json'))) {
//         const filePath = path.join(finalOrgs, fileName);
//         let data;
//         try {
//             data = JSON.parse(await fs.readFile(filePath, 'utf-8'))
//         } catch (err: any) {
//             console.warn(`Skipping invalid JSON ${fileName}: ${err.message}`)
//             continue;
//         }


//         for (const [key, value] of Object.entries(data)) {

//             // console.log(key, (value as any)['orgName']);
//             const orgNameInData = (value as any)['orgName'].toString().trim() ?? "";
//             orgName = (orgName ?? "").toString().trim();

//             if (orgNameInData === orgName) {
//                 // console.log(value);
//                 foundOrg = value;
//                 return foundOrg;
//             }

//         }
//         console.log("Not Found");
//     }

//     return null; 

// }