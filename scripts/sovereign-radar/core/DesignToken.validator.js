/**
 * DesignToken.validator.js
 * 
 * Enforces Rule 7: No hardcoded design tokens (Hex, inline styles) in TSX.
 * Reads patterns from SovereignRules.config.json.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Rules Config
const configPath = path.join(__dirname, '../SovereignRules.config.json');
let rulesConfig = { rules: {} };

try {
    const rawConfig = fs.readFileSync(configPath, 'utf-8');
    rulesConfig = JSON.parse(rawConfig);
} catch (e) {
    console.warn("⚠️  SovereignRules.config.json not found or invalid. Defaulting to empty rules.");
}

/**
 * Validates file content against Design Token rules.
 * @param {string} filePath 
 * @param {string} content 
 * @returns {Array} violations
 */
export const validate = (filePath, content) => {
    const violations = [];

    // Only scan .tsx files
    if (!filePath.endsWith('.tsx')) {
        return violations;
    }

    const designRule = rulesConfig.rules.find(r => r.id === 'Rule-7');
    if (!designRule) return violations;

    designRule.patterns.forEach(patternDef => {
        const regex = new RegExp(patternDef.pattern, 'g');
        let match;

        // Reset regex state
        regex.lastIndex = 0;

        while ((match = regex.exec(content)) !== null) {
            // Calculate line number
            const linesUpToMatch = content.substring(0, match.index).split('\n');
            const lineNumber = linesUpToMatch.length;

            violations.push({
                rule: designRule.name,
                severity: designRule.severity,
                message: `${patternDef.message} (Line ${lineNumber}: "${match[0]}")`,
                suggestion: designRule.fix_suggestion
            });
        }
    });

    return violations;
};
