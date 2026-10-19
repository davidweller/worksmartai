/**
 * Fails when site copy breaks the WorkSmart-AI Source of Truth (docs/, kept local):
 * retired names, banned wording and claims we don't make.
 * Run with `npm run check:copy`; part of `npm run check`.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');

/** Folders with no marketing copy. */
const SKIP_DIRS = new Set(['academy', 'academy-api', 'lib', 'utils', 'assets']);

/** Legal pages keep issuer wording such as "clients" and "employees". */
const LEGAL =
  /(privacy-policy|terms-of-service|cookie-policy|modern-slavery|sustainability|insurance-statement|accessibility-statement|equality-diversity-inclusion)\.astro$/;

/** Blog posts may quote sources verbatim. */
const POSTS = /data[\\/]post[\\/]/;

const RULES = [
  {
    name: 'brand name variant',
    re: /\bWork ?Smart ?AI\b|\bWorksmart[- ]AI\b|\bWorksmart-ai\b(?!\.co\.uk|-ltd)/i,
    ok: (m) => m === 'WorkSmart-AI',
  },
  { name: 'W-numbered workshop', re: /\bW(1[0-2]|[1-9])\b|twelve-workshop|12-workshop/i },
  {
    name: '"&" in a course or service title',
    re: /\b(Foundations|Pedagogy|Leadership|Workshops|Word|Summarising|Comms) (&|&amp;) /i,
  },
  { name: 'em-dash', re: /—|&mdash;|&#8212;/, skip: POSTS },
  // Quotations and citation titles keep their own wording, via `allow`.
  {
    name: 'hype word',
    re: /\b(revolutionary|game-changing|disruptive|unlock(s|ed|ing)?)\b/i,
    skip: POSTS,
    allow: /only be unlocked if/,
  },
  {
    name: '"employees" (use "staff")',
    re: /\bemployees?\b/i,
    skip: [LEGAL, POSTS, /evidence\.ts$/],
    allow: /Employee Earnings/,
  },
  { name: '"client" in client-facing copy', re: /\bclients?\b/i, skip: [LEGAL, POSTS] },
  { name: 'old Capability Check length', re: /\b45[- ]minutes?\b/i },
  { name: 'retired calculator name', re: /\b(AI )?ROI Calculator\b|\bAI Calculator\b/ },
  { name: 'retired guide name', re: /From Chatbot to Workflows?\b/i },
  {
    name: 'retired service name',
    re: /Clarity Programme|Readiness (Quiz|Index)|Needs Analysis|Impact Report|Leadership (& |&amp; )?(Manager )?Consulting|AI Health Check/i,
  },
  { name: 'fixed 3-hour format', re: /\b(3|three)[- ]hour\b/i },
  { name: 'old hierarchy size', re: /\b(six|6|four|4)[- ]level\b/i },
];

async function collect(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) files.push(...(await collect(full)));
    } else if (/\.(astro|md|mdx|ts|yaml)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const skipped = (rule, file) => [rule.skip].flat().some((re) => re && re.test(file));

const problems = [];
for (const file of await collect(srcDir)) {
  const rel = path.relative(root, file);
  const lines = (await readFile(file, 'utf8')).split('\n');
  for (const rule of RULES) {
    if (skipped(rule, rel)) continue;
    lines.forEach((line, i) => {
      if (rule.allow && rule.allow.test(line)) return;
      // Skip URLs, email addresses, handles, import paths and code comments.
      const text = line.replace(
        /https?:\/\/\S+|[\w.+-]+@[\w.-]+|@\w+|\bworksmart-ai\.co\.uk\S*|['"]~?\/[^'"]*['"]|\/\/.*$|\/\*.*?\*\//gi,
        ''
      );
      const match = text.match(rule.re);
      if (match && !(rule.ok && rule.ok(match[0]))) problems.push(`${rel}:${i + 1}  ${rule.name}: "${match[0]}"`);
    });
  }
}

if (problems.length) {
  console.error(`Copy check failed: ${problems.length} problem(s)\n`);
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('Copy check passed.');
