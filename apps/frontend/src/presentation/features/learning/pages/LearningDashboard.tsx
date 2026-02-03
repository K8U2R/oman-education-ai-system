
import React, { useEffect, useState } from 'react';
import { learningService } from '../services/learning.service';
import { SubscriptionBanner } from '../components/SubscriptionBanner';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Link } from 'react-router-dom';

export const LearningDashboard: React.FC = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        learningService.getCourses()
            .then(setCourses)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8">Loading your learning path...</div>;

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">Learning Dashboard</h1>

            <SubscriptionBanner tier="FREE" /> {/* Todo: Fetch real tier */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {course.level}
                                </span>
                                <Link to={`/learning/courses/${course.id}`}>
                                    <Button>Start Learning</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
