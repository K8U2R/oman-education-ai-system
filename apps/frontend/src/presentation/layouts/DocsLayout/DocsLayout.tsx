import React from 'react';
import { Outlet } from 'react-router-dom';

import '@/styles/layouts/_docs-layout.scss';

const DocsLayout: React.FC = () => {
    return (
        <div className="docs-layout">
            {/* Re-use Main Header or create DocsHeader? Using Main for consistency now */}
            {/* Note: Docs usually has a simplified header or specific search. 
          For now, we might rely on the global header but we need to ensure it works within this layout context 
          or if we wrap this in AppShell. 
          
          WAIT: AppShell already provides Header/Sidebar. 
          Role Analysis: Docs might replace the App Shell sidebar with its own.
          So DocsLayout should likely replace AppShell's sidebar logic OR be a route inside AppShell that hides the main sidebar.
      */}

            <aside className="docs-layout__sidebar">
                <div className="p-4">
                    <h2 className="text-lg font-bold mb-4">التوثيق</h2>
                    <nav>
                        {/* TODO: Sidebar Navigation Component */}
                        <ul className="space-y-2">
                            <li className="text-primary font-medium">مقدمة</li>
                            <li className="text-muted-foreground hover:text-foreground cursor-pointer">البداية السريعة</li>
                            <li className="text-muted-foreground hover:text-foreground cursor-pointer">المفاهيم الأساسية</li>
                        </ul>
                    </nav>
                </div>
            </aside>

            <main className="docs-layout__main">
                <Outlet />
            </main>

            <aside className="docs-layout__toc">
                <h3 className="text-sm font-semibold mb-2">في هذه الصفحة</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>المقدمة</li>
                    <li>المتطلبات</li>
                </ul>
            </aside>
        </div>
    );
};

export default DocsLayout;
