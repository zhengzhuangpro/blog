import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'docs');
const OUT = path.join(ROOT, 'docs.json');

const SECTION_ORDER = [
  'guide',
  'frontend',
  'egg',
  'flutter',
  'docker',
  'android',
  'git',
  'go',
  'computer',
  'mysql',
  'interview',
  '错误集'
];

const SECTION_LABELS = {
  guide: '指南',
  frontend: '前端',
  egg: 'Egg',
  flutter: 'Flutter',
  docker: 'Docker',
  android: 'Android',
  git: 'Git',
  go: 'Go',
  computer: '高效开发环境',
  mysql: '数据库',
  interview: '面试',
  错误集: '错误集'
};

function isDocFile(file) {
  return /\.(md|mdx)$/i.test(file);
}

function toDocPath(absFile) {
  const rel = path.relative(ROOT, absFile).replace(/\\/g, '/');
  return rel.replace(/\.(md|mdx)$/i, '');
}

function sortByName(a, b) {
  return a.localeCompare(b, 'zh-Hans-CN');
}

function ensureIndexFromReadme(absDir) {
  const readmeCandidates = ['README.md', 'README.mdx'];
  const indexCandidates = ['index.mdx', 'index.md'];

  const readme = readmeCandidates
    .map((n) => path.join(absDir, n))
    .find((p) => fs.existsSync(p));

  const hasIndex = indexCandidates.some((n) => fs.existsSync(path.join(absDir, n)));

  if (!readme || hasIndex) return;
  const content = fs.readFileSync(readme, 'utf8');
  fs.writeFileSync(path.join(absDir, 'index.mdx'), content);
}

function buildPagesForDir(absDir) {
  ensureIndexFromReadme(absDir);
  const entries = fs.readdirSync(absDir, { withFileTypes: true });

  const files = entries
    .filter((e) => e.isFile() && isDocFile(e.name))
    .map((e) => path.join(absDir, e.name))
    .sort((a, b) => {
      const an = path.basename(a).toLowerCase();
      const bn = path.basename(b).toLowerCase();
      if (an.startsWith('readme.')) return -1;
      if (bn.startsWith('readme.')) return 1;
      if (an.startsWith('index.')) return -1;
      if (bn.startsWith('index.')) return 1;
      return sortByName(an, bn);
    });

  const dirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort(sortByName);

  const pages = [];

  for (const f of files) {
    const rel = path.relative(DOCS_DIR, f).replace(/\\/g, '/').toLowerCase();
    if (rel === 'index.mdx' || rel === 'index.md') continue;
    const base = path.basename(f).toLowerCase();
    if (base === 'readme.md' || base === 'readme.mdx') continue;
    pages.push(toDocPath(f));
  }

  for (const d of dirs) {
    const childDir = path.join(absDir, d);
    const childPages = buildPagesForDir(childDir);
    if (childPages.length === 0) continue;
    pages.push({
      group: d,
      pages: childPages
    });
  }

  return pages;
}

function orderedTopDirs() {
  const all = fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name);

  const inOrder = SECTION_ORDER.filter((x) => all.includes(x));
  const rest = all.filter((x) => !SECTION_ORDER.includes(x)).sort(sortByName);
  return [...inOrder, ...rest];
}

function buildNavigation() {
  const pages = ['docs/index'];
  for (const dirName of orderedTopDirs()) {
    const dirAbs = path.join(DOCS_DIR, dirName);
    const dirPages = buildPagesForDir(dirAbs);
    if (dirPages.length === 0) continue;
    pages.push({
      group: SECTION_LABELS[dirName] || dirName,
      pages: dirPages
    });
  }
  return {
    tabs: [
      {
        tab: '文档',
        groups: [
          {
            group: '全部文档',
            pages
          }
        ]
      }
    ]
  };
}

const docsJson = {
  $schema: 'https://mintlify.com/docs.json',
  name: '北关尔士',
  description: '记录我生活的点点积极',
  theme: 'mint',
  colors: {
    primary: '#0077B6',
    light: '#00B4D8',
    dark: '#023E8A'
  },
  navigation: buildNavigation(),
  footerSocials: {
    github: 'https://github.com/zhengzhuang96'
  }
};

fs.writeFileSync(OUT, JSON.stringify(docsJson, null, 2) + '\n');

const countPages = (node) => {
  if (Array.isArray(node)) return node.reduce((n, x) => n + countPages(x), 0);
  if (typeof node === 'string') return 1;
  if (!node || typeof node !== 'object') return 0;
  return countPages(node.pages || []) + countPages(node.groups || []) + countPages(node.tabs || []);
};

console.log(`generated docs.json with ${countPages(docsJson.navigation)} page refs`);
