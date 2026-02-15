import React from 'react'
import { GitBranch, TestTube, Package, FileCode, Server } from 'lucide-react'
import { Card } from '@/presentation/components/common'
import { DeveloperStats } from '@/domain/types/developer.types'

interface DeveloperStatsCardsProps {
    stats: DeveloperStats | null
}

const DeveloperStatsCards: React.FC<DeveloperStatsCardsProps> = ({ stats }) => {
    if (!stats) return null

    return (
        <section className="developer-dashboard-page__stats">
            <Card className="developer-dashboard-page__stat-card">
                <div className="developer-dashboard-page__stat-icon developer-dashboard-page__stat-icon--commits">
                    <GitBranch size={32} />
                </div>
                <div className="developer-dashboard-page__stat-content">
                    <h3 className="developer-dashboard-page__stat-label">إجمالي الـ Commits</h3>
                    <p className="developer-dashboard-page__stat-value">
                        {stats.total_commits.toLocaleString('ar-EG')}
                    </p>
                </div>
            </Card>

            <Card className="developer-dashboard-page__stat-card">
                <div className="developer-dashboard-page__stat-icon developer-dashboard-page__stat-icon--branches">
                    <GitBranch size={32} />
                </div>
                <div className="developer-dashboard-page__stat-content">
                    <h3 className="developer-dashboard-page__stat-label">الفروع النشطة</h3>
                    <p className="developer-dashboard-page__stat-value">
                        {stats.active_branches.toLocaleString('ar-EG')}
                    </p>
                </div>
            </Card>

            <Card className="developer-dashboard-page__stat-card">
                <div className="developer-dashboard-page__stat-icon developer-dashboard-page__stat-icon--coverage">
                    <TestTube size={32} />
                </div>
                <div className="developer-dashboard-page__stat-content">
                    <h3 className="developer-dashboard-page__stat-label">تغطية الاختبارات</h3>
                    <p className="developer-dashboard-page__stat-value">{stats.test_coverage}%</p>
                </div>
            </Card>

            <Card className="developer-dashboard-page__stat-card">
                <div
                    className={`developer-dashboard-page__stat-icon developer-dashboard-page__stat-icon--build ${stats.build_status === 'success' ? 'success' : 'failed'}`}
                >
                    <Package size={32} />
                </div>
                <div className="developer-dashboard-page__stat-content">
                    <h3 className="developer-dashboard-page__stat-label">حالة البناء</h3>
                    <p className="developer-dashboard-page__stat-value">
                        {stats.build_status === 'success'
                            ? 'نجح ✅'
                            : stats.build_status === 'failed'
                                ? 'فشل ❌'
                                : 'قيد الانتظار...'}
                    </p>
                </div>
            </Card>

            <Card className="developer-dashboard-page__stat-card">
                <div className="developer-dashboard-page__stat-icon developer-dashboard-page__stat-icon--endpoints">
                    <FileCode size={32} />
                </div>
                <div className="developer-dashboard-page__stat-content">
                    <h3 className="developer-dashboard-page__stat-label">API Endpoints</h3>
                    <p className="developer-dashboard-page__stat-value">
                        {stats.api_endpoints_count.toLocaleString('ar-EG')}
                    </p>
                </div>
            </Card>

            <Card className="developer-dashboard-page__stat-card">
                <div className="developer-dashboard-page__stat-icon developer-dashboard-page__stat-icon--services">
                    <Server size={32} />
                </div>
                <div className="developer-dashboard-page__stat-content">
                    <h3 className="developer-dashboard-page__stat-label">Services</h3>
                    <p className="developer-dashboard-page__stat-value">
                        {stats.services_count.toLocaleString('ar-EG')}
                    </p>
                </div>
            </Card>
        </section>
    )
}

export default DeveloperStatsCards
