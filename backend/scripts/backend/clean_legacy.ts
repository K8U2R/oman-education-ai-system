import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target extensions to remove
const LEGACY_EXTENSIONS = ['.old.ts', '.backup.ts', '.temp.ts'];
const TARGET_DIR = path.resolve(__dirname, '../../src'); // Assuming scripts/backend structure

function walkDir(dir: string, callback: (filePath: string) => void) {
    if (!fs.existsSync(dir)) return;

    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

console.log('🧹 Starting Legacy Cleanup Protocol...');
console.log(`📍 Target Directory: ${TARGET_DIR}`);
console.log(`🎯 Patterns: ${LEGACY_EXTENSIONS.join(', ')}`);

let deletedCount = 0;

walkDir(TARGET_DIR, (filePath) => {
    const isLegacy = LEGACY_EXTENSIONS.some(ext => filePath.endsWith(ext));

    if (isLegacy) {
        try {
            fs.unlinkSync(filePath);
            console.log(`✅ Deleted: ${path.relative(TARGET_DIR, filePath)}`);
            deletedCount++;
        } catch (error) {
            console.error(`❌ Failed to delete ${filePath}:`, error);
        }
    }
});

if (deletedCount === 0) {
    console.log('✨ No legacy files found. System is clean.');
} else {
    console.log(`🗑️  Cleanup complete. Removed ${deletedCount} files.`);
}
