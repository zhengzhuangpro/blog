import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DOCS = path.join(ROOT, 'docs');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.(md|mdx)$/i.test(e.name)) out.push(full);
  }
  return out;
}

function normalize(s) {
  return s
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

let changed = 0;
let removedHeadings = 0;
let removedZwsp = 0;

for (const file of walk(DOCS)) {
  let raw = fs.readFileSync(file, 'utf8');
  const original = raw;

  const zwspCount = (raw.match(/[\u200B-\u200D\uFEFF]/g) || []).length;
  if (zwspCount > 0) {
    raw = raw.replace(/[\u200B-\u200D\uFEFF]/g, '');
    removedZwsp += zwspCount;
  }

  const fm = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) {
    const titleMatch = fm[1].match(/^title:\s*(.+)$/m);
    if (titleMatch?.[1]) {
      const title = titleMatch[1].trim().replace(/^['"]|['"]$/g, '');
      const after = raw.slice(fm[0].length);
      const lines = after.split('\n');

      let firstIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i].trim();
        if (!l) continue;
        firstIdx = i;
        break;
      }

      if (firstIdx >= 0 && /^#\s+/.test(lines[firstIdx].trim())) {
        const heading = lines[firstIdx].trim().replace(/^#\s+/, '');
        if (normalize(heading) === normalize(title)) {
          lines.splice(firstIdx, 1);
          if (firstIdx < lines.length && lines[firstIdx].trim() === '') lines.splice(firstIdx, 1);
          raw = raw.slice(0, fm[0].length) + lines.join('\n');
          removedHeadings++;
        }
      }
    }
  }

  if (raw !== original) {
    fs.writeFileSync(file, raw);
    changed++;
  }
}

console.log(`changed_files=${changed}`);
console.log(`removed_headings=${removedHeadings}`);
console.log(`removed_zwsp=${removedZwsp}`);
