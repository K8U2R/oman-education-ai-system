// sovereign-radar/web/api.js
import { scan as structureScan } from '../core/Structure.scanner.js';
import { detect as accumulationDetect } from '../core/Accumulation.detector.js';
import { guard as linguisticGuard } from '../core/Linguistic.guardian.js';
import { validate as directionalValidate } from '../core/Directional.validator.js';
import { detect as patternDetect } from '../core/Pattern.detector.js';
import { validate as buildSafetyValidate } from '../core/BuildSafety.validator.js';
import fs from 'fs';
import path from 'path';

const EXCLUDED_DIRS = new Set([
    'node_modules', '.git', 'dist', 'build', '.storybook', 'coverage',
    '.husky', '.cache', '.turbo', '.next', 'out'
]);

export async function scanProject(targetDir = 'apps/frontend/src/presentation/pages') {
    const violations = [];

    function walk(dir) {
        const dirName = path.basename(dir);
        if (EXCLUDED_DIRS.has(dirName)) return;

        let files;
        try {
            files = fs.readdirSync(dir);
        } catch (e) {
            return;
        }

        // Structure check
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
                walk(fullPath);
            } else {
                let content;
                try {
                    content = fs.readFileSync(fullPath, 'utf-8');
                } catch (e) { return; }

                // Accumulation
                const acc = accumulationDetect(fullPath, content);
                if (acc) violations.push({ filePath: fullPath, ...acc });

                // Linguistic
                linguisticGuard(fullPath, content).forEach(v =>
                    violations.push({ filePath: fullPath, ...v })
                );

                // Directional
                directionalValidate(fullPath, content).forEach(v =>
                    violations.push({ filePath: fullPath, ...v })
                );

                // Pattern
                patternDetect(fullPath, content).forEach(v =>
                    violations.push({ filePath: fullPath, ...v })
                );

                // Build Safety
                buildSafetyValidate(fullPath, content).forEach(v =>
                    violations.push({ filePath: fullPath, ...v })
                );
            }
        });
    }

    walk(targetDir);
    return { violations, scannedAt: new Date().toISOString() };
}