
import { apiClient as api } from "@/infrastructure/api/api-client";

export interface IngestionRequest {
    text: string;
    metadata: {
        source: string;
        category?: string;
        description?: string;
    };
}

export interface IngestionResponse {
    chunks: number;
    totalTokens: number;
}

export const KnowledgeService = {
    /**
     * Ingest raw text into the knowledge base
     */
    async ingestText(data: IngestionRequest): Promise<IngestionResponse> {
        const response = await api.post<IngestionResponse>("/admin/knowledge/ingest", data);
        return response;
    },

    /**
     * Get statistics (Placeholder for now)
     */
    async getStats(): Promise<any> {
        // Future endpoints: GET /admin/knowledge/stats
        return {
            totalDocuments: 0,
            lastIngestion: null
        };
    }
};
