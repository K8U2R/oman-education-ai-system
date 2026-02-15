import React from 'react';
import { useKnowledge } from './core/Knowledge.hooks';
import KnowledgeIngestForm from './components/KnowledgeIngestForm/KnowledgeIngestForm';

/**
 * KnowledgePage - صفحة إدارة المعرفة
 *
 * Sovereign container component. < 100 lines.
 */
const KnowledgePage: React.FC = () => {
    const {
        title, setTitle,
        category, setCategory,
        content, setContent,
        loading, status,
        handleIngest
    } = useKnowledge();

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">إدارة المعرفة</h1>
                <p className="text-text-secondary">
                    تغذية الذكاء الاصطناعي بالمناهج والمصادر التعليمية.
                </p>
            </header>

            <KnowledgeIngestForm
                title={title}
                setTitle={setTitle}
                category={category}
                setCategory={setCategory}
                content={content}
                setContent={setContent}
                loading={loading}
                status={status}
                onSubmit={handleIngest}
            />
        </div>
    );
};

export default KnowledgePage;
