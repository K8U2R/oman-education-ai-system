/**
 * Developer Cockpit Page - قمرة قيادة المطور
 * 
 * الوصف: واجهة تفاعلية لمراقبة السجلات والحالة في الوقت الفعلي.
 * السلطة الدستورية: القانون 06 (التصميم الموحد) والقانون 10 (السيادة السياقية).
 * التحديث: تم إعادة الهيكلة (Law 05) لتكون حاوية عرض فقط.
 */

import React from 'react';
import { Layers, Shield } from 'lucide-react';
import { SystemHealthChart } from '../../../components/developer/SystemHealthChart';
import { UptimeCard } from '../../../components/developer/UptimeCard';
import { LiveLogTerminal } from '../../../components/developer/LiveLogTerminal';

const CockpitPage: React.FC = () => {
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
                    <div className="px-4 py-2 bg-bg-secondary border border-border-primary rounded-xl flex items-center gap-2">
                        <Shield className="text-primary-500 w-4 h-4" />
                        <span className="text-sm font-medium text-text-secondary">حماية الـ IP نشطة</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6">
                {/* Visualizer Widget */}
                <SystemHealthChart />

                {/* Stats Widgets */}
                <UptimeCard />

                {/* Logs Widget */}
                <LiveLogTerminal />
            </div>
        </div>
    );
};

export default CockpitPage;
