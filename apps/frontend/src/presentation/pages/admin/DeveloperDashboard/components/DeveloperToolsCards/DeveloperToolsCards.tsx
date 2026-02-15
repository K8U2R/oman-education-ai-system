import React from 'react'
import { FileCode, Database, Terminal, TestTube, Bug, Server } from 'lucide-react'
import { Card, Button } from '@/presentation/components/common'

export const DeveloperToolsCards: React.FC = () => {
    return (
        <section className="developer-dashboard-page__section">
            <h2 className="developer-dashboard-page__section-title">أدوات المطور</h2>
            <div className="developer-dashboard-page__tools">
                <Card
                    className="developer-dashboard-page__tool-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => window.open(`${window.location.origin}/api/v1/docs`, '_blank')}
                >
                    <FileCode size={36} className="developer-dashboard-page__tool-icon" />
                    <h3 className="developer-dashboard-page__tool-title">وثائق API</h3>
                    <p className="developer-dashboard-page__tool-description">
                        عرض وتجربة واجهات برمجة التطبيقات (Swagger/Redoc)
                    </p>
                </Card>
                {/* Placeholder cards for other tools */}
                <Card className="developer-dashboard-page__tool-card">
                    <Database size={36} className="developer-dashboard-page__tool-icon" />
                    <h3 className="developer-dashboard-page__tool-title">إدارة قاعدة البيانات</h3>
                </Card>
                <Card className="developer-dashboard-page__tool-card">
                    <Terminal size={36} className="developer-dashboard-page__tool-icon" />
                    <h3 className="developer-dashboard-page__tool-title">عارض السجلات</h3>
                </Card>
            </div>
        </section>
    )
}

export const DeveloperQuickActions: React.FC = () => {
    return (
        <section className="developer-dashboard-page__section">
            <h2 className="developer-dashboard-page__section-title">إجراءات سريعة</h2>
            <div className="developer-dashboard-page__quick-actions">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => window.open(`${window.location.origin}/api/v1/docs`, '_blank')}
                >
                    <FileCode size={20} className="mr-2" />
                    فتح وثائق API
                </Button>
            </div>
        </section>
    )
}
