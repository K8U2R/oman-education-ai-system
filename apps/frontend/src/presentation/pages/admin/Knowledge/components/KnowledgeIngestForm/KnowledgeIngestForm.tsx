import React from 'react'

interface KnowledgeIngestFormProps {
    title: string
    setTitle: (val: string) => void
    category: string
    setCategory: (val: string) => void
    content: string
    setContent: (val: string) => void
    loading: boolean
    status: { type: 'success' | 'error', message: string } | null
    onSubmit: (e: React.FormEvent) => void
}

const KnowledgeIngestForm: React.FC<KnowledgeIngestFormProps> = ({
    title, setTitle,
    category, setCategory,
    content, setContent,
    loading, status,
    onSubmit
}) => {
    return (
        <div className="bg-bg-surface rounded-xl shadow-sm border border-border-primary p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-primary-600">📚</span>
                <span className="text-text-primary">إضافة مصدر جديد</span>
            </h2>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            عنوان المصدر
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-app text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="مثال: كتاب الفيزياء للصف الثاني عشر"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            التصنيف
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-app text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                            <option value="curriculum">منهج دراسي</option>
                            <option value="reference">مرجع إضافي</option>
                            <option value="rules">قوانين ولوائح</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        المحتوى النصي
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-64 px-4 py-2 rounded-lg border border-border-primary bg-bg-app text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-mono text-sm"
                        placeholder="انسخ والصق نص الكتاب أو الوحدة الدراسية هنا..."
                        required
                    />
                    <p className="mt-2 text-xs text-text-tertiary">
                        سيقوم النظام بتقسيم النص تلقائياً إلى أجزاء صغيرة وفهرستها للبحث الدلالي.
                    </p>
                </div>

                {status && (
                    <div className={`p-4 rounded-lg ${status.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                        {status.message}
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-border-secondary">
                    <button
                        type="button"
                        className="px-6 py-2 text-text-secondary hover:bg-bg-tertiary rounded-lg transition-colors"
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
    )
}

export default KnowledgeIngestForm
