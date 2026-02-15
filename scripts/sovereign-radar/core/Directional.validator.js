/**
 * Directional.validator.js
 * 
 * Enforces Rule 6 & 11: RTL Support & Logical Properties.
 * Rejects 'left' and 'right' usage strictly.
 */

/**
 * Checks for banned directional words in .scss files.
 * @param {string} filePath 
 * @param {string} content 
 * @returns {object[]}
 */
export function validate(filePath, content) {
    if (!filePath.endsWith('.scss')) return [];

    const violations = [];
    const lines = content.split('\n');

    // Strict Ban: The words "left" and "right" are forbidden anywhere.
    // We use word boundaries \b to avoid matching "copyright" or "bright".
    const forbidden = [
        { regex: /\bleft\b/i, fix: 'inline-start / inset-inline-start' },
        { regex: /\bright\b/i, fix: 'inline-end / inset-inline-end' }
    ];

    lines.forEach((line, index) => {
        forbidden.forEach(({ regex, fix }) => {
            if (regex.test(line)) {
                violations.push({
                    rule: 'DirectionalValidator',
                    severity: 'CRITICAL',
                    message: `Forbidden directional word detected on line ${index + 1}: matches "left/right"`,
                    suggestion: `Use logical properties (e.g., ${fix}). Remove physical directionality.`
                });
            }
        });
    });

    return violations;
}
