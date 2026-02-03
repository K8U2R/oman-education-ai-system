import { ISkill } from "./ISkill";
import { logger } from "@/shared/utils/logger";

/**
 * Skill Registry
 * Central repository for all available AI skills.
 * Allows dynamic registration and retrieval of skills.
 */
export class SkillRegistry {
  private static instance: SkillRegistry;
  private skills: Map<string, ISkill> = new Map();

  private constructor() {}

  public static getInstance(): SkillRegistry {
    if (!SkillRegistry.instance) {
      SkillRegistry.instance = new SkillRegistry();
    }
    return SkillRegistry.instance;
  }

  /**
   * Register a new skill
   */
  public register(skill: ISkill): void {
    if (this.skills.has(skill.name)) {
      logger.warn(`Skill ${skill.name} is already registered. Overwriting.`);
    }
    this.skills.set(skill.name, skill);
    logger.info(`Skill registered: ${skill.name}`);
  }

  /**
   * Get a skill by name
   */
  public get(name: string): ISkill | undefined {
    return this.skills.get(name);
  }

  /**
   * Get all registered skills
   */
  public getAll(): ISkill[] {
    return Array.from(this.skills.values());
  }
}
