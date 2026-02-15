/**
 * Accumulation.detector.js
 * 
 * Enforces Rule 13: Complexity Limit.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, '../SovereignRules.config.json');

let MAX_LINES = 100;
try {
    const rawConfig = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(rawConfig);
    MAX_LINES = config.accumulationDetector?.maxLines ?? 100;
} catch (e) { }

/**
 * Checks if a .tsx file exceeds the line limit.
 * @param {string} filePath 
 * @param {string} content 
 * @returns {object|null}
 */
export function detect(filePath, content) {
    if (!filePath.endsWith('.tsx')) return null;

    const lines = content.split('\n').length;

    if (lines > MAX_LINES) {
        return {
            rule: 'AccumulationDetector',
            severity: 'CRITICAL',
            message: `File exceeds ${MAX_LINES} lines limit (${lines} lines).`,
            suggestion: `Decompose component into smaller sub-components immediately.`
        };
    }

    return null;
}