import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Table, Presentation, Mail, Users, StickyNote, BookOpen, Database } from 'lucide-react';
import Card from '@/components/ui/Card';
import OfficeChat from './components/OfficeChat';
import OfficeFileAnalyzer from './components/OfficeFileAnalyzer';
import OfficeAnalytics from './components/OfficeAnalytics';
import WordAssistant from './assistants/WordAssistant';
import ExcelAssistant from './assistants/ExcelAssistant';
import PowerPointAssistant from './assistants/PowerPointAssistant';
import OutlookAssistant from './assistants/OutlookAssistant';
import TeamsAssistant from './assistants/TeamsAssistant';
import OneNoteAssistant from './assistants/OneNoteAssistant';
import PublisherAssistant from './assistants/PublisherAssistant';
import AccessAssistant from './assistants/AccessAssistant';

export type OfficeAppType = 
  | 'word' 
  | 'excel' 
  | 'powerpoint' 
  | 'outlook' 
  | 'teams' 
  | 'onenote' 
  | 'publisher' 
  | 'access';

interface OfficeApp {
  id: OfficeAppType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

const OFFICE_APPS: OfficeApp[] = [
  {
    id: 'word',
    name: 'Microsoft Word',
    icon: FileText,
    description: 'إنشاء وتحرير المستندات النصية',
    color: 'text-blue-500',
  },
  {
    id: 'excel',
    name: 'Microsoft Excel',
    icon: Table,
    description: 'إنشاء وتحليل الجداول والبيانات',
    color: 'text-green-500',
  },
  {
    id: 'powerpoint',
    name: 'Microsoft PowerPoint',
    icon: Presentation,
    description: 'إنشاء العروض التقديمية',
    color: 'text-orange-500',
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    icon: Mail,
    description: 'إدارة البريد الإلكتروني والتقويم',
    color: 'text-blue-400',
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    icon: Users,
    description: 'التعاون والاجتماعات',
    color: 'text-purple-500',
  },
  {
    id: 'onenote',
    name: 'Microsoft OneNote',
    icon: StickyNote,
    description: 'تدوين الملاحظات والتنظيم',
    color: 'text-yellow-500',
  },
  {
    id: 'publisher',
    name: 'Microsoft Publisher',
    icon: BookOpen,
    description: 'إنشاء المنشورات والتصاميم',
    color: 'text-pink-500',
  },
  {
    id: 'access',
    name: 'Microsoft Access',
    icon: Database,
    description: 'إدارة قواعد البيانات',
    color: 'text-indigo-500',
  },
];

const OfficeAssistantPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedApp, setSelectedApp] = useState<OfficeAppType | null>(null);

  // التحقق من query parameter للانتقال المباشر
  useEffect(() => {
    const appParam = searchParams.get('app') as OfficeAppType | null;
    if (appParam && OFFICE_APPS.find(app => app.id === appParam)) {
      setSelectedApp(appParam);
    }
  }, [searchParams]);
  const [activeTab, setActiveTab] = useState<'chat' | 'analyzer' | 'analytics'>('chat');

  const renderAssistant = () => {
    if (!selectedApp) return null;

    switch (selectedApp) {
      case 'word':
        return <WordAssistant />;
      case 'excel':
        return <ExcelAssistant />;
      case 'powerpoint':
        return <PowerPointAssistant />;
      case 'outlook':
        return <OutlookAssistant />;
      case 'teams':
        return <TeamsAssistant />;
      case 'onenote':
        return <OneNoteAssistant />;
      case 'publisher':
        return <PublisherAssistant />;
      case 'access':
        return <AccessAssistant />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ide-bg w-full overflow-y-auto">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">مساعد Microsoft Office</h1>
          <p className="text-ide-text-secondary">
            إنشاء وتحرير وتحليل ملفات Office باستخدام الذكاء الاصطناعي
          </p>
        </div>

        {/* Office Apps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {OFFICE_APPS.map((app) => {
            const Icon = app.icon;
            const isSelected = selectedApp === app.id;
            return (
              <Card
                key={app.id}
                className={`cursor-pointer transition-all hover:border-ide-accent ${
                  isSelected ? 'border-ide-accent bg-ide-accent/5' : ''
                }`}
                onClick={() => setSelectedApp(app.id)}
              >
                <div className="flex flex-col items-center text-center p-4">
                  <Icon className={`w-12 h-12 mb-3 ${app.color}`} />
                  <h3 className="font-semibold mb-1">{app.name}</h3>
                  <p className="text-xs text-ide-text-secondary">{app.description}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        {selectedApp ? (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-ide-border">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'chat'
                    ? 'border-b-2 border-ide-accent text-ide-accent'
                    : 'text-ide-text-secondary hover:text-ide-text'
                }`}
              >
                محادثة AI
              </button>
              <button
                onClick={() => setActiveTab('analyzer')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'analyzer'
                    ? 'border-b-2 border-ide-accent text-ide-accent'
                    : 'text-ide-text-secondary hover:text-ide-text'
                }`}
              >
                تحليل الملفات
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-ide-accent text-ide-accent'
                    : 'text-ide-text-secondary hover:text-ide-text'
                }`}
              >
                التحليلات
              </button>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'chat' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    {renderAssistant()}
                  </div>
                  <div>
                    <OfficeChat appType={selectedApp} />
                  </div>
                </div>
              )}
              {activeTab === 'analyzer' && (
                <OfficeFileAnalyzer appType={selectedApp} />
              )}
              {activeTab === 'analytics' && (
                <OfficeAnalytics appType={selectedApp} />
              )}
            </div>
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-ide-text-secondary text-lg">
              اختر تطبيق Office لبدء العمل
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OfficeAssistantPage;

