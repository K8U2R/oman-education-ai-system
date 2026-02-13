import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LearningService } from '../../../../infrastructure/services/learning.service';
import { ChatInterface } from '../../../components/learning/ChatInterface';
// import { useTranslation } from 'react-i18next';
// Mock Auth Hook - in real app would import from useAuth()
// Assuming standard hook structure
const useAuth = () => {
    // Return mock data that matches the seeded student
    return {
        user: {
            id: 'seeded-student-id',
            first_name: 'Ali',
            planTier: 'FREE' as const // Change to 'PRO' to test unlock
        }
    };
};

export const LearningDashboard: React.FC = () => {
    // const { t } = useTranslation(); // Unused
    const { user } = useAuth();

    // Fetch the specific course we seeded
    const { data: course, isLoading, error } = useQuery({
        queryKey: ['course', 'introduction-to-ai'],
        queryFn: () => LearningService.getCourseBySlug('introduction-to-ai')
    });

    if (isLoading) return <div className="p-10 text-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent mx-auto"></div></div>;
    if (error) return <div className="p-10 text-center text-red-500">Error loading course. Please ensure backend is running and seeded.</div>;
    if (!course) return <div className="p-10 text-center">Course not found.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300 uppercase tracking-wide">
                        {course.level}
                    </span>
                    <span className="mx-2">•</span>
                    {course.modules.length} Modules
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Modules List */}
                <div className="lg:col-span-2 space-y-6">
                    {course.modules.map((module: any) => (
                        <div key={module.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{module.title}</h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {module.lessons?.map((lesson: any) => (
                                    <div key={lesson.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                {lesson.title}
                                            </span>
                                        </div>
                                        <button className="text-sm text-gray-400 hover:text-indigo-600">Start</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar: AI Tutor */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <ChatInterface
                            userTier={user.planTier} // Law 14 Enforcement
                        />
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Learning Tip</h4>
                            <p className="text-xs text-blue-700 dark:text-blue-200">
                                Use the AI Tutor to ask questions about the current module. Premium users get code reviews!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
