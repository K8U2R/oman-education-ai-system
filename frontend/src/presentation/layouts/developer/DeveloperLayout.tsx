import React from 'react';
import { Outlet } from 'react-router-dom';
import { DeveloperSidebar } from './DeveloperSidebar';

export const DeveloperLayout = () => {
    return (
        <div className="flex min-h-screen bg-bg-primary text-text-primary font-['Cairo'] transition-colors duration-300" dir="rtl">
            {/* Sidebar - ثابت يمين الشاشة */}
            <DeveloperSidebar />

            {/* Main Content - المحتوى المتغير */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Scrollable Area */}
                <div className="flex-1 overflow-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
