import React, { useState } from 'react';
import { Card } from '../../components/ui/layout/Card/Card';
import { Button } from '../../components/ui/inputs/Button/Button';
import { Input } from '../../components/ui/inputs/Input/Input';
import { EducationService, EducationLevel } from '../../../infrastructure/services/education.service';
import { AlertTriangle, BookOpen, Loader2, Sparkles } from 'lucide-react';

export const LessonGeneratorPage: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [level, setLevel] = useState<string>(EducationLevel.GRADE_10);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const lesson = await EducationService.generateLesson(topic, level);
            setResult(lesson);
        } catch (err: any) {
            setError(err.response?.data?.error || "فشل توليد الدرس. يرجى المحاولة لاحقاً.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8" dir="rtl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
                    <Sparkles className="text-secondary-500 w-8 h-8" />
                    مختبر المناهج الذكي
                </h1>
                <p className="text-text-secondary mt-2">
                    قم بتوليد دروس تعليمية متكاملة باستخدام الذكاء الاصطناعي في ثوانٍ.
                </p>
            </div>

            {/* Input Card */}
            <Card className="p-6 space-y-6 bg-bg-surface border-border-secondary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">عنوان الدرس / الموضوع</label>
                        <Input
                            placeholder="مثال: الفاعل والمفعول به"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="bg-bg-app border-border-primary text-text-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">المستوى الدراسي</label>
                        <select
                            className="w-full h-10 rounded-lg border-border-primary border px-3 focus:ring-2 focus:ring-primary-500 outline-none bg-bg-app text-text-primary"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                        >
                            {Object.values(EducationLevel).map((lvl) => (
                                <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button
                        onClick={handleGenerate}
                        disabled={loading || !topic}
                        className="w-full md:w-auto"
                        variant="primary" // Assuming variant exists based on commonly used props
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                جاري التوليد...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                توليد الدرس
                            </>
                        )}
                    </Button>
                </div>

                {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3 text-error">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}
            </Card>

            {/* Result Area */}
            {result && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="p-8 border-t-4 border-t-secondary-500 bg-bg-surface border-border-secondary">
                        <div className="mb-6 flex items-center gap-3 pb-6 border-b border-border-secondary">
                            <div className="p-3 bg-primary-100/10 rounded-full">
                                <BookOpen className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-text-primary">{result.title}</h2>
                                <span className="text-xs font-mono text-text-tertiary bg-bg-tertiary px-2 py-1 rounded border border-border-primary">
                                    {result.id}
                                </span>
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none text-text-secondary dark:prose-invert">
                            {/* Simple rendering for now, ideally strictly verify Markdown renderer availability */}
                            <pre className="whitespace-pre-wrap font-sans">
                                {result.content}
                            </pre>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};
