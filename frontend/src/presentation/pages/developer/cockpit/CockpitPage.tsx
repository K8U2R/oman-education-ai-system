/**
 * Developer Cockpit Page - قمرة قيادة المطور
 * 
 * الوصف: واجهة تفاعلية لمراقبة السجلات والحالة في الوقت الفعلي.
 * السلطة الدستورية: القانون 06 (التصميم الموحد) والقانون 10 (السيادة السياقية).
 * التحديث: تم ربطها بنظام الرموز (Design Tokens) لتدعم الثيمات والوضع الليلي تلقائياً.
 */

import React, { useEffect, useState, useRef } from 'react';
import { Terminal, Activity, Shield, Search, RefreshCw, Layers } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface LogEntry {
    level: string;
    message: string;
    timestamp: string;
    [key: string]: any;
}

interface Metrics {
    uptime: number;
    memory: {
        rss: number;
        heapTotal: number;
        heapUsed: number;
        external: number;
    };
    cpu: {
        user: number;
        system: number;
    };
}

const CockpitPage: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [filter, setFilter] = useState<'all' | 'error' | 'info'>('all');
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [isLive, setIsLive] = useState(true);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isLive) return;
        const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/api/v1/developer/cockpit/logs`);
        eventSource.onmessage = (event) => {
            const newLog = JSON.parse(event.data);
            setLogs((prev) => [...prev.slice(-100), newLog]);
        };
        eventSource.onerror = (err) => {
            console.error("SSE Error:", err);
            eventSource.close();
        };
        return () => eventSource.close();
    }, [isLive]);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/developer/cockpit/health`);
                const data = await response.json();
                if (data.success) {
                    setMetrics(data.metrics);
                }
            } catch (error) {
                console.error("Metrics Fetch Error:", error);
            }
        };
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const filteredLogs = logs.filter((log) => {
        if (filter === 'all') return true;
        if (filter === 'error') return log.level.toLowerCase().includes('error');
        if (filter === 'info') return log.level.toLowerCase().includes('info');
        return true;
    });

    const formatMemory = (bytes: number) => (bytes / 1024 / 1024).toFixed(2);

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary p-6 font-['Cairo'] transition-colors duration-300" dir="rtl">

            {/* Header */}
            <header className="flex justify-between items-center mb-8 bg-bg-secondary backdrop-blur-xl p-4 rounded-2xl border border-border-primary shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-500/10 rounded-xl border border-primary-500/20">
                        <Layers className="text-primary-500 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-text-primary">قمرة قيادة المطور</h1>
                        <p className="text-text-secondary text-sm">عنقود المراقبة السيادي</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`px-4 py-2 rounded-xl flex items-center gap-2 border transition-all ${isLive ? 'bg-success-500/10 border-success-500/30 text-success-500' : 'bg-bg-tertiary border-border-primary text-text-tertiary'}`}
                    >
                        <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
                        {isLive ? 'البث الحي مفعّل' : 'البث متوقف مؤقتاً'}
                    </button>
                    <div className="px-4 py-2 bg-bg-secondary border border-border-primary rounded-xl flex items-center gap-2">
                        <Shield className="text-primary-500 w-4 h-4" />
                        <span className="text-sm font-medium text-text-secondary">حماية الـ IP نشطة</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6">

                {/* Memory Chart */}
                <div className="col-span-12 lg:col-span-8 bg-bg-secondary backdrop-blur-md rounded-3xl border border-border-primary p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-text-primary">
                            <Activity className="text-primary-500 w-5 h-5" /> تحليل استهلاك الذاكرة
                        </h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                                <span className="text-xs text-text-tertiary font-medium">الذاكرة المستخدمة (Heap)</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[]}>
                                <defs>
                                    <linearGradient id="colorUsed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-secondary)" vertical={false} />
                                <XAxis hide />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border-primary)', borderRadius: '12px' }}
                                    itemStyle={{ color: 'var(--color-text-primary)' }}
                                />
                                <Area type="monotone" dataKey="used" stroke="var(--color-primary-500)" fillOpacity={1} fill="url(#colorUsed)" />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                            <p className="text-4xl font-black italic tracking-tighter text-text-primary">METRIC_LAYER_ACTIVE</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-6">
                    <div className="bg-bg-secondary backdrop-blur-md rounded-3xl border border-border-primary p-6 flex flex-col justify-between shadow-sm">
                        <p className="text-text-tertiary text-sm font-bold uppercase tracking-widest mb-2">استهلاك الـ Heap</p>
                        <div className="flex items-end gap-2" dir="ltr">
                            <span className="text-4xl font-black tracking-tighter text-text-primary">
                                {metrics ? formatMemory(metrics.memory.heapUsed) : '0.00'}
                            </span>
                            <span className="text-primary-500 font-bold mb-1">MB</span>
                        </div>
                        <div className="w-full bg-bg-tertiary h-2 rounded-full mt-4 overflow-hidden">
                            <div
                                className="h-full bg-primary-500 transition-all duration-1000"
                                style={{ width: `${metrics ? Math.min((metrics.memory.heapUsed / metrics.memory.heapTotal) * 100, 100) : 0}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-bg-secondary backdrop-blur-md rounded-3xl border border-border-primary p-6 flex flex-col justify-between shadow-sm">
                        <p className="text-text-tertiary text-sm font-bold uppercase tracking-widest mb-2">مدة تشغيل النظام</p>
                        <div className="flex items-end gap-2" dir="ltr">
                            <span className="text-4xl font-black tracking-tighter text-text-primary">
                                {metrics ? Math.floor(metrics.uptime / 3600) : '0'}
                            </span>
                            <span className="text-primary-500 font-bold mb-1">Hours</span>
                        </div>
                    </div>
                </div>

                {/* Terminal */}
                <div className="col-span-12 bg-gray-950 rounded-3xl border border-gray-800 overflow-hidden flex flex-col h-[600px]">
                    <div className="bg-white/5 px-6 py-4 flex justify-between items-center border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <Terminal className="text-emerald-400 w-5 h-5" />
                            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-300">سجلات النظام السيادية</h3>
                        </div>
                        <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
                            <button onClick={() => setFilter('all')} className={`px-3 py-1 text-xs rounded-lg transition-all ${filter === 'all' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>الكل</button>
                            <button onClick={() => setFilter('error')} className={`px-3 py-1 text-xs rounded-lg transition-all ${filter === 'error' ? 'bg-red-500/20 text-red-500' : 'text-gray-500'}`}>الأخطاء</button>
                            <button onClick={() => setFilter('info')} className={`px-3 py-1 text-xs rounded-lg transition-all ${filter === 'info' ? 'bg-blue-500/20 text-blue-500' : 'text-gray-500'}`}>فلتر</button>
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
            </div>
        </div>
    );
};

export default CockpitPage;
