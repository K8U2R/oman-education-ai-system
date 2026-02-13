import { prisma } from "../../infrastructure/database/client";
import { courses } from "@prisma/client";

export class CourseService {
  /**
   * Get all published courses
   * @returns List of published courses
   */
  async getAllCourses(): Promise<courses[]> {
    return prisma.courses.findMany({
      where: { is_published: true },
      include: {
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });
  }

  /**
   * Get course by slug
   * @param slug Course Slug
   * @returns Course with hierarchy
   */
  async getCourseBySlug(slug: string) {
    return prisma.courses.findUnique({
      where: { slug },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { created_at: "asc" }, // Simple ordering
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });
  }

  /**
   * Get user progress for a course
   * @param userId User ID
   * @param courseId Course ID
   */
  async getUserProgress(userId: string, courseId: string) {
    return prisma.enrollments.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: courseId,
        },
      },
    });
  }
}
