import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LearningService } from '../../../infrastructure/services/learning.service';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatInterfaceProps {
    userTier: 'FREE' | 'PRO' | 'PREMIUM';
    initialMessages?: Message[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ userTier, initialMessages = [] }) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [threadId, setThreadId] = useState<string | undefined>(undefined);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Law 14: Tier Sovereignty Logic
    const isLocked = userTier === 'FREE';

    const sendMessageMutation = useMutation({
        mutationFn: (msg: string) => LearningService.sendMessage(msg, threadId),
        onSuccess: (data: { content: string; threadId: string }) => {
            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
            setThreadId(data.threadId);
        },
        onError: (error: any) => {
            if (error.response?.status === 403) {
                // Double check protection (backend enforcement)
                setMessages(prev => [...prev, { role: 'assistant', content: "🔒 This feature requires an upgrade." }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Connection error. Please try again." }]);
            }
        }
    });

    const handleSend = () => {
        if (!input.trim() || isLocked) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        sendMessageMutation.mutate(userMsg);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-[500px] border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-800 rounded-t-lg">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">AI Tutor</h3>
                {isLocked && (
                    <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
                        🔒 PREMIUM ONLY
                    </span>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && !isLocked && (
                    <div className="text-center text-gray-500 mt-10">
                        <p>Ask me anything about this course!</p>
                    </div>
                )}

                {isLocked && messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-70">
                        <div className="text-4xl mb-4">🔒</div>
                        <h4 className="text-lg font-bold">Upgrade to Access AI Tutor</h4>
                        <p className="text-sm text-gray-500 mt-2">Get instant answers and code reviews with our Premium plan.</p>
                        <button className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium shadow-lg hover:opacity-90 transition-opacity">
                            Upgrade Now
                        </button>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                            }`}>
                            <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                        </div>
                    </div>
                ))}

                {sendMessageMutation.isPending && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 rounded-b-lg">
                <div className="flex gap-2 relative">
                    {isLocked && (
                        <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-800/50 cursor-not-allowed z-10 flex items-center justify-center">
                            {/* Overlay to prevent clicking */}
                        </div>
                    )}
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isLocked ? "Unlock Premium to chat..." : "Type your question..."}
                        disabled={isLocked || sendMessageMutation.isPending}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 bg-transparent"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLocked || !input.trim() || sendMessageMutation.isPending}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};
