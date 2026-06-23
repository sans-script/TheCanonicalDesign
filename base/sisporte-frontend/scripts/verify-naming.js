// scripts/verify-naming.js
// Project naming convention auditor

const fs = require('fs');
const path = require('path');

const isFixMode = process.argv.includes('--fix');

// Regexes for validation
const pascalCaseRegex = /^[A-Z][A-Za-z0-9]*$/;
const camelCaseRegex = /^[a-z][A-Za-z0-9]*$/;
const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Validation Helpers
const isPascalCase = (name) => pascalCaseRegex.test(name);
const isCamelCase = (name) => camelCaseRegex.test(name);
const isKebabCase = (name) => kebabCaseRegex.test(name);
const isHookFile = (name) => name.startsWith('use') && name.length > 3 && /[A-Z]/.test(name.charAt(3));

// Conversion Helpers
function toPascalCase(str) {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function toHookCase(str) {
  let name = str.startsWith('use') ? str.slice(3) : str;
  return 'use' + toPascalCase(name);
}

// Directory and Rule Configuration
const DIRECTORY_RULES = {
  'components': 'pascal',
  'hooks': 'hook',
  'scripts': 'kebab',
  'lib': 'kebab',
};

const SUPPORTED_EXTENSIONS = ['.ts', '.tsx', '.js', '.mjs'];
const IGNORED_DIRS = ['node_modules', '.next', '.git', 'services'];

function findFiles(dir, files = [], recursive = true) {
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      if (IGNORED_DIRS.includes(entry)) continue;
      if (recursive) findFiles(fullPath, files, true);
    } else {
      const ext = path.extname(entry);
      if (SUPPORTED_EXTENSIONS.includes(ext) && !entry.endsWith('.d.ts')) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

function updateImports(allFiles, renameMap) {
  allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    for (const [oldName, newName] of Object.entries(renameMap)) {
      // Search for literal imports: from "./OldName" or require("./OldName")
      const regex = new RegExp(`(['"\/])${oldName}(['"])`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `$1${newName}$2`);
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(file, content, 'utf8');
    }
  });
}

function runAudit() {
  const rootDir = path.resolve(__dirname, '..');
  const allProjectFiles = findFiles(rootDir);
  const renameMap = {};
  const renames = [];
  const errors = [];

  Object.entries(DIRECTORY_RULES).forEach(([dirName, rule]) => {
    const targetDir = path.join(rootDir, dirName);
    if (!fs.existsSync(targetDir)) return;

    const files = findFiles(targetDir);
    files.forEach(file => {
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      
      // Ignore config files and the audit script itself
      if (baseName === 'verify-naming' || baseName === 'check-pascal-case' || baseName === 'check-naming-conventions') return;

      let isValid = true;
      let suggestion = '';

      if (rule === 'pascal') {
        isValid = isPascalCase(baseName);
        suggestion = toPascalCase(baseName);
      } else if (rule === 'camel') {
        isValid = isCamelCase(baseName);
        suggestion = toCamelCase(baseName);
      } else if (rule === 'kebab') {
        isValid = isKebabCase(baseName);
        suggestion = toKebabCase(baseName);
      } else if (rule === 'hook') {
        isValid = isHookFile(baseName);
        suggestion = toHookCase(baseName);
      }

      if (!isValid && suggestion && suggestion !== baseName) {
        errors.push({ file, current: baseName, expected: suggestion });
        renameMap[baseName] = suggestion;
        renames.push({ 
          oldPath: file, 
          newPath: path.join(path.dirname(file), suggestion + ext) 
        });
      }
    });
  });

  if (errors.length === 0) {
    console.log('Everything is in order! All names follow the project standards.');
    return;
  }

  if (isFixMode) {
    console.log('Fixing naming conventions...');
    updateImports(allProjectFiles, renameMap);
    
    renames.forEach(r => {
      // Handling for case-insensitive systems (mac/windows)
      if (r.oldPath.toLowerCase() === r.newPath.toLowerCase()) {
        const tmpPath = r.oldPath + '.tmp';
        fs.renameSync(r.oldPath, tmpPath);
        fs.renameSync(tmpPath, r.newPath);
      } else {
        fs.renameSync(r.oldPath, r.newPath);
      }
      console.log(`  - ${path.basename(r.oldPath)} -> ${path.basename(r.newPath)}`);
    });
    console.log('Success! Names and imports updated.');
  } else {
    console.log('Naming errors detected:');
    errors.forEach(err => {
      console.log(`  - [${err.current}] in ${path.relative(rootDir, err.file)} -> Suggestion: ${err.expected}`);
    });
    console.log('\nRun "node scripts/verify-naming.js --fix" to automatically fix these errors.');
  }
}

runAudit();
