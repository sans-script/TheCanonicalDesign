#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Naming validation functions
function isPascalCase(filename) {
  const name = path.parse(filename).name;
  return /^[A-Z][a-zA-Z0-9]*$/.test(name);
}

function isCamelCase(filename) {
  const name = path.parse(filename).name;
  return /^[a-z][a-zA-Z0-9]*$/.test(name);
}

function isHookCamelCase(filename) {
  const name = path.parse(filename).name;
  return /^use[A-Z][a-zA-Z0-9]*$/.test(name);
}

function isMockCamelCase(filename) {
  const name = path.parse(filename).name;
  return /^mock[A-Z][a-zA-Z0-9]*$/.test(name);
}

// Conversion functions
function toPascalCase(filename) {
  const ext = path.extname(filename);
  const name = path.parse(filename).name;
  return (
    name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("") + ext
  );
}

function toCamelCase(filename) {
  const ext = path.extname(filename);
  const name = path.parse(filename).name;
  const parts = name.split("-");
  return (
    parts[0] +
    parts
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("") +
    ext
  );
}

function toHookCamelCase(filename) {
  const ext = path.extname(filename);
  const name = path.parse(filename).name;

  if (name.startsWith("use-")) {
    const parts = name.split("-");
    return (
      "use" +
      parts
        .slice(1)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("") +
      ext
    );
  }

  // If doesn't start with 'use-', convert kebab-case to camelCase and add 'use' prefix
  const camelName = toCamelCase(filename);
  const nameWithoutExt = path.parse(camelName).name;
  return (
    "use" +
    nameWithoutExt.charAt(0).toUpperCase() +
    nameWithoutExt.slice(1) +
    ext
  );
}

function toMockCamelCase(filename) {
  const ext = path.extname(filename);
  const name = path.parse(filename).name;

  if (name.startsWith("mock-")) {
    const parts = name.split("-");
    return (
      "mock" +
      parts
        .slice(1)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("") +
      ext
    );
  }

  // If doesn't start with 'mock-', convert kebab-case to camelCase and add 'mock' prefix
  const camelName = toCamelCase(filename);
  const nameWithoutExt = path.parse(camelName).name;
  return (
    "mock" +
    nameWithoutExt.charAt(0).toUpperCase() +
    nameWithoutExt.slice(1) +
    ext
  );
}

function checkDirectory(dirPath, basePath = "") {
  const issues = [];

  if (!fs.existsSync(dirPath)) {
    return issues;
  }

  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const relativePath = path.join(basePath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // Recursively check subdirectories
      issues.push(...checkDirectory(itemPath, relativePath));
    } else if (
      stat.isFile() &&
      (item.endsWith(".tsx") || item.endsWith(".ts"))
    ) {
      // Skip specific files that should remain as-is
      if (
        item === "globals.css" ||
        item === "page.tsx" ||
        item === "layout.tsx" ||
        item === "loading.tsx" ||
        item === "clientLayout.tsx" ||
        item === "not-found.tsx" ||
        item === "error.tsx"
      ) {
        continue;
      }

      let isValid = false;
      let suggested = item;

      // Check naming based on directory
      if (basePath.startsWith("components")) {
        // Components should use PascalCase (classes/constructors)
        if (isPascalCase(item)) {
          isValid = true;
        } else {
          suggested = toPascalCase(item);
        }
      } else if (basePath.startsWith("hooks")) {
        // Hooks should use camelCase with 'use' prefix (functions)
        if (isHookCamelCase(item)) {
          isValid = true;
        } else {
          suggested = toHookCamelCase(item);
        }
      } else if (basePath.startsWith("data")) {
        // Mock files should use camelCase with 'mock' prefix (objects/instances)
        if (isMockCamelCase(item)) {
          isValid = true;
        } else {
          suggested = toMockCamelCase(item);
        }
      }

      if (!isValid) {
        issues.push({
          type: "file",
          path: relativePath,
          current: item,
          suggested: suggested,
          fullPath: itemPath,
          directory: basePath,
        });
      }
    }
  }

  return issues;
}

function main() {
  log(
    "🔍 Checking naming conventions (following TypeScript Style Guide)...",
    colors.cyan
  );
  log("📋 Rules:", colors.blue);
  log("   • Components (classes): PascalCase", colors.blue);
  log('   • Hooks (functions): camelCase with "use" prefix', colors.blue);
  log('   • Mocks (objects): camelCase with "mock" prefix', colors.blue);
  log("   • Files: Name should match main export (except for /app)", colors.blue);

  const paths = [
    { dir: "components", name: "components" },
    { dir: "hooks", name: "hooks" },
    { dir: "data", name: "data" },
  ];

  const allIssues = [];

  for (const { dir, name } of paths) {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      const issues = checkDirectory(dirPath, name);
      allIssues.push(...issues);
    }
  }

  if (allIssues.length === 0) {
    log("\n✅ All files follow naming conventions!", colors.green);
    return;
  }

  log(`\n❌ Found ${allIssues.length} naming issues:`, colors.red);

  // Group issues by directory
  const groupedIssues = {};
  for (const issue of allIssues) {
    const dir = issue.directory;
    if (!groupedIssues[dir]) groupedIssues[dir] = [];
    groupedIssues[dir].push(issue);
  }

  for (const [dir, issues] of Object.entries(groupedIssues)) {
    log(`\n📁 ${dir}/`, colors.yellow);
    for (const issue of issues) {
      log(`   ${issue.current} → ${issue.suggested}`, colors.blue);
    }
  }

  log(
    `\n💡 Run 'npm run fix-naming' to automatically fix these issues.`,
    colors.cyan
  );
  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = {
  checkDirectory,
  isPascalCase,
  isCamelCase,
  isHookCamelCase,
  isMockCamelCase,
  toPascalCase,
  toCamelCase,
  toHookCamelCase,
  toMockCamelCase,
};
