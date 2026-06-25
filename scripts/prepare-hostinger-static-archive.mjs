/**
 * Build (optional) and zip dist/ for Hostinger static deploy.
 * Archive root must contain index.html and _astro/ (not a dist/ wrapper).
 *
 * Usage:
 *   node scripts/prepare-hostinger-static-archive.mjs
 *   node scripts/prepare-hostinger-static-archive.mjs --skip-build
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const deployDir = path.join(root, '.hostinger-deploy');
const skipBuild = process.argv.includes('--skip-build');

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

async function ensureDist() {
  if (!existsSync(distDir)) {
    throw new Error('dist/ not found. Run npm run build first.');
  }
  const entries = await readdir(distDir);
  if (entries.length === 0) {
    throw new Error('dist/ is empty. Run npm run build first.');
  }
}

async function createZip(zipPath) {
  // tar is available on Windows 10+, macOS, and Linux CI runners
  execSync(`tar -acf "${zipPath}" -C "${distDir}" .`, { stdio: 'inherit' });
}

async function main() {
  if (!skipBuild) {
    console.log('Running npm run build…');
    execSync('npm run build', { cwd: root, stdio: 'inherit' });
  }

  await ensureDist();
  await mkdir(deployDir, { recursive: true });

  const zipName = `worksmart_${timestamp()}.zip`;
  const zipPath = path.join(deployDir, zipName);

  await createZip(zipPath);

  const { size } = await stat(zipPath);
  console.log(`Prepared ${zipPath} (${(size / 1024 / 1024).toFixed(2)} MB)`);
  console.log(zipPath);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
