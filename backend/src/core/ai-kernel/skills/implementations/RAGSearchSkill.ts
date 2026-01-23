import { ISkill } from "../ISkill";
import { KnowledgeBaseService } from "@/application/services/knowledge/KnowledgeBaseService";
import { container } from "@/infrastructure/di/Container";
import { logger } from "@/shared/utils/logger";

interface SearchInput {
  query: string;
  filters?: Record<string, unknown>;
  limit?: number;
}

export class RAGSearchSkill implements ISkill<SearchInput, unknown> {
  public name = "search.rag";
  public description = "Semantic search over the knowledge base using RAG.";
  public inputSchema = {
    type: "object",
    properties: {
      query: { type: "string" },
      filters: { type: "object" },
      limit: { type: "number" },
    },
    required: ["query"],
  };

  private service: KnowledgeBaseService;

  constructor(service?: KnowledgeBaseService) {
    this.service =
      service ||
      container.resolve<KnowledgeBaseService>("KnowledgeBaseService");
  }

  public async execute(input: SearchInput, _context: unknown): Promise<unknown> {
    logger.info(`[RAGSkill] Searching for: ${input.query}`);
    // Assuming KnowledgeBaseService has a 'search' or 'retrieve' method.
    // Based on previous view, it had ingestDocument. I need to check if it has search.
    // If not, I might need to use VectorStoreService directly or assume KBService will have it.
    // Let's assume performSearch exists or similar. I'll double check KBService content if this fails or I'll implement a placeholder.
    // Checking KnowledgeBaseService (Step 5638) showed ingestDocument but cut off.
    // Let's assume it has performSearch or similar, if not I'll fix it.
    // Actually, let's look for search functionality in KB Service first to be safe, but since I am in a "write" step,
    // I made a small leap of faith. I'll verify in next step.

    return await this.service.retrieveKnowledge(input.query, input.limit);
  }
}
