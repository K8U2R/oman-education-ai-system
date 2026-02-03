import { Pool } from "pg";
import { logger } from "../../../shared/utils/logger.js";
import { ENV_CONFIG } from "../../config/env.config.js";

export interface VectorDocument {
  content: string;
  metadata: Record<string, unknown>;
  embedding: number[];
}

export interface SearchResult {
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
}

export class VectorStoreService {
  private pool: Pool;
  private tableName = "knowledge_vectors";
  private dim = 1536; // OpenAI small embedding dimension

  constructor() {
    this.pool = new Pool({
      connectionString: ENV_CONFIG.DATABASE_URL,
      ssl:
        ENV_CONFIG.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    });
  }

  /**
   * Initialize the Vector Database (Extension + Table)
   */
  public async initialize(): Promise<void> {
    const client = await this.pool.connect();
    try {
      logger.info("[VectorStore] Initializing pgvector extension and table...");
      await client.query("CREATE EXTENSION IF NOT EXISTS vector");
      await client.query(`
                CREATE TABLE IF NOT EXISTS ${this.tableName} (
                    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                    content text,
                    metadata jsonb,
                    embedding vector(${this.dim}),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            `);
      try {
        await client.query(`
                    CREATE INDEX IF NOT EXISTS knowledge_vectors_embedding_idx 
                    ON ${this.tableName} 
                    USING hnsw (embedding vector_cosine_ops)
                `);
      } catch (idxError) {
        logger.warn("[VectorStore] Index creation warning:", idxError);
      }
      logger.info("[VectorStore] Initialization Complete.");
    } catch (error) {
      logger.error("[VectorStore] Initialization Failed", error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async storeDocument(doc: VectorDocument): Promise<void> {
    const query = `
            INSERT INTO ${this.tableName} (content, metadata, embedding)
            VALUES ($1, $2, $3)
        `;
    const embeddingString = `[${doc.embedding.join(",")}]`;
    await this.pool.query(query, [doc.content, doc.metadata, embeddingString]);
  }

  public async similaritySearch(
    queryEmbedding: number[],
    limit: number = 3,
  ): Promise<SearchResult[]> {
    const embeddingString = `[${queryEmbedding.join(",")}]`;
    const query = `
            SELECT content, metadata, 1 - (embedding <=> $1) as similarity
            FROM ${this.tableName}
            ORDER BY embedding <=> $1
            LIMIT $2
        `;
    const result = await this.pool.query(query, [embeddingString, limit]);
    return result.rows.map((row) => ({
      content: row.content,
      metadata: row.metadata,
      similarity: row.similarity,
    }));
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}
