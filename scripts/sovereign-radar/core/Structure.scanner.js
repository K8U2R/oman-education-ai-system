/**
 * Structure.scanner.js
 * 
 * Enforces the Sovereign Module Structure.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, '../SovereignRules.config.json');

let ghostConfig = { excludedFolderNames: [], excludedPathSegments: [] };
try {
    const rawConfig = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(rawConfig);
    ghostConfig = config.ghostHunter || ghostConfig;
} catch (e) { }

/**
 * Checks if a directory follows the Sovereign Module structure.
 * @param {string} dirPath - Path to the directory.
 * @param {string[]} files - List of files in the directory.
 * @returns {object|null} - Violation object or null if valid.
 */
export function scan(dirPath, files) {
    const dirName = path.basename(dirPath);

    // Rule 12: Ghost Folder Detection
    // A folder is a Ghost if it has files but NO Sovereign Component (and is not a pure container).

    // 1. Is it a Sovereign Component Directory?
    const isSovereignComponent = files.includes(`${dirName}.tsx`);

    // 2. Is it a Container Directory? (Should mostly contain folders, maybe an index.ts or minimal layout)
    // Heuristic: If it has files but no .tsx, check if those files are "orphans".
    const hasFiles = files.some(f => f !== '.DS_Store' && fs.statSync(path.join(dirPath, f)).isFile());

    if (!isSovereignComponent && hasFiles) {
        // It has files, but it's not a component. Is it a valid container?
        // Valid containers usually don't have random TS/SCSS files floating around without a component.
        // Exceptions: shared/utils, hooks folders.
        // Strict Mode: If it's inside 'pages' and not 'shared', it's likely a Ghost.

        const excludedNames = ghostConfig.excludedFolderNames || [];
        const excludedPaths = ghostConfig.excludedPathSegments || [];

        const isExcluded = excludedNames.includes(dirName) ||
            excludedPaths.some(seg => dirPath.includes(seg));

        if (!isExcluded) {
            return {
                rule: 'GhostHunter (Rule 12)',
                severity: 'CRITICAL',
                message: `Ghost Folder detected: "${dirName}". Contains files but no Sovereign Component. (Is this a shared container?)`,
                suggestion: `Delete folder if obsolete, or restructure into a Sovereign Component.`
            };
        }
    }

    if (isSovereignComponent) {
        // Strict Requirement: [Name].tsx, [Name].module.scss, [Name].index.ts
        const requiredFiles = [
            `${dirName}.tsx`,
            `${dirName}.module.scss`,
            `${dirName}.index.ts`
        ];

        const missing = requiredFiles.filter(f => !files.includes(f));

        if (missing.length > 0) {
            return {
                rule: 'StructureScanner',
                severity: 'CRITICAL',
                message: `Missing required sovereign files: ${missing.join(', ')}`,
                suggestion: `Create missing files following the [Module] pattern.`
            };
        }
    }

    return null;
}
