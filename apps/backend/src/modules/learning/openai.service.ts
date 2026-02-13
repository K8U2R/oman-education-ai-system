import OpenAI from "openai";
import { prisma } from "../../infrastructure/database/client";

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate response with context retention
   * @param userId User ID
   * @param threadId Thread ID (optional)
   * @param userMessage User's message
   */
  async generateResponse(
    userId: string,
    threadId: string | undefined,
    userMessage: string,
  ): Promise<{ content: string; threadId: string }> {
    let thread;

    if (threadId) {
      thread = await prisma.conversation_threads.findUnique({
        where: { id: threadId },
        include: { messages: { orderBy: { created_at: "asc" }, take: 10 } },
      });
    }

    if (!thread) {
      thread = await prisma.conversation_threads.create({
        data: {
          user_id: userId,
          title: userMessage.substring(0, 50) + "...",
          messages: {
            create: {
              role: "user",
              content: userMessage,
            },
          },
        },
        include: { messages: true },
      });
    } else {
      // Save user message
      await prisma.chat_messages.create({
        data: {
          thread_id: thread.id,
          role: "user",
          content: userMessage,
        },
      });
    }

    const history = thread.messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an AI Tutor for the Oman Education AI System. Be helpful, concise, and encourage critical thinking.`,
          },
          ...history,
          { role: "user", content: userMessage }, // Ensure latest message is included if not in history fetch
        ],
        model: "gpt-4-turbo-preview",
      });

      const aiResponse =
        completion.choices[0].message.content ||
        "I'm not sure how to answer that.";

      // Save AI response
      await prisma.chat_messages.create({
        data: {
          thread_id: thread.id,
          role: "assistant",
          content: aiResponse,
        },
      });

      return { content: aiResponse, threadId: thread.id };
    } catch (error) {
      console.error("OpenAI Error:", error);
      return {
        content: "I'm having trouble connecting to my brain right now.",
        threadId: thread.id,
      };
    }
  }

  /**
   * Grade an assessment answer
   * @param prompt Grading Prompt
   * @param studentAnswer Student's Answer
   */
  async gradeAnswer(
    prompt: string,
    studentAnswer: string,
  ): Promise<{ feedback: string; score: number; confidence: number }> {
    const response = await this.openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            'You are an strict academic grader. Output JSON only: { "score": number (0-100), "feedback": string, "confidence": number (0-1) }',
        },
        {
          role: "user",
          content: `Prompt: ${prompt}\n\nStudent Answer: ${studentAnswer}`,
        },
      ],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty AI response");

    return JSON.parse(content);
  }
}
