import React from 'react'
import {
    BookOpen,
    Clock,
    Trophy,
    Target,
    Code,
    Play,
    Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/features/user-authentication-management'
import { Button } from '@/presentation/components/common'
import { educationApiService } from '@/infrastructure/services/api/EducationApiService'

/**
 * StudentDashboard - لوحة تحكم الطالب (Gold Standard)
 */
export const StudentDashboard: React.FC = () => {
    const { t } = useTranslation()
    const { user } = useAuth()
    const firstName = (user as any)?.firstName || (user as any)?.name?.split(' ')[0] || t('app_name')

    // Mock Data for Vitality
    const stats = [
        { icon: BookOpen, label: t('dashboard.stats.completed_lessons'), value: '12', trend: t('dashboard.stats.trend_week'), trendDir: 'up' },
        { icon: Clock, label: t('dashboard.stats.learning_hours'), value: '24.5', trend: t('dashboard.stats.active'), trendDir: 'neutral' },
        { icon: Trophy, label: t('dashboard.stats.points'), value: '850', trend: t('dashboard.stats.top_10'), trendDir: 'up' },
        { icon: Target, label: t('dashboard.stats.level'), value: t('dashboard.stats.near_avg'), trend: t('dashboard.stats.near_avg'), trendDir: 'up' }, // Mock value adjusted
    ]

    const quickActions = [
        {
            icon: Play,
            title: t('dashboard.actions.start_lesson'),
            desc: t('dashboard.actions.start_lesson_desc'),
            action: async () => {
                try {
                    console.log('Initiating Lesson Generation...');
                    const result = await educationApiService.generateLesson("Introduction to AI");
                    console.log('Lesson Generation Success:', result);
                } catch (error) {
                    console.error('Lesson Generation Failed:', error);
                }
            }
        },
        {
            icon: Code,
            title: t('dashboard.actions.gen_code'),
            desc: t('dashboard.actions.gen_code_desc'),
            action: () => console.log('Generate Code')
        },
        {
            icon: Zap,
            title: t('dashboard.actions.daily_challenge'),
            desc: t('dashboard.actions.daily_challenge_desc'),
            action: () => console.log('Daily Challenge')
        },
    ]

    const activeCourse = {
        title: t('dashboard.course.current'), // Placeholder title replacement
        progress: 65,
        lastLesson: 'Neural Networks 101', // Content can remain hardcoded or dynamic
        image: 'https://placehold.co/600x400/2637050/ffffff?text=AI+Course'
    }

    return (
        <div className="dashboard-page fade-in">
            {/* 1. Welcome Section */}
            <section className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {t('dashboard.welcome_back', { name: firstName })}
                </h1>
                <p className="text-muted-foreground text-lg">
                    {t('dashboard.ready_message')}
                </p>
            </section>

            {/* 2. Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="stat-card__header">
                            <div className="stat-card__icon">
                                <stat.icon size={20} />
                            </div>
                            <span className="stat-card__title">{stat.label}</span>
                        </div>
                        <div className="stat-card__value">{stat.value}</div>
                        <div className={`stat-card__trend stat-card__trend--${stat.trendDir}`}>
                            {stat.trend}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 3. Main Content Area */}
            <div className="dashboard-grid">

                {/* Right Column: Actions & Active Course */}
                <div className="col-span-12 lg:col-span-8 space-y-8">

                    {/* Active Course Card (Enhanced) */}
                    <motion.div
                        className="glass-card p-6 border border-primary/20 relative overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{t('dashboard.course.current')}</span>
                                    <span className="text-muted-foreground text-xs">{t('dashboard.course.last_activity')}</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-2">{activeCourse.title}</h2>
                                <p className="text-muted-foreground mb-4">{t('dashboard.course.continue')}: {activeCourse.lastLesson}</p>

                                {/* Progress Bar */}
                                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-primary progress-gradient"
                                        style={{ width: `${activeCourse.progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground mb-6">
                                    <span>{t('dashboard.course.general_progress')}</span>
                                    <span>{activeCourse.progress}%</span>
                                </div>

                                <Button variant="primary" className="btn-gradient w-full md:w-auto gap-2">
                                    <Play size={18} />
                                    {t('dashboard.course.continue')}
                                </Button>
                            </div>

                            {/* Abstract Decoration */}
                            <div className="hidden md:flex items-center justify-center w-32 h-32 rounded-full bg-primary/5 border-4 border-primary/10">
                                <span className="text-3xl font-bold text-primary">{activeCourse.progress}%</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions Grid */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">{t('dashboard.actions.title')}</h3>
                        <div className="quick-actions-grid">
                            {quickActions.map((action, index) => (
                                <motion.div
                                    key={index}
                                    className="action-card"
                                    onClick={action.action}
                                    whileHover={{ y: -5 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.1) }}
                                >
                                    <div className="action-card__icon">
                                        <action.icon />
                                    </div>
                                    <h4 className="action-card__title">{action.title}</h4>
                                    <p className="action-card__desc">{action.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Left Column: Sidebar / Notifications (Future Expansion) */}
                <div className="col-span-12 lg:col-span-4">
                    {/* Placeholder for Schedule or Notifications */}
                    <div className="glass-card p-6 h-full min-h-[400px]">
                        <h3 className="text-xl font-bold mb-4">{t('dashboard.activity.title')}</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex gap-4 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                                    <div>
                                        <p className="text-sm font-medium">{t('dashboard.activity.completed_lesson')} "Python Variables"</p>
                                        <span className="text-xs text-muted-foreground">Yesterday, 10:30 AM</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
