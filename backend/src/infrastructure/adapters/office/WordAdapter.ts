/**
 * Word Adapter - محول Word
 *
 * Infrastructure Adapter لإنشاء ملفات Word
 */

import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { WordGenerationRequest } from "@/domain/types/features/productivity/office.types.js";
import { logger } from "@/shared/utils/logger";

export class WordAdapter {
  /**
   * إنشاء ملف Word
   *
   * @param request - طلب إنشاء Word
   * @returns Buffer للملف
   */
  async generateWord(request: WordGenerationRequest): Promise<Buffer> {
    try {
      this.validateRequest(request);

      logger.info("Generating Word file", {
        type: request.type,
        sectionsCount: request.document?.sections?.length || 0,
      });

      const children: (Paragraph | Table)[] = [];

      // إضافة العنوان إذا كان موجود
      if (request.document.title) {
        children.push(
          new Paragraph({
            text: request.document.title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
        );
      }

      // معالجة كل section
      for (const section of request.document.sections) {
        switch (section.type) {
          case "heading":
            children.push(
              new Paragraph({
                text: section.content as string,
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 240, after: 120 },
              }),
            );
            break;

          case "paragraph":
            children.push(
              new Paragraph({
                text: section.content as string,
                alignment:
                  section.style?.alignment === "center"
                    ? AlignmentType.CENTER
                    : section.style?.alignment === "right"
                      ? AlignmentType.RIGHT
                      : AlignmentType.LEFT,
                spacing: { after: 200 },
              }),
            );
            break;

          case "list": {
            const listItems = Array.isArray(section.content)
              ? section.content
              : [section.content];
            for (const item of listItems) {
              children.push(
                new Paragraph({
                  text: String(item),
                  bullet: {
                    level: 0,
                  },
                  spacing: { after: 100 },
                }),
              );
            }
            break;
          }

          case "table": {
            const tableData = section.content as unknown[][];
            const tableRows = tableData.map((row) => {
              const cells = row.map((cell) => {
                return new TableCell({
                  children: [
                    new Paragraph({
                      text: String(cell),
                    }),
                  ],
                  width: {
                    size: 100 / row.length,
                    type: WidthType.PERCENTAGE,
                  },
                });
              });
              return new TableRow({
                children: cells,
              });
            });
            children.push(
              new Table({
                rows: tableRows,
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
              }),
            );
            break;
          }

          default:
            // Fallback: معالجة كنص عادي
            children.push(
              new Paragraph({
                text: String(section.content),
                spacing: { after: 200 },
              }),
            );
        }
      }

      // إنشاء document
      const doc = new Document({
        creator: request.options?.author || "Oman Education AI System",
        title: request.options?.title || request.document.title || "Document",
        description: request.options?.subject || "",
        sections: [
          {
            properties: {},
            children,
          },
        ],
      });

      // تحويل إلى buffer
      const buffer = await Packer.toBuffer(doc);
      return Buffer.from(buffer);
    } catch (error) {
      logger.error("Failed to generate Word file", {
        error: error instanceof Error ? error.message : "Unknown error",
        request,
      });
      throw error;
    }
  }

  /**
   * التحقق من صحة البيانات
   */
  validateRequest(request: WordGenerationRequest): boolean {
    if (!request.document) {
      throw new Error("بيانات المستند مطلوبة");
    }

    if (!request.document.sections || request.document.sections.length === 0) {
      throw new Error("يجب تحديد على الأقل section واحد");
    }

    return true;
  }
}
