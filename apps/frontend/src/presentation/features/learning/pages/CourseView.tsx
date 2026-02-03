
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { learningService } from '../services/learning.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { ChevronRight, PlayCircle, BookOpen } from 'lucide-react'; // Assuming lucide-react or similar

export const CourseView: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [course, setCourse] = useState<any>(null);

    useEffect(() => {
        // We need getCourse(id) which fetches full structure (modules/lessons)
        // Re-using getCourses() and filtering is inefficient but works for MVP if getCourses returns everything
        // Ideally add getCourse(id) to service.
        learningService.getCourses().then(courses => {
            const found = courses.find((c: any) => c.id === courseId);
            setCourse(found);
        }).catch(console.error);
    }, [courseId]);

    if (!course) return <div className="p-8">Loading course...</div>;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8">
                <Link to="/learning" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
                <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                <p className="text-gray-600 text-lg">{course.description}</p>
            </div>

            <div className="space-y-6">
                {course.modules?.map((module: any) => (
                    <Card key={module.id}>
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-xl flex justify-between">
                                <span>{module.title}</span>
                                <span className="text-sm font-normal text-gray-500">Module {module.order}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {module.lessons?.map((lesson: any) => (
                                <Link key={lesson.id} to={`/learning/lessons/${lesson.id}`} className="block">
                                    <div className="p-4 border-b last:border-0 hover:bg-gray-50 flex items-center justify-between transition-colors">
                                        <div className="flex items-center gap-3">
                                            {lesson.type === 'video' ? <PlayCircle size={20} className="text-purple-600" /> : <BookOpen size={20} className="text-blue-600" />}
                                            <span className="font-medium text-gray-700">{lesson.title}</span>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
