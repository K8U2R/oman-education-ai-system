import React, { useState } from 'react';
import { Book, ChevronRight, Search, X } from 'lucide-react';
import '../ai-assistant/styles/chat-theme.css';

interface DocsSection {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children?: DocsSection[];
}

const docsStructure: DocsSection[] = [
  {
    id: 'getting-started',
    title: 'بدء الاستخدام',
    children: [
      { id: 'introduction', title: 'مقدمة إلى FlowForge IDE' },
      { id: 'quickstart', title: 'دليل البدء السريع' },
      { id: 'video-tutorials', title: 'دروس الفيديو' },
    ],
  },
  {
    id: 'working',
    title: 'العمل في FlowForge',
    children: [
      { id: 'agents-models', title: 'العوامل والنماذج' },
      { id: 'backups-restore', title: 'النسخ الاحتياطي والاستعادة' },
      { id: 'chatbox', title: 'استخدام صندوق المحادثة' },
      { id: 'code-view', title: 'استخدام عرض الكود' },
      { id: 'managing-projects', title: 'إدارة المشاريع' },
      { id: 'personal-settings', title: 'الإعدادات الشخصية' },
      { id: 'project-settings', title: 'إعدادات المشروع' },
      { id: 'technologies', title: 'التقنيات المدعومة' },
    ],
  },
  {
    id: 'flowforge-cloud',
    title: 'FlowForge Cloud',
    children: [
      { id: 'what-is-cloud', title: 'ما هو FlowForge Cloud؟' },
      { id: 'database', title: 'قاعدة البيانات' },
      { id: 'domains', title: 'النطاقات' },
      { id: 'hosting', title: 'الاستضافة' },
    ],
  },
  {
    id: 'best-practices',
    title: 'أفضل الممارسات',
    children: [
      { id: 'plan-app', title: 'تخطيط التطبيق' },
      { id: 'plan-discussion-modes', title: 'وضعي التخطيط والمناقشة' },
      { id: 'token-efficiency', title: 'تعظيم كفاءة الرموز' },
      { id: 'prompt-effectively', title: 'الكتابة الفعالة للطلبات' },
    ],
  },
  {
    id: 'integrations',
    title: 'التكاملات',
    children: [
      { id: 'expo', title: 'Expo للتطبيقات المحمولة' },
      { id: 'figma', title: 'Figma للتصميم' },
      { id: 'github', title: 'GitHub للتحكم بالإصدارات' },
      { id: 'google-sso', title: 'Google SSO للمصادقة' },
      { id: 'netlify', title: 'Netlify للاستضافة' },
      { id: 'stripe', title: 'Stripe للمدفوعات' },
      { id: 'supabase', title: 'Supabase لقواعد البيانات' },
    ],
  },
  {
    id: 'accounts',
    title: 'الحسابات والاشتراكات',
    children: [
      { id: 'accounts-overview', title: 'نظرة عامة على الحسابات' },
      { id: 'billing', title: 'الفواتير' },
      { id: 'corporate-commercial', title: 'الشركات والتجارية' },
      { id: 'tokens', title: 'الرموز' },
      { id: 'referral', title: 'برنامج الإحالة' },
    ],
  },
  {
    id: 'teams',
    title: 'الفِرق',
    children: [
      { id: 'teams-overview', title: 'نظرة عامة' },
      { id: 'teams-plans-billing', title: 'الخطط والفواتير' },
      { id: 'managing-teams', title: 'إدارة الفِرق' },
      { id: 'project-controls', title: 'تحكم المشاريع' },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'استكشاف الأخطاء',
    children: [
      { id: 'login-issues', title: 'مشاكل تسجيل الدخول' },
      { id: 'integration-issues', title: 'مشاكل التكامل' },
      { id: 'flowforge-issues', title: 'مشاكل FlowForge' },
    ],
  },
  {
    id: 'concepts',
    title: 'المفاهيم والسياق',
    children: [
      { id: 'databases-intro', title: 'مقدمة في قواعد البيانات' },
      { id: 'llms-intro', title: 'مقدمة في LLMs' },
      { id: 'version-control', title: 'سجل الإصدارات والتحكم' },
    ],
  },
];

interface DocsLayoutProps {
  children: React.ReactNode;
}

const DocsLayout: React.FC<DocsLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['getting-started', 'working'])
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const renderSection = (section: DocsSection, level: number = 0) => {
    const isExpanded = expandedSections.has(section.id);
    const hasChildren = section.children && section.children.length > 0;

    return (
      <div key={section.id}>
        <div
          className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-ide-border cursor-pointer text-xs sm:text-sm transition-colors rounded-md ${
            level > 0 ? 'text-ide-text-secondary chat-text-secondary' : 'font-semibold text-ide-text chat-text-primary'
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleSection(section.id);
            }
          }}
        >
          {hasChildren && (
            <ChevronRight
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          )}
          {!hasChildren && <div className="w-3.5 sm:w-4" />}
          <span className="truncate">{section.title}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {section.children!.map((child) => renderSection(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-ide-bg chat-container">
      {/* Header */}
      <div className="h-12 sm:h-14 flex items-center justify-between px-3 sm:px-4 border-b border-ide-border bg-ide-surface chat-surface">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 sm:p-2 rounded hover:bg-ide-border transition-colors"
            aria-label="تبديل الشريط الجانبي"
          >
            <Book className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-semibold chat-text-primary">التوثيق</h1>
        </div>
        <div className="flex-1 max-w-md mx-4 sm:mx-6 md:mx-8">
          <div className="relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-ide-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في التوثيق..."
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 rounded-md bg-ide-bg border border-ide-border text-ide-text text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ide-accent chat-text-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-ide-border"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-56 sm:w-64 md:w-72 bg-ide-surface border-r border-ide-border overflow-y-auto flex-shrink-0 chat-surface chat-scrollbar">
            <div className="p-3 sm:p-4">
              {docsStructure.map((section) => renderSection(section))}
            </div>
          </aside>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto chat-scrollbar">
          <div className="w-full max-w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 prose prose-invert">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocsLayout;

