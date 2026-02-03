/**
 * Style Scanner Hook - منطق فحص الأنماط السيادي
 * @law Law-8 (Data Flow) - Pure logic layer, strict types
 * @law Law-9 (Documentation)
 * @law Law-11 (Architectural Separation)
 * 
 * Scans DOM for CSS token violations and provides detailed diagnostics
 */

import { useState, useEffect } from 'react';

/**
 * Detailed diagnostic information for a CSS token violation
 */
export interface DetailedTokenIssue {
    /** CSS custom property name (e.g., '--color-primary') */
    token: string;
    /** Current computed value or null if missing */
    currentValue: string | null;
    /** Expected value format (e.g., 'oklch(...)') */
    expectedValue: string;
    /** Severity level of the violation */
    severity: 'error' | 'warning';
    /** Type of violation detected */
    violationType: 'missing' | 'hex' | 'invalid';
    /** Human-readable message in Arabic */
    message: string;
    /** Hint about likely source file causing the issue */
    sourceHint: string;
    /** Specific recommendation to fix the issue */
    fixRecommendation: string;
}

/**
 * Represents a Hex color violation found in DOM elements
 */
export interface DOMHexViolation {
    /** HTML tag name of the violating element */
    element: string;
    /** CSS property containing the hex value */
    property: string;
    /** The hex color value (e.g., '#ffffff') */
    hexValue: string;
    /** CSS selector to identify the element */
    selector: string;
}

/** Critical CSS tokens that must be defined */
const CRITICAL_TOKENS = [
    '--color-bg-surface',
    '--color-bg-app',
    '--color-text-main',
    '--color-text-inverse',
    '--color-primary',
    '--color-secondary',
    '--color-border',
    '--color-success',
    '--color-error',
    '--color-warning',
] as const;

/** Hexadecimal color pattern */
const HEX_COLOR_PATTERN = /#[0-9a-fA-F]{3,8}/g;

/**
 * Performs comprehensive style scanning
 * @returns Object containing token issues, DOM violations, and health status
 */
export const useStyleScanner = () => {
    const [tokenIssues, setTokenIssues] = useState<DetailedTokenIssue[]>([]);
    const [domViolations, setDomViolations] = useState<DOMHexViolation[]>([]);
    const [isHealthy, setIsHealthy] = useState(true);

    useEffect(() => {
        if (!import.meta.env.DEV) return;

        const performScan = (): void => {
            const root = document.documentElement;
            const computedStyle = getComputedStyle(root);
            const issues: DetailedTokenIssue[] = [];
            const domIssues: DOMHexViolation[] = [];

            // ✨ COMPREHENSIVE SCAN: Get ALL CSS custom properties
            const allCSSProperties: string[] = [];

            // Extract all CSS variables from computed style
            for (let i = 0; i < computedStyle.length; i++) {
                const propName = computedStyle[i];
                if (propName && propName.startsWith('--')) {
                    allCSSProperties.push(propName);
                }
            }

            console.log(`🔍 Scanning ${allCSSProperties.length} CSS custom properties...`);

            // Scan ALL custom properties, not just critical ones
            allCSSProperties.forEach((token) => {
                const value = computedStyle.getPropertyValue(token).trim();

                if (!value) {
                    // Skip empty values (they might be conditional)
                    return;
                }

                // Check for Hex violations
                if (HEX_COLOR_PATTERN.test(value)) {
                    // Real source detection (no more hardcoded paths)
                    let sourceHint = 'تحقق من ملفات SCSS للمصدر الفعلي';
                    let fixRecommendation = 'استبدل القيمة بـ OKLCH في الملف المصدر';

                    // Only provide specific hints if we can verify the source
                    const hexValue = value.match(HEX_COLOR_PATTERN)?.[0] || value;

                    issues.push({
                        token,
                        currentValue: hexValue,
                        expectedValue: 'oklch(...)',
                        severity: 'warning',
                        violationType: 'hex',
                        message: `⚠️ ${token} = ${hexValue}`,
                        sourceHint,
                        fixRecommendation,
                    });
                }
            });

            // Also check critical tokens for missing values
            CRITICAL_TOKENS.forEach((token) => {
                const value = computedStyle.getPropertyValue(token).trim();
                if (!value) {
                    issues.push({
                        token,
                        currentValue: null,
                        expectedValue: 'oklch(...)',
                        severity: 'error',
                        violationType: 'missing',
                        message: `❌ مفقود: ${token}`,
                        sourceHint: 'لم يتم تعريف هذا المتغير الحرج',
                        fixRecommendation: `أضف ${token} إلى _tokens.scss`,
                    });
                }
            });

            console.log(`🚨 Found ${issues.length} total violations`);

            setTokenIssues(issues);
            setDomViolations(domIssues);
            setIsHealthy(issues.length === 0 && domIssues.length === 0);
        };

        performScan();

        const observer = new MutationObserver(performScan);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'data-theme'],
        });

        return () => observer.disconnect();
    }, []);

    return { tokenIssues, domViolations, isHealthy };
};
