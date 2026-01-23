import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target: The root of the frontend
const FRONTEND_ROOT = path.resolve(__dirname, '../');
const SRC_ROOT = path.join(FRONTEND_ROOT, 'src');
const STYLES_ROOT = path.join(SRC_ROOT, 'styles');

// Configuration
const TARGET_EXT = '.scss';
const IGNORED_DIRS = ['node_modules', 'dist', 'coverage', '.git', '.husky', 'scripts'];

function scanDirectory(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!IGNORED_DIRS.includes(file)) {
                scanDirectory(filePath, fileList);
            }
        } else {
            if (path.extname(file) === TARGET_EXT) {
                // Check if file is outside src/styles
                // But allow src/styles itself
                if (!filePath.startsWith(STYLES_ROOT)) {
                    fileList.push(filePath);
                }
            }
        }
    });

    return fileList;
}

console.log(`\n🔍 [Sovereign Style Sentry] Scanning frontend for stray ${TARGET_EXT} files...`);
console.log(`   Rule: SCSS allowed ONLY in 'src/styles'\n`);

// Only scan src for efficiency and relevance
if (!fs.existsSync(SRC_ROOT)) {
    console.error(`❌ Error: src directory not found at ${SRC_ROOT}`);
    process.exit(1);
}

const foundFiles = scanDirectory(SRC_ROOT);

if (foundFiles.length > 0) {
    console.error(`❌ ALARM: Found ${foundFiles.length} stray SCSS files in Frontend!`);
    foundFiles.forEach(f => console.error(`   - ${path.relative(FRONTEND_ROOT, f)}`));
    console.log(`\n⚠️  Action Required: Move these styles to 'src/styles' or refactor to modules/styled-components.`);
    process.exit(1);
} else {
    console.log(`✅ Clean. All SCSS files are contained within Sovereign Territory (src/styles).`);
    console.log(`   Sovereign Architecture Protocol: COMPLIANT.`);
    process.exit(0);
}
