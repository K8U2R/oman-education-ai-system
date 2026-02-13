import { useState } from 'react';
import { AiService, GenerateLessonRequest, LessonPlanResponse } from '@/infrastructure/services/ai/AiService';
import { useToast } from '@/presentation/components/ui/feedback/Toast/useToast';
import { useTranslation } from 'react-i18next';

export const useAiGeneration = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<LessonPlanResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { success: showSuccess, error: showError } = useToast();
    const { t } = useTranslation();

    const generate = async (request: GenerateLessonRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await AiService.generateLesson(request);
            setData(result);
            showSuccess(t('ai.success.lesson_generated'));
            return result;
        } catch (err: any) {
            const message = err.response?.data?.message || t('ai.error.generation_failed');
            setError(message);
            showError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        generate,
        isLoading,
        data,
        error,
        reset: () => {
            setData(null);
            setError(null);
        }
    };
};
