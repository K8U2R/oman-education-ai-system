
import React, { useState, useRef, useEffect } from 'react';
import { learningService, Message } from '../services/learning.service';
import { Button, Input, Card } from '@/components/ui';
import { FeatureGate } from '@/presentation/components/common/FeatureGate';

/**
 * ChatInterface - واجهة المحادثة مع الذكاء الاصطناعي
 * 
 * ✅ Protected with ai.content-generation.use permission
 * ✅ Shows UpgradePrompt for users without permission
 */
const ChatInterfaceCore: React.FC<{ context?: string }> = ({ context }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [threadId, setThreadId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await learningService.sendChatMessage(userMsg.content, threadId, context);
            setThreadId(result.threadId);

            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: result.response };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            // Todo: Add toast error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[500px] p-4 bg-slate-50 dark:bg-slate-900">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-20">
                        👋 Hello! I'm your AI Tutor. Ask me anything about this lesson.
                    </div>
                )}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-800'
                                }`}
                        >
                            <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <span className="animate-pulse">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask a question..."
                    disabled={isLoading}
                    className="flex-1"
                />
                <Button onClick={handleSend} disabled={isLoading}>
                    Send
                </Button>
            </div>
        </Card>
    );
};

/**
 * ChatInterface with Permission Protection
 * 
 * Wraps the core interface with FeatureGate to enforce ai.content-generation.use permission
 */
export const ChatInterface: React.FC<{ context?: string }> = (props) => {
    return (
        <FeatureGate
            permission="ai.content-generation.use"
            featureName="AI Content Generation"
        >
            <ChatInterfaceCore {...props} />
        </FeatureGate>
    );
};
