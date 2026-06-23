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

// Import functions from checkNaming
const {
  isPascalCase,
  isCamelCase,
  isHookCamelCase,
  isMockCamelCase,
  toPascalCase,
  toCamelCase,
  toHookCamelCase,
  toMockCamelCase,
} = require("./checkNaming.js");

function findFilesToRename(dirPath, basePath = "") {
  const renames = [];

  if (!fs.existsSync(dirPath)) {
    return renames;
  }

  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const relativePath = path.join(basePath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      renames.push(...findFilesToRename(itemPath, relativePath));
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

      let needsRename = false;
      let newName = item;

      // Check naming based on directory
      if (basePath.startsWith("components")) {
        // Components should use PascalCase
        if (!isPascalCase(item)) {
          newName = toPascalCase(item);
          needsRename = true;
        }
      } else if (basePath.startsWith("hooks")) {
        // Hooks should use camelCase with 'use' prefix
        if (!isHookCamelCase(item)) {
          newName = toHookCamelCase(item);
          needsRename = true;
        }
      } else if (basePath.startsWith("data")) {
        // Mock files should use camelCase with 'mock' prefix
        if (!isMockCamelCase(item)) {
          newName = toMockCamelCase(item);
          needsRename = true;
        }
      }

      if (needsRename) {
        const newPath = path.join(dirPath, newName);

        renames.push({
          oldPath: itemPath,
          newPath: newPath,
          oldName: item,
          newName: newName,
          relativePath: relativePath,
          directory: basePath,
        });
      }
    }
  }

  return renames;
}

function updateImportsInFile(filePath, renames) {
  if (!fs.existsSync(filePath)) return false;

  try {
    let content = fs.readFileSync(filePath, "utf8");
    let updated = false;

    for (const rename of renames) {
      const oldNameWithoutExt = path.parse(rename.oldName).name;
      const newNameWithoutExt = path.parse(rename.newName).name;

      // Update import and export statements
      const patterns = [
        // Standard imports: from "./oldName" or from "@/path/oldName"
        new RegExp(`from\\s+['"]([^'"]*/)${oldNameWithoutExt}['"]`, "g"),
        new RegExp(`import\\s+['"]([^'"]*/)${oldNameWithoutExt}['"]`, "g"),
        // Dynamic imports: import("./oldName")
        new RegExp(
          `import\\s*\\(\\s*['"]([^'"]*/)${oldNameWithoutExt}['"]\\s*\\)`,
          "g"
        ),
        // Re-exports: export * from "./oldName"
        new RegExp(
          `export\\s+\\*\\s+from\\s+['"]([^'"]*/)${oldNameWithoutExt}['"]`,
          "g"
        ),
        new RegExp(
          `export\\s+\\{[^}]*\\}\\s+from\\s+['"]([^'"]*/)${oldNameWithoutExt}['"]`,
          "g"
        ),
      ];

      for (const pattern of patterns) {
        const newContent = content.replace(pattern, (match, importPath) => {
          return match.replace(oldNameWithoutExt, newNameWithoutExt);
        });

        if (newContent !== content) {
          content = newContent;
          updated = true;
        }
      }
    }

    if (updated) {
      fs.writeFileSync(filePath, content, "utf8");
      return true;
    }
  } catch (error) {
    log(`   ⚠️  Error updating ${filePath}: ${error.message}`, colors.yellow);
  }

  return false;
}

function findAllTsxFiles(dirPath) {
  const files = [];

  if (!fs.existsSync(dirPath)) {
    return files;
  }

  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      files.push(...findAllTsxFiles(itemPath));
    } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
      files.push(itemPath);
    }
  }

  return files;
}

function main() {
  log(
    "🔧 Fixing naming conventions (following TypeScript Style Guide)...",
    colors.cyan
  );
  log("📋 Applying rules:", colors.blue);
  log("   • Components (classes): PascalCase", colors.blue);
  log('   • Hooks (functions): camelCase with "use" prefix', colors.blue);
  log('   • Mocks (objects): camelCase with "mock" prefix', colors.blue);
  log("   • Files: Name should match main export", colors.blue);

  const paths = [
    { dir: "components", name: "components" },
    { dir: "hooks", name: "hooks" },
    { dir: "data", name: "data" },
  ];

  let allRenames = [];

  // Find all files that need renaming
  for (const { dir, name } of paths) {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      const renames = findFilesToRename(dirPath, name);
      allRenames.push(...renames);
    }
  }

  if (allRenames.length === 0) {
    log("\n✅ All files already follow naming conventions!", colors.green);
    return;
  }

  log(`\n📋 Found ${allRenames.length} files to rename:`, colors.yellow);

  // Group and show what will be renamed
  const groupedRenames = {};
  for (const rename of allRenames) {
    const dir = rename.directory;
    if (!groupedRenames[dir]) groupedRenames[dir] = [];
    groupedRenames[dir].push(rename);
  }

  for (const [dir, renames] of Object.entries(groupedRenames)) {
    log(`\n📁 ${dir}/`, colors.yellow);
    for (const rename of renames) {
      log(`   ${rename.oldName} → ${rename.newName}`, colors.blue);
    }
  }

  // Perform renames
  log("\n🔄 Renaming files...", colors.cyan);
  for (const rename of allRenames) {
    try {
      fs.renameSync(rename.oldPath, rename.newPath);
      log(
        `   ✅ ${rename.directory}/${rename.oldName} → ${rename.newName}`,
        colors.green
      );
    } catch (error) {
      log(
        `   ❌ Failed to rename ${rename.oldName}: ${error.message}`,
        colors.red
      );
    }
  }

  // Update imports in all files
  log("\n🔄 Updating import statements...", colors.cyan);
  const searchPaths = ["app", "components", "hooks", "data", "lib"];
  const allFiles = [];

  for (const searchPath of searchPaths) {
    const fullPath = path.join(process.cwd(), searchPath);
    if (fs.existsSync(fullPath)) {
      allFiles.push(...findAllTsxFiles(fullPath));
    }
  }

  let updatedFiles = 0;
  for (const file of allFiles) {
    if (updateImportsInFile(file, allRenames)) {
      updatedFiles++;
    }
  }

  log(`   ✅ Updated imports in ${updatedFiles} files`, colors.green);

  log("\n🎉 Naming convention fix completed!", colors.green);
  log(
    "📖 All files now follow TypeScript Style Guide conventions:",
    colors.blue
  );
  log("   • PascalCase for classes/components (exports)", colors.blue);
  log('   • camelCase for functions/hooks (with "use" prefix)', colors.blue);
  log('   • camelCase for objects/mocks (with "mock" prefix)', colors.blue);
  log("   • Filename matches main export name", colors.blue);
  log(
    "\n💡 Consider running your build process to verify everything works correctly.",
    colors.cyan
  );
}

if (require.main === module) {
  main();
}

module.exports = { findFilesToRename, updateImportsInFile, findAllTsxFiles };
