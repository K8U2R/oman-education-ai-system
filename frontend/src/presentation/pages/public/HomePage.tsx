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
      icon: <Code className="w-8 h-8" />,
      title: 'توليد الكود',
      description: 'استخدم الذكاء الاصطناعي لتوليد كود احترافي بسرعة',
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'مساعد التعلم',
      description: 'احصل على مساعدة ذكية في فهم المفاهيم البرمجية',
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'بناء المشاريع',
      description: 'أنشئ مشاريع كاملة من الصفر باستخدام AI',
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'تصميم الويب',
      description: ' صمم واجهات ويب احترافية بمساعدة الذكاء الاصطناعي',
    },
  ]

  const whyUsReasons = [
    {
      icon: <Shield className="home-page__why-us-icon" />,
      title: 'آمن وموثوق',
      description: 'نستخدم أحدث تقنيات الأمان مع Supabase Authentication',
    },
    {
      icon: <Zap className="home-page__why-us-icon" />,
      title: 'سريع وفعال',
      description: 'أداء عالي وتجربة مستخدم سلسة وسريعة',
    },
    {
      icon: <Sparkles className="home-page__why-us-icon" />,
      title: 'ذكاء اصطناعي متقدم',
      description: 'أحدث تقنيات AI لتحسين تجربة التعلم',
    },
  ]

  // Authenticated user view
  if (!isLoading && isAuthenticated && user) {
    return (
      <div className="home-page">
        {/* Hero Section للمستخدمين المسجلين */}
        <motion.section
          ref={heroRef}
          className="home-page__hero home-page__hero--authenticated"
          initial="hidden"
          animate={heroInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <div className="home-page__hero-content">
            <motion.h1 className="home-page__hero-title" variants={fadeInUp}>
              مرحباً بك، {user.fullName}
              <br />
              <span style={{ color: 'var(--color-primary-200, #bfdbfe)' }}>
                في نظام التعليم الذكي
              </span>
            </motion.h1>
            <motion.p className="home-page__hero-description" variants={fadeInUp}>
              ابدأ رحلتك التعليمية واستكشف جميع الميزات المتاحة لك
              <br />
              يمكنك الوصول إلى الدروس، المشاريع، التقييمات، والمزيد...
            </motion.p>
            <motion.div className="home-page__hero-actions" variants={fadeInUp}>
              <motion.div whileHover="hover" whileTap={{ scale: 0.95 }} variants={scaleOnHover}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="home-page__hero-button home-page__hero-button--primary"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                >
                  <LayoutDashboard className="home-page__hero-button-icon" />
                  الانتقال إلى لوحة التحكم
                  <ArrowRight className="home-page__hero-button-icon" />
                </Button>
              </motion.div>
              <Link to={ROUTES.LESSONS}>
                <motion.div whileHover="hover" whileTap={{ scale: 0.95 }} variants={scaleOnHover}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="home-page__hero-button home-page__hero-button--outline"
                  >
                    <BookOpen className="home-page__hero-button-icon" />
                    استكشف الدروس
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Quick Access Section */}
        <section className="home-page__quick-access">
          <div className="home-page__quick-access-container">
            <motion.h2
              className="home-page__quick-access-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              الوصول السريع
            </motion.h2>
            <motion.div
              className="home-page__quick-access-grid"
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
                    className="home-page__quick-access-card"
                    hoverable
                    onClick={() => navigate(item.route)}
                  >
                    <item.icon className="home-page__quick-access-icon" />
                    <h3 className="home-page__quick-access-card-title">{item.title}</h3>
                    <p className="home-page__quick-access-card-description">{item.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <motion.section
          ref={featuresRef}
          className="home-page__features"
          initial="hidden"
          animate={featuresInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <div className="home-page__features-container">
            <motion.div className="home-page__features-header" variants={fadeInUp}>
              <h2 className="home-page__features-title">الميزات الرئيسية</h2>
              <p className="home-page__features-subtitle">
                اكتشف القوة الكاملة للذكاء الاصطناعي في التعليم
              </p>
            </motion.div>

            <motion.div className="home-page__features-grid" variants={staggerContainer}>
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="home-page__feature-card" hoverable>
                    <div className="home-page__feature-icon">{feature.icon}</div>
                    <h3 className="home-page__feature-title">{feature.title}</h3>
                    <p className="home-page__feature-description">{feature.description}</p>
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
    <div className="home-page">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="home-page__hero"
        initial="hidden"
        animate={heroInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className="home-page__hero-content">
          <motion.h1 className="home-page__hero-title" variants={fadeInUp}>
            نظام التعليم الذكي
            <br />
            <span>Oman Education AI System</span>
          </motion.h1>
          <motion.p className="home-page__hero-description" variants={fadeInUp}>
            نظام تعليمي متكامل يعتمد على الذكاء الاصطناعي لتطوير المهارات التقنية
            <br />
            يدعم توليد الكود، مساعدة التعلم، بناء المشاريع، تصميم الويب، وأكثر...
          </motion.p>
          <motion.div className="home-page__hero-actions" variants={fadeInUp}>
            <motion.div
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              variants={scaleOnHover}
              onClick={() => useModalStore.getState().open('register')}
            >
              <Button
                variant="secondary"
                size="lg"
                className="home-page__hero-button home-page__hero-button--primary"
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
                className="home-page__hero-button home-page__hero-button--outline"
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
        className="home-page__features"
        initial="hidden"
        animate={featuresInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className="home-page__features-container">
          <motion.div className="home-page__features-header" variants={fadeInUp}>
            <h2 className="home-page__features-title">الميزات الرئيسية</h2>
            <p className="home-page__features-subtitle">
              اكتشف القوة الكاملة للذكاء الاصطناعي في التعليم
            </p>
          </motion.div>

          <motion.div className="home-page__features-grid" variants={staggerContainer}>
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="home-page__feature-card" hoverable>
                  <div className="home-page__feature-icon">{feature.icon}</div>
                  <h3 className="home-page__feature-title">{feature.title}</h3>
                  <p className="home-page__feature-description">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        ref={whyUsRef}
        className="home-page__why-us"
        initial="hidden"
        animate={whyUsInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className="home-page__why-us-container">
          <motion.h2 className="home-page__why-us-title" variants={fadeInUp}>
            لماذا نحن؟
          </motion.h2>

          <motion.div className="home-page__why-us-grid" variants={staggerContainer}>
            {whyUsReasons.map((reason, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="home-page__why-us-card" hoverable>
                  {reason.icon}
                  <h3 className="home-page__why-us-card-title">{reason.title}</h3>
                  <p className="home-page__why-us-card-description">{reason.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        ref={ctaRef}
        className="home-page__cta"
        initial="hidden"
        animate={ctaInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className="home-page__cta-container">
          <motion.h2 className="home-page__cta-title" variants={fadeInUp}>
            ابدأ رحلتك التعليمية اليوم
          </motion.h2>
          <motion.p className="home-page__cta-description" variants={fadeInUp}>
            انضم إلى آلاف الطلاب والمطورين الذين يستخدمون نظامنا
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={fadeInUp}
            onClick={() => useModalStore.getState().open('register')}
          >
            <Button variant="secondary" size="lg" className="home-page__cta-button">
              إنشاء حساب مجاني
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default HomePage
