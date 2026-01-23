import { OfficeGenerationSkill } from "@/core/ai-kernel/skills/implementations/OfficeGenerationSkill";
import { OfficeGenerationService } from "@/application/services/office/OfficeGenerationService";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("OfficeGenerationSkill", () => {
    let skill: OfficeGenerationSkill;
    let mockService: OfficeGenerationService;

    beforeEach(() => {
        mockService = {
            generateOffice: vi.fn().mockResolvedValue({ location: "path/to/file.docx" }),
        } as any;
        skill = new OfficeGenerationSkill(mockService);
    });

    it("should have correct name and description", () => {
        expect(skill.name).toBe("office.generate");
        expect(skill.description).toBeDefined();
    });

    it("should execute service with correct payload", async () => {
        const input = { type: "word" as const, data: { topic: "Test" } };
        const result = await skill.execute(input, {});
        expect(mockService.generateOffice).toHaveBeenCalledWith(input);
        expect(result).toEqual({ location: "path/to/file.docx" });
    });
});
