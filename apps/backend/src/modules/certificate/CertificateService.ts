import { prisma } from "../../infrastructure/database/client";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export class CertificateService {
  /**
   * Issue a certificate for a completed course
   */
  async issueCertificate(userId: string, courseId: string) {
    // 1. Verify eligibility (check usage of CourseService or direct DB query)
    const progress = await prisma.enrollments.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: courseId,
        },
      },
    });

    if (!progress || progress.progress < 100) {
      throw new Error("Course not completed");
    }

    // 2. Generate PDF
    const pdfPath = await this.generateCertificatePDF(userId, courseId);

    // 3. Store record
    const certificate = await prisma.certificates.create({
      data: {
        user_id: userId,
        course_id: courseId,
        pdf_url: pdfPath, // In real app, upload to S3/Cloud Storage and store URL
      },
    });

    return certificate;
  }

  /**
   * Generate PDF file
   */
  private async generateCertificatePDF(
    userId: string,
    courseId: string,
  ): Promise<string> {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    const course = await prisma.courses.findUnique({ where: { id: courseId } });

    if (!user || !course) throw new Error("User or Course not found");

    const doc = new PDFDocument({ layout: "landscape" });
    const fileName = `certificate-${userId}-${courseId}.pdf`;
    const filePath = path.join(
      __dirname,
      "../../../../storage/certificates",
      fileName,
    ); // Ensure storage dir exists

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Design
    doc
      .fontSize(30)
      .text("CERTIFICATE OF COMPLETION", 100, 100, { align: "center" });
    doc.moveDown();
    doc.fontSize(20).text("This certifies that", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(25)
      .text(`${user.first_name} ${user.last_name}`, { align: "center" });
    doc.moveDown();
    doc
      .fontSize(20)
      .text("Has successfully completed the course", { align: "center" });
    doc.moveDown();
    doc.fontSize(25).text(course.title, { align: "center" });
    doc.moveDown();
    doc
      .fontSize(15)
      .text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });

    doc.end();

    return `/storage/certificates/${fileName}`;
  }
}
