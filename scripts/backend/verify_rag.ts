
import { container } from '../../backend/src/infrastructure/di/Container';
import { bootstrap } from '../../backend/src/bootstrap';
import { VectorStoreService } from '../../backend/src/infrastructure/services/vector/VectorStoreService';
import { logger } from '../../backend/src/shared/utils/logger';

async function verifyRAG() {
    console.log("🚀 Verifying Sovereign RAG Infrastructure...");

    // 1. Bootstrap to load configs and register services
    await bootstrap();

    // 2. Resolve Vector Store
    if (!container.isRegistered("VectorStoreService")) {
        console.error("❌ VectorStoreService not registered!");
        process.exit(1);
    }
    const vectorStore = container.resolve<VectorStoreService>("VectorStoreService");

    try {
        // 3. Initialize (Create Table/Extension)
        console.log("📦 Initializing Vector Database...");
        await vectorStore.initialize();
        console.log("✅ Initialization successful.");

        // 4. Test Insertion
        console.log("📝 Testing Document Storage...");
        // Mock 1536-dim embedding (all zeros with a 1 at start for simplicity check)
        // In real usage, this comes from OpenAI.
        const mockEmbedding = new Array(1536).fill(0);
        mockEmbedding[0] = 0.5;
        mockEmbedding[1] = 0.5;

        await vectorStore.storeDocument({
            content: "The Oman Education AI System is a sovereign project.",
            metadata: { source: "test_script", date: new Date().toISOString() },
            embedding: mockEmbedding
        });
        console.log("✅ Document Stored.");

        // 5. Test Search
        console.log("🔍 Testing Similarity Search...");
        const results = await vectorStore.similaritySearch(mockEmbedding, 1);

        if (results.length > 0) {
            console.log("✅ Search Result Found:", results[0].content);
            console.log("   Similarity Score:", results[0].similarity);
        } else {
            console.warn("⚠️ No results found (this might be unexpected).");
        }

        console.log("\n✅ RAG Infrastructure Verified Successfully.");

    } catch (error) {
        console.error("❌ RAG Verification Failed:", error);
    } finally {
        await vectorStore.close();
        process.exit(0);
    }
}

verifyRAG();
