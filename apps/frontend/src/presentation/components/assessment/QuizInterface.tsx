import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '://localhhttpost:3000/api/v1';

interface QuizInterfaceProps {
    assessmentId: string;
    questions: { id: string; text: string; type: 'multiple-choice' | 'text' }[];
    onComplete: (score: number) => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ assessmentId, questions, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const submitMutation = useMutation({
        mutationFn: async (ans: string) => {
            if (!currentQuestion) throw new Error("No active question");
            const res = await axios.post(`${API_URL}/assessments/${assessmentId}/submit`, {
                questionId: currentQuestion.id,
                answer: ans
            });
            return res.data;
        },
        onSuccess: (data) => {
            setFeedback(data.feedback);
            // In a real app, we'd accumulate score. For MVP, we just show feedback.
            if (isLastQuestion) {
                setTimeout(() => onComplete(data.score), 2000);
            } else {
                setTimeout(() => {
                    setFeedback(null);
                    setAnswer('');
                    setCurrentQuestionIndex(prev => prev + 1);
                }, 2000); // Show feedback for 2s then next
            }
        },
        onError: () => {
            setFeedback("Error submitting answer. Please try again.");
        }
    });

    if (!currentQuestion) {
        return <div className="p-4 text-center">No questions available or quiz completed.</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Assessment</h3>
                <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
            </div>

            <div className="mb-8">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{currentQuestion.text}</p>

                {currentQuestion.type === 'text' && (
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                        rows={4}
                        placeholder="Type your answer here..."
                        disabled={!!feedback}
                    />
                )}

                {/* Add Multiple Choice logic here if needed */}
            </div>

            {feedback && (
                <div className={`p-4 mb-6 rounded-lg ${feedback.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    <strong>Feedback:</strong> {feedback}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    onClick={() => submitMutation.mutate(answer)}
                    disabled={!answer.trim() || !!feedback || submitMutation.isPending}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    {submitMutation.isPending ? 'Grading...' : isLastQuestion ? 'Finish' : 'Next Question'}
                </button>
            </div>
        </div>
    );
};
