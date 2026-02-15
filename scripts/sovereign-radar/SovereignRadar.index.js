/**
 * SovereignRadar.index.js
 *
 * The Sovereign Radar Main Entry Point.
 * Usage: node scripts/sovereign-radar/SovereignRadar.index.js <target-directory>
 */

import fs from 'fs';
import path from 'path';

// Core Validators Imports (Rule 13 Deconstruction)
import { scan as structureScan } from './core/Structure.scanner.js';
import { detect as accumulationDetect } from './core/Accumulation.detector.js';
import { guard as linguisticGuard } from './core/Linguistic.guardian.js';
import { validate as directionalValidate } from './core/Directional.validator.js';
import { detect as patternDetect } from './core/Pattern.detector.js';
import { validate as buildSafetyValidate } from './core/BuildSafety.validator.js';

// ── استثناءات المجلدات (لا تُمسح أبداً) ──────────────────────────
const EXCLUDED_DIRS = new Set([
    'node_modules',
    '.git',
    'dist',
    'build',
    '.storybook',
    'coverage',
    '.husky',
    '.cache',
    '.turbo',
    '.next',
    'out'
]);

const args = process.argv.slice(2);
const targetDir = args[0] || 'apps/frontend/src/presentation/pages';

if (!fs.existsSync(targetDir)) {
    console.error(`Error: Target directory "${targetDir}" not found.`);
    process.exit(1);
}

console.log(`\n🔍  Initiating Sovereign Radar Scan on: ${targetDir}\n`);

const violations = [];

/**
 * Recursively scans directory.
 * @param {string} dir
 */
function scanDirectory(dir) {
    // ── تجاهل المجلدات المستثناة ──
    const dirName = path.basename(dir);
    if (EXCLUDED_DIRS.has(dirName)) return;

    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (e) {
        return;
    }

    // 1. Structure Check (Includes Rule 12 Ghost Hunting)
    const structureViolation = structureScan(dir, files);
    if (structureViolation) {
        violations.push({ filePath: dir, ...structureViolation });
    }

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        let stat;
        try {
            stat = fs.statSync(fullPath);
        } catch (e) { return; }

        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else {
            let content;
            try {
                content = fs.readFileSync(fullPath, 'utf-8');
            } catch (e) { return; }

            // 2. Accumulation Detector
            const accumulationViolation = accumulationDetect(fullPath, content);
            if (accumulationViolation) {
                violations.push({ filePath: fullPath, ...accumulationViolation });
            }

            // 3. Linguistic Guardian
            const linguisticViolations = linguisticGuard(fullPath, content);
            linguisticViolations.forEach(v => violations.push({ filePath: fullPath, ...v }));

            // 4. Directional Validator
            const directionalViolations = directionalValidate(fullPath, content);
            directionalViolations.forEach(v => violations.push({ filePath: fullPath, ...v }));

            // 5. Pattern Detector (Rule 7 & Hidden Violations)
            const patternViolations = patternDetect(fullPath, content);
            patternViolations.forEach(v => violations.push({ filePath: fullPath, ...v }));

            // 6. Build Safety
            const buildViolations = buildSafetyValidate(fullPath, content);
            buildViolations.forEach(v => violations.push({ filePath: fullPath, ...v }));
        }
    });
}

scanDirectory(targetDir);

// ── Output Results ─────────────────────────────────────────────────
if (violations.length === 0) {
    console.log(`✅  No sovereign violations detected. The Constitution is upheld.`);
} else {
    console.log(`⚠️  ${violations.length} Sovereign Violations Detected:\n`);

    console.table(violations.map(v => ({
        File: path.relative(process.cwd(), v.filePath),
        Rule: v.rule,
        Severity: v.severity,
        Message: v.message,
        Fix: v.suggestion
    })));

    console.log(`\n🚨  Action Required: Address these violations immediately to ensure compliance with The Constitution.\n`);
    process.exit(1);
}