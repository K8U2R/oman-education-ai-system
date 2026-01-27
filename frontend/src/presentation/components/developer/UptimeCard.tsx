import React from 'react';
import { useSystemMetrics } from './hooks/useSystemMetrics';

export const UptimeCard: React.FC = () => {
    const { metrics } = useSystemMetrics();

    const formatMemory = (bytes: number) => (bytes / 1024 / 1024).toFixed(2);

    return (
        <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-6">
            {/* Heap Stats */}
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

            {/* Uptime Stats */}
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
    );
};
