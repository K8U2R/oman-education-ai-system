import React from 'react';
import { Activity } from 'lucide-react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSystemMetrics } from './hooks/useSystemMetrics';

export const SystemHealthChart: React.FC = () => {
    const { metrics } = useSystemMetrics();

    // Transform metric into array for chart (mocking history or using singlestat if no history endpoint)
    // Ideally we'd have a history endpoint, but for now adapt single point
    const chartData = metrics ? [{ name: 'Now', used: metrics.memory.heapUsed }] : [];

    return (
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
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorUsed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
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
    );
};
