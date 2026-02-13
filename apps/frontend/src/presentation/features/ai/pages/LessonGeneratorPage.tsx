import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, GraduationCap, Loader2 } from 'lucide-react';
import { useAiGeneration } from '../hooks/useAiGeneration';
import { Button } from '@/presentation/components/ui/inputs/Button/Button';
import { Input } from '@/presentation/components/ui/inputs/Input/Input';

export const LessonGeneratorPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { generate, isLoading, data } = useAiGeneration();

    // Form State
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        await generate({
            topic,
            subject,
            gradeLevel: grade,
            language: i18n.language as 'ar' | 'en'
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <header className="mb-12 text-center">
                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10 text-primary animate-float">
                    <Sparkles className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                    {t('ai.lesson_generator.title', 'AI Lesson Planner')}
                </h1>
                <p className="text-muted-foreground text-lg">
                    {t('ai.lesson_generator.subtitle', 'Create comprehensive lesson plans in seconds using Omani AI')}
                </p>
            </header>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Input Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 h-fit"
                >
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        {t('ai.form.details', 'Lesson Details')}
                    </h2>

                    <form onSubmit={handleGenerate} className="space-y-4">
                        <Input
                            label={t('ai.form.topic', 'Topic')}
                            placeholder={t('ai.form.topic_placeholder', 'e.g. Photosynthesis')}
                            value={topic}
                            onChange={(e: any) => setTopic(e.target.value)}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label={t('ai.form.subject', 'Subject')}
                                placeholder={t('ai.form.subject_placeholder', 'Science')}
                                value={subject}
                                onChange={(e: any) => setSubject(e.target.value)}
                                required
                            />
                            <Input
                                label={t('ai.form.grade', 'Grade Level')}
                                placeholder={t('ai.form.grade_placeholder', 'Grade 5')}
                                value={grade}
                                onChange={(e: any) => setGrade(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full btn-gradient mt-6"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {t('ai.form.generating', 'Thinking...')}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    {t('ai.form.generate_btn', 'Generate Implementation Plan')}
                                </>
                            )}
                        </Button>
                    </form>
                </motion.div>

                {/* Result Display */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`glass-card p-6 min-h-[400px] ${!data ? 'flex items-center justify-center text-center' : ''}`}
                >
                    {!data ? (
                        <div className="text-muted-foreground p-8">
                            <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>{t('ai.result.placeholder', 'Your AI-generated lesson plan will appear here ready for the classroom.')}</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="border-b pb-4 border-border">
                                <h3 className="text-2xl font-bold text-primary">{data.topic}</h3>
                                <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                                    <span>{data.subject}</span>
                                    <span>•</span>
                                    <span>{data.gradeLevel}</span>
                                    <span>•</span>
                                    <span>{data.duration}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg mb-2">{t('ai.result.objectives', 'Learning Objectives')}</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-foreground/90">
                                    {data.objectives.map((obj, i) => (
                                        <li key={i}>{obj}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-primary/5 p-4 rounded-lg">
                                <h4 className="font-semibold text-primary mb-2">{t('ai.result.structure', 'Lesson Structure')}</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex gap-2">
                                        <span className="font-medium min-w-[80px] text-muted-foreground">Intro:</span>
                                        <p>{data.structure.introduction.content}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-medium min-w-[80px] text-muted-foreground">Main:</span>
                                        <p>{data.structure.mainActivity.content}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-medium min-w-[80px] text-muted-foreground">Conclusion:</span>
                                        <p>{data.structure.conclusion.content}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};
