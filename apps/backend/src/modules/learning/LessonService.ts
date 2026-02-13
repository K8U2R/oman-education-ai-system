import { prisma } from "../../infrastructure/database/client";

export class LessonService {
  async getLessonById(id: string) {
    return prisma.lessons.findUnique({
      where: { id },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  async completeLesson(_userId: string, _lessonId: string) {
    // Logic to mark lesson as complete (usually updates enrollment progress)
    // For MVP, we might just log it or have a 'user_lessons' table if we needed granular tracking.
    // But per schema, we only have 'enrollments.progress'.
    // This would be a more complex calculation in a real app.
    return true;
  }
}
