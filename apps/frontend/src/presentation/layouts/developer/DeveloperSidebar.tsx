import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BrainCircuit,
    Database,
    ScrollText,
    Settings,
    Activity
} from 'lucide-react';

export const DeveloperSidebar: React.FC = () => {
    const navItems = [
        { path: '/dev/cockpit', icon: LayoutDashboard, label: 'Overview', end: true },
        { path: '/dev/cockpit/ai-lab', icon: BrainCircuit, label: 'AI Lab' },
        { path: '/dev/cockpit/database', icon: Database, label: 'Database' },
        { path: '/dev/cockpit/logs', icon: ScrollText, label: 'System Logs' },
        { path: '/dev/cockpit/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-64 bg-slate-950 border-r border-slate-800 h-screen flex flex-col fixed left-0 top-0 overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <Activity size={20} />
                </div>
                <div>
                    <h1 className="font-bold text-white text-sm">Oman AI System</h1>
                    <p className="text-xs text-slate-400">Developer Cockpit</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                            ${isActive
                                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            }
                        `}
                    >
                        <item.icon size={18} />
                        <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-900 rounded-lg p-3 text-xs text-slate-500 text-center">
                    v1.0.0-dev
                </div>
            </div>
        </div>
    );
};
