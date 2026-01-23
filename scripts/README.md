# Central Scripts Hub

This directory contains all operational scripts for the Oman Education AI System.

## Structure

- **backend/**: Core system scripts (Kernel Verification, RAG Testing).
- **frontend/**: UI-related operations.
- **database-core/**: Migration and DB maintenance scripts.

## Scripts

### Backend

- `verify_memory.ts`: Simulates a multi-turn conversation with the AI Kernel to verify Context Memory retention and Agent Dispatching.
  - usage: `npx tsx scripts/backend/verify_memory.ts`
- `verify_rag.ts`: Verifies connection to `pgvector`, creates the `knowledge_vectors` table, and tests embedding storage/retrieval.
  - usage: `npx tsx scripts/backend/verify_rag.ts`

### General

- `simulate_ai_kernel.ts`: Legacy simulation script (consider using verify_memory instead).

## Monitoring

Check `QUALITY_CHECKS.md` for rules on adding new scripts.
