import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

async function exportAllOrgs() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(__dirname, '..');
  const kvsDir = path.join(projectRoot, 'storage', 'key_value_stores', 'org-data');

  console.log('🔍 Reading files from:', kvsDir);
  let files;
  try {
    files = await fs.readdir(kvsDir);
  } catch (err) {
    console.error(`Cannot read directory ${kvsDir}:`, err.message);
    process.exit(1);
  }

  console.log(`🗂️  Found ${files.length} files`);

  // Map to accumulate merged org data by orgName
  const mergedOrgs = new Map();

  for (const fileName of files.filter(f => f.endsWith('.json'))) {
    const filePath = path.join(kvsDir, fileName);
    let data;
    try {
      data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    } catch (err) {
      console.warn(`⚠️ Skipping invalid JSON ${fileName}: ${err.message}`);
      continue;
    }
    if (!data.orgName) {
      console.warn(`⚠️ Skipping ${fileName}: missing orgName`);
      continue;
    }
    const name = data.orgName.trim();

    // If first time, store entire object
    if (!mergedOrgs.has(name)) {
      mergedOrgs.set(name, { ...data });
      console.log(`➕ Adding new org: ${name}`);
    } else {
      // Merge fields
      const existing = mergedOrgs.get(name);
      console.log(`🔄 Merging into existing org: ${name}`);
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          // merge arrays, dedupe
          existing[key] = Array.from(new Set([...(existing[key] || []), ...value]));
        } else if (value && typeof value === 'object') {
          // shallow merge objects
          existing[key] = { ...(existing[key] || {}), ...value };
        } else if (value != null) {
          // scalar: overwrite or keep existing
          existing[key] = value;
        }
      }
      existing.lastUpdated = new Date().toISOString();
    }
  }

  console.log(`✅ Merged into ${mergedOrgs.size} unique organizations`);

  // Convert to array or object; here as array
  const result = Array.from(mergedOrgs.values());
  const outputPath = path.join(projectRoot, 'all-organizations.json');

  try {
    await fs.writeFile(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`🎉 Exported merged data to ${outputPath}`);
  } catch (err) {
    console.error(`Failed to write ${outputPath}: ${err.message}`);
    process.exit(1);
  }
}

exportAllOrgs().catch(err => {
  console.error(err);
  process.exit(1);
});