const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(projectRoot, 'src');

function getAllFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...getAllFiles(full));
    else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function replaceAliasesInFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const regex = /(from\s+|require\()(["'])@\/([^"')]+)\2/g;
  let changed = false;
  content = content.replace(regex, (m, prefix, quote, target) => {
    const targetPath = path.join(srcRoot, target);
    let rel = path.relative(path.dirname(file), targetPath);
    rel = rel.split(path.sep).join('/');
    if (!rel.startsWith('.')) rel = './' + rel;
    changed = true;
    if (prefix.trim() === 'from') return `from ${quote}${rel}${quote}`;
    return `require(${quote}${rel}${quote}`;
  });
  if (changed) fs.writeFileSync(file, content, 'utf8');
  return changed;
}

function run() {
  const files = getAllFiles(srcRoot);
  let total = 0;
  for (const f of files) {
    const ok = replaceAliasesInFile(f);
    if (ok) total++;
  }
  console.log(`Processed ${files.length} files, updated ${total} files.`);
}

run();
