/**
 * PowerPoint Adapter - محول PowerPoint
 *
 * Infrastructure Adapter لإنشاء ملفات PowerPoint
 */

import PptxGenJS from "pptxgenjs";
import { PowerPointGenerationRequest } from "@/domain/types/shared";
import { logger } from "@/shared/utils/logger";

export class PowerPointAdapter {
  /**
   * إنشاء ملف PowerPoint
   *
   * @param request - طلب إنشاء PowerPoint
   * @returns Buffer للملف
   */
  async generatePowerPoint(
    request: PowerPointGenerationRequest,
  ): Promise<Buffer> {
    try {
      this.validateRequest(request);

      logger.info("Generating PowerPoint file", {
        type: request.type,
        slidesCount: request.slides?.length || 0,
      });

      // إنشاء presentation جديد
      const pptx = new PptxGenJS();

      // إضافة metadata
      pptx.author = request.options?.author || "Oman Education AI System";
      pptx.company = "Oman Education AI System";
      pptx.title = request.options?.title || "Presentation";
      pptx.subject = request.options?.subject || "";

      // إضافة كل slide
      for (const slideData of request.slides) {
        // تحديد layout (pptxgenjs يستخدم masterName)
        let masterName: string | undefined = undefined;
        switch (slideData.layout) {
          case "title":
            masterName = "LAYOUT_TITLE";
            break;
          case "content":
            masterName = "LAYOUT_WIDE";
            break;
          case "two-content":
            masterName = "LAYOUT_TWO_CONTENT";
            break;
          case "blank":
            masterName = "LAYOUT_BLANK";
            break;
        }
        const slide = masterName ? pptx.addSlide(masterName) : pptx.addSlide();

        // إضافة العنوان إذا كان موجود
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.8,
            fontSize: 32,
            bold: true,
            align: "center",
          });
        }

        // معالجة المحتوى
        let yPosition = slideData.title ? 1.5 : 0.5;
        for (const contentItem of slideData.content) {
          // تحويل position من width/height إلى w/h
          const rawPosition = contentItem.position || {
            x: 0.5,
            y: yPosition,
            width: 9,
            height: 1,
          };
          const position = {
            x: rawPosition.x,
            y: rawPosition.y,
            w:
              ("width" in rawPosition
                ? rawPosition.width
                : (rawPosition as Record<string, number>).w) || 9,
            h:
              ("height" in rawPosition
                ? rawPosition.height
                : (rawPosition as Record<string, number>).h) || 1,
          };

          switch (contentItem.type) {
            case "text":
              slide.addText(String(contentItem.data), {
                x: position.x,
                y: position.y,
                w: position.w,
                h: position.h,
                fontSize: 18,
                align: "left",
              });
              yPosition += position.h + 0.3;
              break;

            case "table": {
              const tableData = contentItem.data as unknown[][];
              if (tableData.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                slide.addTable(tableData as any[], {
                  x: position.x,
                  y: position.y,
                  w: position.w,
                  h: position.h,
                  fontSize: 12,
                  align: "left",
                  border: { type: "solid", color: "363636", pt: 1 },
                });
                yPosition += position.h + 0.3;
              }
              break;
            }

            case "chart":
              // ملاحظة: pptxgenjs يدعم charts لكن يحتاج بيانات محددة
              slide.addText("Chart placeholder", {
                x: position.x,
                y: position.y,
                w: position.w,
                h: position.h,
                fontSize: 14,
                align: "center",
                color: "666666",
              });
              yPosition += position.h + 0.3;
              break;

            case "image":
              // ملاحظة: يحتاج base64 image data
              slide.addText("Image placeholder", {
                x: position.x,
                y: position.y,
                w: position.w,
                h: position.h,
                fontSize: 14,
                align: "center",
                color: "666666",
              });
              yPosition += position.h + 0.3;
              break;

            default:
              slide.addText(String(contentItem.data), {
                x: position.x,
                y: position.y,
                w: position.w,
                h: position.h,
                fontSize: 14,
              });
              yPosition += position.h + 0.3;
          }
        }

        // إضافة transitions إذا كان مفعّل
        // ملاحظة: pptxgenjs لا يدعم transitions مباشرة في API الحالي
        // يمكن إضافتها لاحقاً إذا كانت متاحة
      }

      // تحويل إلى buffer
      const buffer = await pptx.write({ outputType: "nodebuffer" });
      // pptx.write يعيد ArrayBuffer أو Buffer، نحتاج للتحويل
      if (buffer instanceof ArrayBuffer) {
        return Buffer.from(buffer);
      } else if (Buffer.isBuffer(buffer)) {
        return buffer;
      } else {
        return Buffer.from(buffer as Uint8Array);
      }
    } catch (error) {
      logger.error("Failed to generate PowerPoint file", {
        error: error instanceof Error ? error.message : "Unknown error",
        request,
      });
      throw error;
    }
  }

  /**
   * التحقق من صحة البيانات
   */
  validateRequest(request: PowerPointGenerationRequest): boolean {
    if (!request.slides || request.slides.length === 0) {
      throw new Error("يجب تحديد على الأقل slide واحد");
    }

    for (const slide of request.slides) {
      if (!slide.content || slide.content.length === 0) {
        throw new Error("محتوى الـ slide مطلوب");
      }
    }

    return true;
  }
}
