import React from 'react';
import { Outlet } from 'react-router-dom';
import { DeveloperSidebar } from './DeveloperSidebar';

export const DeveloperLayout: React.FC = () => {
    return (
        <div className="flex bg-slate-950 min-h-screen text-slate-200 font-sans">
            <DeveloperSidebar />

            <main className="flex-1 ml-64 h-screen overflow-y-auto bg-slate-950 no-scrollbar">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};
