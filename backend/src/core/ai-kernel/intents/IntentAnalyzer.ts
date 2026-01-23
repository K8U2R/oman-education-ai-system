import {
  IntentAnalysisResult,
  IntentType,
  MessageInput,
  AgentType,
  UserContext,
} from "../types";

/**
 * Intent Analyzer
 * المسؤول عن فهم "نية" المستخدم من خلال النص والسياق.
 */
export class IntentAnalyzer {
  /**
   * تحليل الرسالة وتحديد النية والوكيل المناسب
   */
  public async analyze(input: MessageInput): Promise<IntentAnalysisResult> {
    const { text, context } = input;
    const normalizedText = text.toLowerCase();

    // 1. Check for explicit Code Generation triggers
    if (this.isCodeGenerationRequest(normalizedText)) {
      return this.createResult(
        "GENERATE_CODE",
        "DEVELOPER",
        0.95,
        { language: "auto" },
        "User explicitly requested code generation.",
      );
    }

    // 2. Check for Office Document triggers
    if (this.isOfficeRequest(normalizedText)) {
      return this.createResult(
        "CREATE_DOCUMENT",
        "OFFICE",
        0.95,
        { fileType: this.extractFileType(normalizedText) },
        "User requested document creation.",
      );
    }

    // 3. Check for Explanation/Learning triggers
    if (this.isExplanationRequest(normalizedText)) {
      return this.createResult(
        "EXPLAIN_TOPIC",
        "EDUCATOR",
        0.9,
        { complexity: "simple" },
        "User asked for explanation.",
      );
    }

    // 4. Context-Aware Continuation
    // إذا كانت الرسالة غامضة (مثل "أعطني مثالاً" أو "لماذا؟") نعتمد على السياق السابق
    if (this.isContinuationRequest(normalizedText) && context.lastIntent) {
      return this.handleContinuation(context, text);
    }

    // Default Fallback
    return this.createResult(
      "UNKNOWN",
      "GENERAL",
      0.5,
      {},
      "Could not determine clear intent, defaulting to general chat.",
    );
  }

  // --- Helper Logic (Here we can inject LLM later for smarter classification) ---

  private isCodeGenerationRequest(text: string): boolean {
    const keywords = [
      "اكتب كود",
      "كود لـ",
      "برنامج",
      "python code",
      "function",
      "class",
      "script",
      "code example",
      "generate code",
      "write code",
      "give me code",
      "سكريبت",
      "برمج",
    ];
    return keywords.some((k) => text.includes(k));
  }

  private isOfficeRequest(text: string): boolean {
    const keywords = [
      "ملف وورد",
      "word file",
      "excel",
      "powerpoint",
      "pdf",
      "عرض تقديمي",
      "جدول بيانات",
      "تقرير",
    ];
    return keywords.some((k) => text.includes(k));
  }

  private isExplanationRequest(text: string): boolean {
    const keywords = [
      "اشرح",
      "ما هو",
      "كيف يعمل",
      "علمني",
      "what is",
      "explain",
      "how to",
      "teach",
      "learn",
      "tell me about",
    ];
    return keywords.some((k) => text.includes(k));
  }

  private isContinuationRequest(text: string): boolean {
    const keywords = [
      "مثال",
      "المزيد",
      "لماذا",
      "كيف",
      "example",
      "more",
      "why",
    ];
    // كلمات قصيرة غالباً تعني متابعة
    return keywords.some((k) => text.includes(k)) || text.split(" ").length < 4;
  }

  private extractFileType(text: string): string {
    if (text.includes("excel") || text.includes("جدول")) return "excel";
    if (
      text.includes("powerpoint") ||
      text.includes("عرض") ||
      text.includes("ppt")
    )
      return "powerpoint";
    if (text.includes("pdf")) return "pdf";
    return "word";
  }

  private handleContinuation(
    context: UserContext,
    _text: string,
  ): IntentAnalysisResult {
    // If previous was coding, and user says "make it faster", it's still coding/debugging
    if (context.lastIntent === "GENERATE_CODE") {
      return this.createResult(
        "DEBUG_CODE",
        "DEVELOPER",
        0.85,
        {},
        "Context implies follow-up on code.",
      );
    }

    // If previous was explanation, and user says "give example", it's explanation
    if (context.lastIntent === "EXPLAIN_TOPIC") {
      return this.createResult(
        "EXPLAIN_TOPIC",
        "EDUCATOR",
        0.85,
        {},
        "Context implies follow-up on explanation.",
      );
    }

    return this.createResult(
      "CONTINUE_CONVERSATION",
      "GENERAL",
      0.8,
      {},
      "General conversation follow-up.",
    );
  }

  private createResult(
    intent: IntentType,
    agent: AgentType,
    confidence: number,
    entities: Record<string, unknown>,
    reasoning: string,
  ): IntentAnalysisResult {
    return {
      primaryIntent: intent,
      targetAgent: agent,
      confidence,
      entities,
      reasoning,
    };
  }
}
