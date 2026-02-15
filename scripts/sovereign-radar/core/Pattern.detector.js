/**
 * Pattern.detector.js
 * 
 * Generic code pattern scanner driven by SovereignRules.config.json.
 * Detects "Optical Illusions" (Hidden violations) in code.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Rules Config
const configPath = path.join(__dirname, '../SovereignRules.config.json');
let rulesConfig = { rules: [] };

try {
    const rawConfig = fs.readFileSync(configPath, 'utf-8');
    rulesConfig = JSON.parse(rawConfig);
} catch (e) {
    console.warn("⚠️  SovereignRules.config.json not found or invalid.");
}

/**
 * Validates file content against Configured Rules.
 * @param {string} filePath 
 * @param {string} content 
 * @returns {Array} violations
 */
export const detect = (filePath, content) => {
    const violations = [];
    const fileExt = path.extname(filePath);

    if (!rulesConfig.rules || !Array.isArray(rulesConfig.rules)) return violations;

    rulesConfig.rules.forEach(rule => {
        // Check if rule applies to this file type
        if (rule.target !== fileExt) return;

        rule.patterns.forEach(patternDef => {
            const regex = new RegExp(patternDef.regex, 'g');
            let match;

            // Reset regex state
            regex.lastIndex = 0;

            while ((match = regex.exec(content)) !== null) {
                // Calculate line number
                const linesUpToMatch = content.substring(0, match.index).split('\n');
                const lineNumber = linesUpToMatch.length;

                violations.push({
                    rule: rule.name,
                    severity: rule.severity,
                    message: `${patternDef.message} (Line ${lineNumber}: "${match[0].trim()}")`,
                    suggestion: rule.fix_suggestion
                });
            }
        });
    });

    return violations;
};
