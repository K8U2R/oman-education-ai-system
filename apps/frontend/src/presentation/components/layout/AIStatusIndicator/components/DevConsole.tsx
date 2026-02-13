import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { cn } from '@/presentation/components/common/utils/classNames';

export interface LogEntry {
    id: string;
    timestamp: number;
    level: 'info' | 'warn' | 'error';
    message: string;
    code?: number;
    latency?: number;
}

interface DevConsoleProps {
    logs: LogEntry[];
    isVisible: boolean;
}

export const DevConsole: React.FC<DevConsoleProps> = ({ logs, isVisible }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, isVisible]);

    if (!isVisible) return null;

    return (
        <div className="mt-2 border-t border-gray-100 dark:border-gray-800 pt-2 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 px-1 mb-2 text-xs font-mono text-gray-500" dir="rtl">
                <Terminal className="w-3 h-3" />
                <span>التشخيص الحي (للمطورين)</span>
            </div>

            <div
                ref={scrollRef}
                className="bg-gray-950 rounded-md p-2 h-32 overflow-y-auto text-[10px] font-mono leading-relaxed scrollbar-thin scrollbar-thumb-gray-700"
            >
                {logs.length === 0 ? (
                    <div className="text-gray-600 italic text-center mt-8">في انتظار السجلات...</div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="mb-1 flex items-start gap-2 group">
                            <span className="text-gray-600 select-none">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, second: '2-digit' })}
                            </span>

                            <div className="flex-1 break-all">
                                <span className={cn(
                                    log.level === 'error' ? 'text-red-400' :
                                        log.level === 'warn' ? 'text-yellow-400' : 'text-green-400'
                                )}>
                                    [{log.level.toUpperCase()}]
                                </span>
                                {' '}
                                <span className="text-gray-300">{log.message}</span>
                                {log.code && <span className="text-gray-500 ml-1">(Code: {log.code})</span>}
                            </div>

                            {log.latency && (
                                <span className={cn(
                                    "ml-auto shrink-0",
                                    log.latency > 1000 ? 'text-red-400' : 'text-gray-500'
                                )}>
                                    {log.latency}ms
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
