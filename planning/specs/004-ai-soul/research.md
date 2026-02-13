# Research Report: AI Soul (Phase 0)

**Date**: 2026-02-04
**Status**: Completed (with mitigation)

## 1. Local Infrastructure Verification
- **Test**: Connect to Ollama at `http://localhost:11434`
- **Result**: FAILED (Connection refused).
- **Implication**: The development environment does not have a running Ollama instance.

## 2. Mitigation Strategy: Mock-First Development
To adhere to the "Test-Driven" constitution principle without relying on live GPU resources, we will implement a dual-provider strategy:

1.  **`MockAIProvider`**:
    -   **Role**: Default for Development/Test environments.
    -   **Behavior**: Returns deterministic, structured JSON responses tailored to the specific prompt (e.g., always returns a valid Lesson Plan for "Math" requests).
    -   **Benefit**: Allows frontend/backend development to proceed at full speed without waiting for inference.

2.  **`OllamaProvider`**:
    -   **Role**: Production/Local-GPU environments.
    -   **Behavior**: Connects to real Ollama instance.
    -   **Config**: Controlled via `AI_PROVIDER_TYPE=mock|ollama` env var.

## 3. Technology Choices
-   **Structure**: We will use a `Strategy Pattern` for the AI Service.
-   **Validation**: We will use `zod` to validate the specific JSON structure returned by the LLM (or Mock). This ensures the rest of the system is agnostic to the source.

## 4. Prompt Engineering (Theoretical)
Since we cannot test live, we will design prompts based on **DeepSeek-R1** documentation best practices:
-   Use clear `<system>` instructions.
-   Enforce JSON output via "Response Format" instruction.
-   Include Arabic examples in the few-shot prompting.

## Decision
Proceed to **Phase 1 (Design)** with `MockAIProvider` as the primary implementation target for this session.
