import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target: The root of the backend
const BACKEND_ROOT = path.resolve(__dirname, '../../');

// Configuration
const TARGET_EXT = '.scss';
const IGNORED_DIRS = ['node_modules', 'dist', 'coverage', '.git', '.husky'];

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
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

console.log(`\n🔍 [Sovereign Style Sentry] Scanning backend for stray ${TARGET_EXT} files...`);
console.log(`   Root: ${BACKEND_ROOT}\n`);

const foundFiles = scanDirectory(BACKEND_ROOT);

if (foundFiles.length > 0) {
    console.error(`❌ ALARM: Found ${foundFiles.length} stray SCSS files in Backend!`);
    foundFiles.forEach(f => console.error(`   - ${path.relative(BACKEND_ROOT, f)}`));
    console.log(`\n⚠️  Action Required: Move these styles to 'frontend/src/styles' or delete them.`);
    process.exit(1);
} else {
    console.log(`✅ Clean. No ${TARGET_EXT} files found in backend.`);
    console.log(`   Sovereign Architecture Protocol: COMPLIANT.`);
    process.exit(0);
}
