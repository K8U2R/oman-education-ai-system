import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Sparkles,
  Code,
  BookOpen,
  Rocket,
  Shield,
  Zap,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react'
import { Button, Card } from '../../components/common'
import { useAuth } from '@/features/user-authentication-management'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useModalStore } from '@/stores/useModalStore'


// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleOnHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
}

const HomePage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const navigate = useNavigate()

  // Intersection observers for scroll animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [whyUsRef, whyUsInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const features = [
    {
      icon: <Code className="w-8 h-8 text-primary-500" />,
      title: 'توليد الكود',
      description: 'استخدم الذكاء الاصطناعي لتوليد كود احترافي بسرعة',
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary-500" />,
      title: 'مساعد التعلم',
      description: 'احصل على مساعدة ذكية في فهم المفاهيم البرمجية',
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary-500" />,
      title: 'بناء المشاريع',
      description: 'أنشئ مشاريع كاملة من الصفر باستخدام AI',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-primary-500" />,
      title: 'تصميم الويب',
      description: ' صمم واجهات ويب احترافية بمساعدة الذكاء الاصطناعي',
    },
  ]

  const whyUsReasons = [
    {
      icon: <Shield className="w-12 h-12 text-secondary-500 mb-4" />,
      title: 'آمن وموثوق',
      description: 'نستخدم أحدث تقنيات الأمان مع Supabase Authentication',
    },
    {
      icon: <Zap className="w-12 h-12 text-secondary-500 mb-4" />,
      title: 'سريع وفعال',
      description: 'أداء عالي وتجربة مستخدم سلسة وسريعة',
    },
    {
      icon: <Sparkles className="w-12 h-12 text-secondary-500 mb-4" />,
      title: 'ذكاء اصطناعي متقدم',
      description: 'أحدث تقنيات AI لتحسين تجربة التعلم',
    },
  ]

  // Authenticated user view
  if (!isLoading && isAuthenticated && user) {
    return (
      <div className="flex-grow bg-bg-app text-text-primary">
        {/* Hero Section للمستخدمين المسجلين */}
        <motion.section
          ref={heroRef}
          className="relative py-20 px-6 overflow-hidden md:py-32"
          initial="hidden"
          animate={heroInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {/* Background Gradient Blob */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-3xl -z-10" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.h1 className="text-4xl md:text-6xl font-bold mb-6 text-text-primary" variants={fadeInUp}>
              مرحباً بك، {user.fullName}
              <br />
              <span className="text-primary-600">
                في نظام التعليم الذكي
              </span>
            </motion.h1>
            <motion.p className="text-xl md:text-2xl text-text-secondary mb-10 max-w-3xl mx-auto" variants={fadeInUp}>
              ابدأ رحلتك التعليمية واستكشف جميع الميزات المتاحة لك
              <br />
              يمكنك الوصول إلى الدروس، المشاريع، التقييمات، والمزيد...
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={fadeInUp}>
              <motion.div whileHover="hover" whileTap={{ scale: 0.95 }} variants={scaleOnHover}>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto gap-2"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  الانتقال إلى لوحة التحكم
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
              <Link to={ROUTES.LESSONS}>
                <motion.div whileHover="hover" whileTap={{ scale: 0.95 }} variants={scaleOnHover}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    استكشف الدروس
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Quick Access Section */}
        <section className="py-16 px-6 bg-bg-surface/50">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center mb-12 text-text-primary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              الوصول السريع
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                {
                  icon: LayoutDashboard,
                  title: 'لوحة التحكم',
                  desc: 'عرض إحصائياتك وتتبع تقدمك',
                  route: ROUTES.DASHBOARD,
                },
                {
                  icon: BookOpen,
                  title: 'الدروس',
                  desc: 'استكشف الدروس المتاحة',
                  route: ROUTES.LESSONS,
                },
                {
                  icon: Rocket,
                  title: 'المشاريع',
                  desc: 'أنشئ مشاريع جديدة',
                  route: ROUTES.PROJECTS,
                },
                { icon: Shield, title: 'الملف الشخصي', desc: 'إدارة حسابك', route: ROUTES.PROFILE },
              ].map((item, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card
                    className="h-full border-border-secondary hover:border-primary-500/50 transition-colors bg-bg-surface"
                    hoverable
                    onClick={() => navigate(item.route)}
                  >
                    <div className="p-6 flex flex-col items-center text-center">
                      <div className="p-4 bg-primary-100/10 rounded-full text-primary-600 mb-4">
                        <item.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-text-primary">{item.title}</h3>
                      <p className="text-text-secondary">{item.desc}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <motion.section
          ref={featuresRef}
          className="py-16 px-6"
          initial="hidden"
          animate={featuresInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-3xl font-bold mb-4 text-text-primary">الميزات الرئيسية</h2>
              <p className="text-xl text-text-secondary">
                اكتشف القوة الكاملة للذكاء الاصطناعي في التعليم
              </p>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" variants={staggerContainer}>
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full border-border-secondary hover:border-primary-500/50 transition-colors bg-bg-surface" hoverable>
                    <div className="p-6">
                      <div className="mb-4">{feature.icon}</div>
                      <h3 className="text-lg font-bold mb-2 text-text-primary">{feature.title}</h3>
                      <p className="text-text-secondary">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </div>
    )
  }

  // Public user view
  return (
    <div className="flex-grow bg-bg-app text-text-primary">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative py-20 px-6 overflow-hidden md:py-32"
        initial="hidden"
        animate={heroInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1 className="text-5xl md:text-7xl font-bold mb-8 text-text-primary tracking-tight" variants={fadeInUp}>
            نظام التعليم الذكي
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
              Oman Education AI System
            </span>
          </motion.h1>
          <motion.p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed" variants={fadeInUp}>
            نظام تعليمي متكامل يعتمد على الذكاء الاصطناعي لتطوير المهارات التقنية
            <br />
            يدعم توليد الكود، مساعدة التعلم، بناء المشاريع، تصميم الويب، وأكثر...
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={fadeInUp}>
            <motion.div
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              variants={scaleOnHover}
              onClick={() => useModalStore.getState().open('register')}
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg"
              >
                ابدأ الآن مجاناً
              </Button>
            </motion.div>
            <motion.div
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              variants={scaleOnHover}
              onClick={() => useModalStore.getState().open('login')}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg"
              >
                تسجيل الدخول
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        className="py-20 px-6 bg-bg-surface/50"
        initial="hidden"
        animate={featuresInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl font-bold mb-4 text-text-primary">الميزات الرئيسية</h2>
            <p className="text-xl text-text-secondary">
              اكتشف القوة الكاملة للذكاء الاصطناعي في التعليم
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" variants={staggerContainer}>
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-border-secondary hover:border-primary-500/50 transition-colors bg-bg-surface" hoverable>
                  <div className="p-6">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-bold mb-2 text-text-primary">{feature.title}</h3>
                    <p className="text-text-secondary">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        ref={whyUsRef}
        className="py-20 px-6"
        initial="hidden"
        animate={whyUsInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 className="text-3xl font-bold text-center mb-16 text-text-primary" variants={fadeInUp}>
            لماذا نحن؟
          </motion.h2>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={staggerContainer}>
            {whyUsReasons.map((reason, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full p-8 text-center border-border-secondary bg-bg-surface" hoverable>
                  <div className="flex justify-center">{reason.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-text-primary">{reason.title}</h3>
                  <p className="text-text-secondary">{reason.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        ref={ctaRef}
        className="py-24 px-6 bg-gradient-to-b from-bg-app to-primary-900/10"
        initial="hidden"
        animate={ctaInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 className="text-4xl font-bold mb-6 text-text-primary" variants={fadeInUp}>
            ابدأ رحلتك التعليمية اليوم
          </motion.h2>
          <motion.p className="text-xl text-text-secondary mb-10" variants={fadeInUp}>
            انضم إلى آلاف الطلاب والمطورين الذين يستخدمون نظامنا
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={fadeInUp}
            onClick={() => useModalStore.getState().open('register')}
          >
            <Button variant="primary" size="lg" className="px-10 py-6 text-lg shadow-xl shadow-primary-500/20">
              إنشاء حساب مجاني
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default HomePage
