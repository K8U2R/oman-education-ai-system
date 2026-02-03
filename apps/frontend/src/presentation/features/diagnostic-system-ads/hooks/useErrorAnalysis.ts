
import { ProfessionalError } from '../types';

export interface ErrorAnalysisResult {
    isNetworkError: boolean;
    isAuthError: boolean;
    isServerError: boolean;
    isClientError: boolean;
    normalizedError: ProfessionalError;
}

export const useErrorAnalysis = (error: ProfessionalError | string | null): ErrorAnalysisResult => {
    // Normalize error
    const normalizedError: ProfessionalError =
        typeof error === 'string'
            ? { code: 'UNKNOWN_ERROR', message: error, requestId: 'N/A' }
            : error || { code: 'NO_ERROR', message: '', requestId: 'N/A' };

    if (!error) {
        return {
            isNetworkError: false,
            isAuthError: false,
            isServerError: false,
            isClientError: false,
            normalizedError,
        };
    }

    // Analysis Logic
    const isNetworkError =
        normalizedError.code === 'ERR_NETWORK' ||
        normalizedError.code === 'ECONNREFUSED' ||
        normalizedError.message?.includes('Network Error') ||
        normalizedError.message?.includes('Failed to fetch') ||
        normalizedError.message?.includes('connection refused') ||
        false;

    const isAuthError =
        normalizedError.code === 'UNAUTHORIZED' ||
        normalizedError.code === 'FORBIDDEN' ||
        normalizedError.message?.includes('401') ||
        normalizedError.message?.includes('403') ||
        false;

    const isServerError =
        !isNetworkError &&
        !isAuthError &&
        (normalizedError.code?.startsWith('5') || normalizedError.message?.includes('500') || false);

    const isClientError = !isNetworkError && !isAuthError && !isServerError;

    return {
        isNetworkError,
        isAuthError,
        isServerError,
        isClientError,
        normalizedError,
    };
};
