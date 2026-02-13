import React, { useEffect, useState, useRef } from 'react';
import { Terminal } from 'lucide-react';
import type { LogEntry } from './types';
import { tokenManager } from '@/infrastructure/services/auth/token-manager.service';

export const LiveLogTerminal: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [filter, setFilter] = useState<'all' | 'error' | 'info'>('all');
    const [isLive, setIsLive] = useState(true);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isLive) return;
        const token = tokenManager.getAccessToken();
        const url = `${import.meta.env.VITE_API_BASE_URL}/developer/cockpit/logs` + (token ? `?token=${token}` : '');
        const eventSource = new EventSource(url);
        eventSource.onmessage = (event) => {
            const newLog = JSON.parse(event.data);
            setLogs((prev) => [...prev.slice(-100), newLog]);
        };
        eventSource.onerror = (err) => {
            console.error("SSE Error:", err);
            eventSource.close();
            setIsLive(false);
        };
        return () => eventSource.close();
    }, [isLive]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const filteredLogs = logs.filter((log) => {
        if (filter === 'all') return true;
        if (filter === 'error') return log.level.toLowerCase().includes('error');
        if (filter === 'info') return log.level.toLowerCase().includes('info');
        return true;
    });

    return (
        <div className="col-span-12 bg-gray-950 rounded-3xl border border-gray-800 overflow-hidden flex flex-col h-[600px]">
            <div className="bg-white/5 px-6 py-4 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                    <Terminal className="text-emerald-400 w-5 h-5" />
                    <h3 className="font-bold text-sm uppercase tracking-widest text-gray-300">سجلات النظام السيادية</h3>
                </div>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`text-xs px-2 ${isLive ? 'text-green-400' : 'text-red-400'}`}
                    >
                        {isLive ? '● LIVE' : '○ PAUSED'}
                    </button>
                    <div className="h-4 w-px bg-white/10 mx-1"></div>
                    <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
                        <button onClick={() => setFilter('all')} className={`px-3 py-1 text-xs rounded-lg transition-all ${filter === 'all' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>الكل</button>
                        <button onClick={() => setFilter('error')} className={`px-3 py-1 text-xs rounded-lg transition-all ${filter === 'error' ? 'bg-red-500/20 text-red-500' : 'text-gray-500'}`}>الأخطاء</button>
                        <button onClick={() => setFilter('info')} className={`px-3 py-1 text-xs rounded-lg transition-all ${filter === 'info' ? 'bg-blue-500/20 text-blue-500' : 'text-gray-500'}`}>فلتر</button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-[13px] text-gray-300" dir="ltr">
                {filteredLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-4 group hover:bg-white/5 py-1 px-2 rounded-md">
                        <span className="text-gray-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className={`font-bold shrink-0 w-16 ${log.level.includes('error') ? 'text-red-500' : log.level.includes('warn') ? 'text-amber-500' : 'text-blue-500'}`}>{log.level.toUpperCase()}</span>
                        <span className="text-gray-300">{log.message}</span>
                    </div>
                ))}
                <div ref={logEndRef} />
            </div>
        </div>
    );
};
