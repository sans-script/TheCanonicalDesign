const fs = require('fs');
const path = require('path');

const SUPPORTED_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx'];
const IGNORED_DIRS = ['node_modules', '.next', '.git', 'dist', 'build', 'scripts', 'public'];

const target = process.argv[2];

if (!target) {
  console.error('Error: You must provide a path (file or directory).');
  console.log('Example: node scripts/remove-comments.js .');
  process.exit(1);
}

/**
 * Removes comments while keeping strings and template literals intact.
 * @param {string} content 
 * @returns {string}
 */
function removeComments(content) {
  // Regex to capture block comments, line comments, strings, and template literals
  // This allows skipping strings/templates without accidentally removing content inside them
  const regex = /(\/\*[\s\S]*?\*\/)|(\/\/.*)|("(?:\\.|[^"])*")|('(?:\\.|[^'])*')|(`(?:\\.|[^`])*`)/g;

  return content.replace(regex, (match, block, line, s1, s2, s3) => {
    if (block) return ''; // Remove block comment
    if (line) {
      // Line comments not inside strings/templates should be removed
      return ''; 
    }
    return match; // Keep strings/templates intact
  })
  .replace(/\n\s*\n\s*\n/g, '\n\n'); // Cleanup excessive line breaks
}

function processPath(currentPath) {
  const stats = fs.statSync(currentPath);

  if (stats.isFile()) {
    const ext = path.extname(currentPath);
    if (!SUPPORTED_EXTENSIONS.includes(ext) || currentPath.endsWith('.d.ts')) {
      return;
    }

    console.log(`Cleaning: ${currentPath}`);
    const content = fs.readFileSync(currentPath, 'utf8');
    const cleaned = removeComments(content);
    
    if (content !== cleaned) {
      fs.writeFileSync(currentPath, cleaned, 'utf8');
    }
    return;
  }

  if (stats.isDirectory()) {
    if (IGNORED_DIRS.includes(path.basename(currentPath))) return;

    const files = fs.readdirSync(currentPath);
    files.forEach(file => {
      processPath(path.join(currentPath, file));
    });
  }
}

try {
  const absolutePath = path.resolve(target);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: The path "${target}" does not exist.`);
    process.exit(1);
  }

  console.log('--- Starting comment removal (Safe Mode) ---');
  processPath(absolutePath);
  console.log('--- Successfully completed ---');
} catch (error) {
  console.error('An error occurred during processing:', error.message);
}
