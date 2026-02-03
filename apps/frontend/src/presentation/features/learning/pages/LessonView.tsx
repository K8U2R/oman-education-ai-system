
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { learningService } from '../services/learning.service';
import { ChatInterface } from '../components/ChatInterface';
import { Card } from '@/components/ui';

export const LessonView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [lesson, setLesson] = useState<any>(null);

    useEffect(() => {
        if (id) {
            learningService.getLesson(id).then(setLesson).catch(console.error);
        }
    }, [id]);

    if (!lesson) return <div className="p-8">Loading lesson...</div>;

    return (
        <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Lesson Content */}
            <div className="flex-1 overflow-y-auto">
                <Card className="p-8 prose dark:prose-invert max-w-none">
                    <h1>{lesson.title}</h1>
                    {lesson.type === 'video' ? (
                        <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center text-white">
                            Video Player Placeholder
                        </div>
                    ) : (
                        <div className="whitespace-pre-wrap">{lesson.content}</div>
                    )}
                </Card>
            </div>

            {/* AI Tutor Side Panel */}
            <div className="w-full lg:w-[400px]">
                <h3 className="font-bold mb-2">AI Tutor</h3>
                <ChatInterface context={`Lesson: ${lesson.title}\nContent: ${lesson.content}`} />
            </div>
        </div>
    );
};
