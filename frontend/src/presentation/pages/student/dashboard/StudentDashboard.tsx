import React from 'react'
import {
    BookOpen,
    Clock,
    Trophy,
    Target,
    Code,
    Play,
    Zap,
    ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/features/user-authentication-management'
import { Button } from '@/presentation/components/common'
import { educationApiService } from '@/infrastructure/services/api/EducationApiService'

/**
 * StudentDashboard - لوحة تحكم الطالب (Gold Standard)
 */
export const StudentDashboard: React.FC = () => {
    const { user } = useAuth()

    // Mock Data for Vitality
    const stats = [
        { icon: BookOpen, label: 'الدروس المكتملة', value: '12', trend: '+2 هذا الأسبوع', trendDir: 'up' },
        { icon: Clock, label: 'ساعات التعلم', value: '24.5', trend: 'نشط جداً', trendDir: 'neutral' },
        { icon: Trophy, label: 'النقاط', value: '850', trend: 'أفضل 10%', trendDir: 'up' },
        { icon: Target, label: 'المستوى الحالي', value: 'مبتدئ', trend: 'اقتربت من المتوسط', trendDir: 'up' },
    ]

    const quickActions = [
        {
            icon: Play,
            title: 'بدء درس جديد',
            desc: 'أكمل رحلتك التعليمية من حيث توقفت',
            action: async () => {
                try {
                    console.log('Initiating Lesson Generation...');
                    const result = await educationApiService.generateLesson("Introduction to AI");
                    console.log('Lesson Generation Success:', result);
                    // In a real app, we would navigate to the lesson page here
                    // navigate(/lesson/${result.data.id})
                } catch (error) {
                    console.error('Lesson Generation Failed:', error);
                }
            }
        },
        {
            icon: Code,
            title: 'توليد كود',
            desc: 'استخدم المساعد الذكي لكتابة الكود',
            action: () => console.log('Generate Code')
        },
        {
            icon: Zap,
            title: 'تحدي يومي',
            desc: 'اختبر مهاراتك في تحدي سريع',
            action: () => console.log('Daily Challenge')
        },
    ]

    const activeCourse = {
        title: 'مقدمة في الذكاء الاصطناعي',
        progress: 65,
        lastLesson: 'الشبكات العصبية ببساطة',
        image: 'https://placehold.co/600x400/2637050/ffffff?text=AI+Course' // Placeholder
    }

    return (
        <div className="dashboard-page fade-in">
            {/* 1. Welcome Section */}
            <section className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    مرحباً بك، <span className="gradient-text">{user?.firstName || 'طالبنا المتميز'}</span> 👋
                </h1>
                <p className="text-muted-foreground text-lg">
                    جاهز لمواصلة رحلة التعلم اليوم؟
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
                                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">دورة حالية</span>
                                    <span className="text-muted-foreground text-xs">آخر نشاط: قبل ساعتين</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-2">{activeCourse.title}</h2>
                                <p className="text-muted-foreground mb-4">الدرس الحالي: {activeCourse.lastLesson}</p>

                                {/* Progress Bar */}
                                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-primary progress-gradient"
                                        style={{ width: `${activeCourse.progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground mb-6">
                                    <span>التقدم العام</span>
                                    <span>{activeCourse.progress}%</span>
                                </div>

                                <Button variant="primary" className="btn-gradient w-full md:w-auto gap-2">
                                    <Play size={18} />
                                    متابعة الدرس
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
                        <h3 className="text-xl font-bold mb-4">إجراءات سريعة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        <h3 className="text-xl font-bold mb-4">النشاط الأخير</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex gap-4 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                                    <div>
                                        <p className="text-sm font-medium">أكملت درس "المتغيرات في بايثون"</p>
                                        <span className="text-xs text-muted-foreground">أمس، 10:30 ص</span>
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
