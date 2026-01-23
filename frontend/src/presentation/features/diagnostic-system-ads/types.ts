export interface ProfessionalError {
    code: string;
    message: string;
    technicalDetails?: {
        service: string;
        file: string;
        line?: number;
        functionName?: string;
        stack?: string;
        context?: Record<string, unknown>;
    };
    requestId?: string;
}
