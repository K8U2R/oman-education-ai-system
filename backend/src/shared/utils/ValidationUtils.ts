/**
 * Validation Utils
 * 
 * Common validation utilities
 */

export class ValidationUtils {
    /**
     * Validate Email Format
     * 
     * @param email - Email string
     * @returns true if valid
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate URL Format
     * 
     * @param url - URL string
     * @returns true if valid
     */
    static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}
