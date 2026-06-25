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
const layoutCssFiles = [];

for (const htmlPath of await collectHtmlFiles(distDir)) {
  const html = await readFile(htmlPath, 'utf8');
  for (const match of html.matchAll(stylesheetPattern)) {
    const assetPath = path.join(distDir, match[1].slice(1));
    try {
      await readFile(assetPath);
      if (match[1].includes('Layout.') && match[1].endsWith('.css')) {
        layoutCssFiles.push(assetPath);
      }
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

for (const cssPath of [...new Set(layoutCssFiles)]) {
  const css = await readFile(cssPath, 'utf8');
  const mediaQueryCount = (css.match(/@media/g) ?? []).length;
  if (mediaQueryCount < 5) {
    console.error(`verify-dist: ${path.relative(distDir, cssPath)} has only ${mediaQueryCount} @media rule(s).`);
    console.error('verify-dist: responsive Tailwind breakpoints were likely stripped during CSS compression.');
    process.exit(1);
  }
}

console.log('verify-dist: all stylesheet assets present in dist/ with responsive @media rules');
