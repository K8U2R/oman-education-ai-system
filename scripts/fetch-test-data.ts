import { prisma } from '../apps/backend/src/infrastructure/database/client';

async function main() {
    const users = await prisma.users.findMany({
        where: { email: { in: ['admin@oman-edu.ai', 'student@oman-edu.ai'] } },
        select: { id: true, email: true, planTier: true }
    });

    const courses = await prisma.courses.findMany({
        take: 1,
        select: { id: true, slug: true }
    });

    // Create Dummy Assessment for Load Test
    let assessmentId = "";
    if (courses.length > 0 && users.length > 0) {
        // Find existing module or use one
        const module = await prisma.modules.findFirst({ where: { course_id: courses[0].id } });

        if (module) {
            // Find or create an assessment
            let assessment = await prisma.assessments.findFirst();
            if (!assessment) {
                assessment = await prisma.assessments.create({
                    data: {
                        title: "AI Basics Quiz",
                        // course_id: courses[0].id,
                        // module_id: module.id,
                        course: { connect: { id: courses[0].id } },
                        type: "QUIZ", // Guessing required fields if any, schema usually has defaults
                        passing_score: 60
                        // order: 1 // Default
                    }
                }).catch(e => { console.error(e); return null; });
            }

            // Use Admin User
            const admin = users.find(u => u.email === 'admin@oman-edu.ai');
            if (admin && assessment) {
                // Check if exists
                const existing = await prisma.user_assessments.findFirst({
                    where: { user_id: admin.id, assessment_id: assessment.id }
                });

                if (existing) {
                    assessmentId = existing.id;
                } else {
                    const ua = await prisma.user_assessments.create({
                        data: {
                            user_id: admin.id,
                            assessment_id: assessment.id,
                            status: 'IN_PROGRESS',
                            score: 0
                        }
                    });
                    assessmentId = ua.id;
                }
            }
        }
    }

    console.log('---DATA START---');
    console.log(JSON.stringify({ users, courses, assessmentId }, null, 2));
    console.log('---DATA END---');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
