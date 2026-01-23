/**
 * ISkill Interface
 * Defines the contract for all "Sovereign Skills" in the AI Kernel.
 */
export interface ISkill<TInput = unknown, TOutput = unknown> {
  /** unique identifier for the skill (e.g. 'office.generate', 'search.rag') */
  name: string;
  /** Human readable description */
  description: string;
  /** JSON Schema for validation of input */
  inputSchema: Record<string, unknown>;

  /**
   * Execute the skill logic
   * @param input The typed input data
   * @param context Contextual information (user, session, etc.)
   */
  execute(input: TInput, context: unknown): Promise<TOutput>;
}
