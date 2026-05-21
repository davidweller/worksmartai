/**
 * Ensures every stylesheet linked from dist HTML exists on disk.
 * Run after `npm run build` and before deploying dist to Hostinger.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(fullPath)));
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const stylesheetPattern = /href="(\/_astro\/[^"]+\.css)"/g;
const missing = new Set();

for (const htmlPath of await collectHtmlFiles(distDir)) {
  const html = await readFile(htmlPath, 'utf8');
  for (const match of html.matchAll(stylesheetPattern)) {
    const assetPath = path.join(distDir, match[1].slice(1));
    try {
      await readFile(assetPath);
    } catch {
      missing.add(match[1]);
    }
  }
}

if (missing.size > 0) {
  console.error('verify-dist: missing CSS files referenced by HTML:');
  for (const href of [...missing].sort()) {
    console.error(`  ${href}`);
  }
  process.exit(1);
}

console.log('verify-dist: all stylesheet assets present in dist/');
