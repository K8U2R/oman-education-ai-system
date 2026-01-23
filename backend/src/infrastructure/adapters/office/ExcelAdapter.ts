/**
 * Excel Adapter - محول Excel
 *
 * Infrastructure Adapter لإنشاء ملفات Excel
 */

import ExcelJS from "exceljs";
import { ExcelGenerationRequest } from "@/domain/types/shared";
import { logger } from "@/shared/utils/logger";

export class ExcelAdapter {
  /**
   * إنشاء ملف Excel
   *
   * @param request - طلب إنشاء Excel
   * @returns Buffer للملف
   */
  async generateExcel(request: ExcelGenerationRequest): Promise<Buffer> {
    try {
      this.validateRequest(request);

      logger.info("Generating Excel file", {
        type: request.type,
        sheetsCount: request.sheets?.length || 0,
      });

      // إنشاء workbook جديد
      const workbook = new ExcelJS.Workbook();

      // إضافة metadata
      workbook.creator = request.options?.author || "Oman Education AI System";
      workbook.created = new Date();
      workbook.modified = new Date();
      if (request.options?.title) {
        workbook.title = request.options.title;
      }
      if (request.options?.subject) {
        workbook.subject = request.options.subject;
      }

      // إضافة كل sheet
      for (const sheetData of request.sheets) {
        const worksheet = workbook.addWorksheet(sheetData.name);

        // إضافة headers
        worksheet.columns = sheetData.headers.map((header, index) => ({
          header,
          key: `col${index}`,
          width: 15,
        }));

        // تطبيق style على headers
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, size: 12 };
        headerRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: sheetData.style?.header_color?.replace("#", "") || "FF4472C4",
          },
        };
        headerRow.alignment = { vertical: "middle", horizontal: "center" };

        // إضافة البيانات
        for (const row of sheetData.rows) {
          const worksheetRow = worksheet.addRow(row);

          // تطبيق alternate row color إذا كان موجود
          if (
            sheetData.style?.alternate_row_color &&
            worksheetRow.number % 2 === 0
          ) {
            worksheetRow.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: {
                argb: sheetData.style.alternate_row_color.replace("#", ""),
              },
            };
          }

          // تطبيق font size إذا كان موجود
          if (sheetData.style?.font_size) {
            worksheetRow.font = { size: sheetData.style.font_size };
          }
        }

        // تطبيق auto filter على headers
        worksheet.autoFilter = {
          from: { row: 1, column: 1 },
          to: { row: 1, column: sheetData.headers.length },
        };

        // ضبط column widths تلقائياً
        worksheet.columns.forEach((column) => {
          if (column.header) {
            column.width = Math.max(column.header.length + 2, 15);
          }
        });
      }

      // تحويل إلى buffer
      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);
    } catch (error) {
      logger.error("Failed to generate Excel file", {
        error: error instanceof Error ? error.message : "Unknown error",
        request,
      });
      throw error;
    }
  }

  /**
   * التحقق من صحة البيانات
   */
  validateRequest(request: ExcelGenerationRequest): boolean {
    if (!request.sheets || request.sheets.length === 0) {
      throw new Error("يجب تحديد على الأقل sheet واحد");
    }

    for (const sheet of request.sheets) {
      if (!sheet.name) {
        throw new Error("اسم الـ sheet مطلوب");
      }
      if (!sheet.headers || sheet.headers.length === 0) {
        throw new Error("رؤوس الأعمدة مطلوبة");
      }
    }

    return true;
  }
}
