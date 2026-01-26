import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, Activity, Terminal } from 'lucide-react';

export const DeveloperSidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'قمرة القيادة', path: '/dev/cockpit' },
        { icon: ShieldCheck, label: 'الحارس (Sentinel)', path: '/dev/sentinel' },
    ];

    return (
        <aside className="w-64 bg-bg-secondary border-l border-border-primary flex flex-col h-screen sticky top-0 transition-colors duration-300">
            <div className="p-6 flex items-center gap-3 border-b border-border-primary">
                <Activity className="text-primary-500 w-8 h-8" />
                <div>
                    <h1 className="font-bold text-text-primary tracking-tight">Oman AI</h1>
                    <span className="text-xs text-primary-500 font-bold tracking-widest uppercase">DevConsole</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                                ? 'bg-primary-500/10 text-primary-600 font-bold border border-primary-500/20'
                                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'}
            `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border-primary">
                <div className="bg-bg-tertiary rounded-xl p-4 border border-border-primary">
                    <div className="flex items-center gap-2 mb-2">
                        <Terminal className="w-4 h-4 text-text-tertiary" />
                        <span className="text-xs font-mono text-text-tertiary">System Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
                        <span className="text-sm font-bold text-success-600">ONLINE</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};
