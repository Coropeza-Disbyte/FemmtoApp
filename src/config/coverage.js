const fs      = require('fs');
const path    = require('path');
const root    = path.resolve(__dirname, '../../');
const data    = require('./versions.json');

const version = process.argv[2] || data.current;
const vdata   = data.versions[version];

if (!vdata) {
  console.log(`\n Versión ${version} no encontrada en versions.json`);
  process.exit(1);
}

const catalog  = data.featureCatalog || {};
const features = Object.entries(vdata.features);
const total    = features.length;
const withPO   = features.filter(([, v]) => v.pageObject);
const withSpec = features.filter(([, v]) => v.spec);
const byStack  = {};

features.forEach(([name, v]) => {
  const s = v.stack;
  if (!byStack[s]) byStack[s] = { total: 0, po: 0, spec: 0 };
  byStack[s].total++;
  if (v.pageObject) byStack[s].po++;
  if (v.spec)       byStack[s].spec++;
});

const fileWarnings = [];

function fileExists(relPath) {
  return fs.existsSync(path.join(root, relPath));
}

function checkFiles(name, v) {
  const cat = catalog[name];
  if (!cat) return;
  if (v.pageObject && cat.pageObjectFile && !fileExists(cat.pageObjectFile)) {
    fileWarnings.push(`  ⚠  ${name}: pageObjectFile no existe → ${cat.pageObjectFile}`);
  }
  if (v.spec && cat.specFile && !fileExists(cat.specFile)) {
    fileWarnings.push(`  ⚠  ${name}: specFile no existe     → ${cat.specFile}`);
  }
}

features.forEach(([name, v]) => checkFiles(name, v));

const bar = (n, t) => {
  const filled = Math.round((n / t) * 20);
  return '[' + '█'.repeat(filled) + '░'.repeat(20 - filled) + ']';
};

console.log(`\n Cobertura de tests — Femmto v${version}`);
if (vdata.date)   console.log(` ${vdata.date} | Rama: ${vdata.branch}`);
if (!vdata.date)  console.log(` Rama: ${vdata.branch} (versión histórica)`);
console.log(`${'─'.repeat(60)}`);
console.log(` Page Objects: ${bar(withPO.length, total)} ${withPO.length}/${total} (${Math.round(withPO.length / total * 100)}%)`);
console.log(` Specs:        ${bar(withSpec.length, total)} ${withSpec.length}/${total} (${Math.round(withSpec.length / total * 100)}%)`);

console.log(`\n Por stack:`);
Object.entries(byStack).forEach(([stack, s]) => {
  console.log(`   ${stack.padEnd(14)} PO: ${String(s.po).padStart(2)}/${s.total}   Spec: ${String(s.spec).padStart(2)}/${s.total}`);
});

console.log(`\n Detalle:`);
features.forEach(([name, v]) => {
  const po   = v.pageObject ? '✓' : '✗';
  const spec = v.spec       ? '✓' : '✗';
  const since = v.since     ? `  [desde v${v.since}]` : '';
  const cat  = catalog[name] || {};

  console.log(`   ${po} PO  ${spec} Spec  ${name.padEnd(36)}${since}`);

  if (version === data.current) {
    if (v.pageObject && cat.pageObjectFile) console.log(`          PO   → ${cat.pageObjectFile}`);
    if (v.spec       && cat.specFile)       console.log(`          Spec → ${cat.specFile}`);
    if (cat.doc)                            console.log(`          Doc  → ${cat.doc}`);
  }
});

if (fileWarnings.length > 0) {
  console.log(`\n Advertencias — archivos referenciados en featureCatalog que no existen en disco:`);
  fileWarnings.forEach(w => console.log(w));
}

if (vdata.appEntryFlow) {
  console.log(`\n Entry flow: ${vdata.appEntryFlow}`);
}

console.log('');
