
import React, { useState } from 'react';
import { KnowledgeService } from '@/infrastructure/services/admin/KnowledgeService';
import { useAuth } from '@/presentation/hooks/useAuth';

export const KnowledgePage: React.FC = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('curriculum');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleIngest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        setLoading(true);
        setStatus(null);

        try {
            const result = await KnowledgeService.ingestText({
                text: content,
                metadata: {
                    source: title,
                    category: category,
                    description: `Uploaded by ${user?.email}`
                }
            });

            setStatus({
                type: 'success',
                message: `تم الرفع بنجاح! تم تقسيم النص إلى ${result.chunks} جزء.`
            });
            setTitle('');
            setContent('');
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'حدث خطأ أثناء الرفع. الرجاء المحاولة مرة أخرى.'
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المعرفة</h1>
                <p className="text-gray-600">
                    تغذية الذكاء الاصطناعي بالمناهج والمصادر التعليمية.
                </p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="text-primary-600">📚</span>
                    إضافة مصدر جديد
                </h2>

                <form onSubmit={handleIngest} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                عنوان المصدر
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="مثال: كتاب الفيزياء للصف الثاني عشر"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                التصنيف
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            >
                                <option value="curriculum">منهج دراسي</option>
                                <option value="reference">مرجع إضافي</option>
                                <option value="rules">قوانين ولوائح</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            المحتوى النصي
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-64 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-mono text-sm"
                            placeholder="انسخ والصق نص الكتاب أو الوحدة الدراسية هنا..."
                            required
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            سيقوم النظام بتقسيم النص تلقائياً إلى أجزاء صغيرة وفهرستها للبحث الدلالي.
                        </p>
                    </div>

                    {status && (
                        <div className={`p-4 rounded-lg ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {status.message}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => { setTitle(''); setContent(''); }}
                        >
                            مسح
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'جاري المعالجة...' : 'رفع وفهرسة'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
