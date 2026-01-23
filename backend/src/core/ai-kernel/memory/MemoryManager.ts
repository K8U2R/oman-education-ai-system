import { UserContext, IntentType, ChatMessage } from "../types";
import { logger } from "@/shared/utils/logger";

export class MemoryManager {
  // In-memory Short Term Memory (STM)
  // In production, replace with Redis
  private static stm = new Map<string, ChatMessage[]>();
  private readonly MAX_HISTORY = 10;

  /**
   * Update and persisting user context
   */
  public async updateContext(
    currentContext: UserContext,
    newIntent: IntentType,
    newTopic?: string,
  ): Promise<UserContext> {
    const updated = {
      ...currentContext,
      lastIntent: newIntent,
      lastTopic: newTopic || currentContext.lastTopic,
    };

    logger.debug(
      `[MemoryManager] Context updated for User:${currentContext.userId}`,
      updated,
    );
    return updated;
  }

  /**
   * Add interaction to history
   */
  public async addInteraction(
    userId: string,
    userText: string,
    aiText: string,
  ) {
    if (!MemoryManager.stm.has(userId)) {
      MemoryManager.stm.set(userId, []);
    }

    const history = MemoryManager.stm.get(userId)!;

    // Add User Message
    history.push({ role: "user", content: userText, timestamp: new Date() });

    // Add AI Message
    history.push({ role: "assistant", content: aiText, timestamp: new Date() });

    // Prune
    if (history.length > this.MAX_HISTORY * 2) {
      history.splice(0, history.length - this.MAX_HISTORY * 2);
    }
  }

  /**
   * Retrieve conversation history
   */
  public async getHistory(
    userId: string,
  ): Promise<Array<{ role: string; content: string }>> {
    const history = MemoryManager.stm.get(userId) || [];
    return history.map((h) => ({ role: h.role, content: h.content }));
  }
}
