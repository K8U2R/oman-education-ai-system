import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
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
import styles from './HomePage.module.scss'


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
  const { t } = useTranslation('common')
  const { isAuthenticated, user, isLoading } = useAuth()
  const navigate = useNavigate()

  // Intersection observers for scroll animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [whyUsRef, whyUsInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const features = [
    {
      icon: <Code className={styles.iconFeature} />,
      title: t('public.home.features.items.code_gen.title'),
      description: t('public.home.features.items.code_gen.desc'),
    },
    {
      icon: <BookOpen className={styles.iconFeature} />,
      title: t('public.home.features.items.learning_assistant.title'),
      description: t('public.home.features.items.learning_assistant.desc'),
    },
    {
      icon: <Rocket className={styles.iconFeature} />,
      title: t('public.home.features.items.project_builder.title'),
      description: t('public.home.features.items.project_builder.desc'),
    },
    {
      icon: <Sparkles className={styles.iconFeature} />,
      title: t('public.home.features.items.web_design.title'),
      description: t('public.home.features.items.web_design.desc'),
    },
  ]

  const whyUsReasons = [
    {
      icon: <Shield className={styles.iconWhyUs} />,
      title: t('public.home.why_us.items.secure.title'),
      description: t('public.home.why_us.items.secure.desc'),
    },
    {
      icon: <Zap className={styles.iconWhyUs} />,
      title: t('public.home.why_us.items.fast.title'),
      description: t('public.home.why_us.items.fast.desc'),
    },
    {
      icon: <Sparkles className={styles.iconWhyUs} />,
      title: t('public.home.why_us.items.ai.title'),
      description: t('public.home.why_us.items.ai.desc'),
    },
  ]

  // Authenticated user view
  if (!isLoading && isAuthenticated && user) {
    return (
      <div className={styles.page}>
        {/* Hero Section for Users */}
        <motion.section
          ref={heroRef}
          className={styles.hero}
          initial="hidden"
          animate={heroInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <div className={styles.heroBlob} />

          <div className={styles.heroContent}>
            <motion.h1 className={styles.heroTitle} variants={fadeInUp}>
              {t('public.home.hero.welcome_user', { name: user.fullName })}
              <br />
              <span className={styles.heroTitleHighlight}>
                {t('public.home.hero.welcome_title')}
              </span>
            </motion.h1>
            <motion.p className={styles.heroDescription} variants={fadeInUp}>
              {t('public.home.hero.description_user')}
            </motion.p>
            <motion.div className={styles.heroActions} variants={fadeInUp}>
              <motion.div whileHover="hover" whileTap={{ scale: 0.95 }} variants={scaleOnHover}>
                <Button
                  variant="primary"
                  size="lg"
                  className={styles.heroButton}
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                >
                  <LayoutDashboard className={styles.iconButton} />
                  {t('public.home.hero.actions.dashboard')}
                  <ArrowRight className={styles.iconButton} />
                </Button>
              </motion.div>
              <Link to={ROUTES.LESSONS}>
                <motion.div whileHover="hover" whileTap={{ scale: 0.95 }} variants={scaleOnHover}>
                  <Button
                    variant="outline"
                    size="lg"
                    className={styles.heroButton}
                  >
                    <BookOpen className={styles.iconButton} />
                    {t('public.home.hero.actions.explore_lessons')}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Quick Access Section */}
        <section className={`${styles.section} ${styles['section--alt']}`}>
          <div className={styles.sectionContainer}>
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>{t('public.home.quick_access.title')}</h2>
            </motion.div>
            <motion.div
              className={`${styles.grid} ${styles['grid--cols-4']}`}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                {
                  icon: LayoutDashboard,
                  title: t('public.home.quick_access.items.dashboard.title'),
                  desc: t('public.home.quick_access.items.dashboard.desc'),
                  route: ROUTES.DASHBOARD,
                },
                {
                  icon: BookOpen,
                  title: t('public.home.quick_access.items.lessons.title'),
                  desc: t('public.home.quick_access.items.lessons.desc'),
                  route: ROUTES.LESSONS,
                },
                {
                  icon: Rocket,
                  title: t('public.home.quick_access.items.projects.title'),
                  desc: t('public.home.quick_access.items.projects.desc'),
                  route: ROUTES.PROJECTS,
                },
                { icon: Shield, title: t('public.home.quick_access.items.profile.title'), desc: t('public.home.quick_access.items.profile.desc'), route: ROUTES.PROFILE },
              ].map((item, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card
                    className={styles.accessCard}
                    hoverable
                    onClick={() => navigate(item.route)}
                  >
                    <div className={`${styles.cardContent} ${styles['cardContent--center']}`}>
                      <div className={`${styles.cardIconWrapper} ${styles['cardIconWrapper--bg']}`}>
                        <item.icon className={styles.iconAccess} />
                      </div>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardDesc}>{item.desc}</p>
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
          className={styles.section}
          initial="hidden"
          animate={featuresInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <div className={styles.sectionContainer}>
            <motion.div className={styles.sectionHeader} variants={fadeInUp}>
              <h2 className={styles.sectionTitle}>{t('public.home.features.title')}</h2>
              <p className={styles.sectionSubtitle}>
                {t('public.home.features.subtitle')}
              </p>
            </motion.div>

            <motion.div className={`${styles.grid} ${styles['grid--cols-4']}`} variants={staggerContainer}>
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className={styles.featureCard} hoverable>
                    <div className={styles.cardContent}>
                      <div className={styles.cardIconWrapper}>{feature.icon}</div>
                      <h3 className={styles.cardTitle}>{feature.title}</h3>
                      <p className={styles.cardDesc}>{feature.description}</p>
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
    <div className={styles.page}>
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className={styles.hero}
        initial="hidden"
        animate={heroInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className={styles.heroBlob} />

        <div className={styles.heroContent}>
          <motion.h1 className={styles.heroTitle} variants={fadeInUp}>
            {t('public.home.hero.title')}
            <br />
            <span className={styles.heroTitleHighlight}>
              {t('public.home.hero.title_highlight')}
            </span>
          </motion.h1>
          <motion.p className={styles.heroDescription} variants={fadeInUp}>
            {t('public.home.hero.description')}
          </motion.p>
          <motion.div className={styles.heroActions} variants={fadeInUp}>
            <motion.div
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              variants={scaleOnHover}
              onClick={() => useModalStore.getState().open('register')}
            >
              <Button
                variant="primary"
                size="lg"
                className={styles.heroButton}
              >
                {t('public.home.hero.actions.start_free')}
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
                className={styles.heroButton}
              >
                {t('public.home.hero.actions.login')}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        className={`${styles.section} ${styles['section--alt']}`}
        initial="hidden"
        animate={featuresInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className={styles.sectionContainer}>
          <motion.div className={styles.sectionHeader} variants={fadeInUp}>
            <h2 className={styles.sectionTitle}>{t('public.home.features.title')}</h2>
            <p className={styles.sectionSubtitle}>
              {t('public.home.features.subtitle')}
            </p>
          </motion.div>

          <motion.div className={`${styles.grid} ${styles['grid--cols-4']}`} variants={staggerContainer}>
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className={styles.featureCard} hoverable>
                  <div className={styles.cardContent}>
                    <div className={styles.cardIconWrapper}>{feature.icon}</div>
                    <h3 className={styles.cardTitle}>{feature.title}</h3>
                    <p className={styles.cardDesc}>{feature.description}</p>
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
        className={styles.section}
        initial="hidden"
        animate={whyUsInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className={styles.sectionContainer}>
          <motion.div className={styles.sectionHeader} variants={fadeInUp}>
            <h2 className={styles.sectionTitle}>{t('public.home.why_us.title')}</h2>
          </motion.div>

          <motion.div className={`${styles.grid} ${styles['grid--cols-3']}`} variants={staggerContainer}>
            {whyUsReasons.map((reason, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className={`${styles.featureCard} ${styles.cardContent}`} hoverable>
                  <div className={`${styles.cardContent} ${styles['cardContent--center']}`}>
                    <div className={styles.cardIconWrapper}>{reason.icon}</div>
                    <h3 className={styles.cardTitle}>{reason.title}</h3>
                    <p className={styles.cardDesc}>{reason.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        ref={ctaRef}
        className={`${styles.section} ${styles['section--gradient']}`}
        initial="hidden"
        animate={ctaInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className={styles.sectionContainer}>
          <div className="text-center">
            <motion.h2 className={styles.heroTitle} variants={fadeInUp}>
              {t('public.home.cta.title')}
            </motion.h2>
            <motion.p className={styles.heroDescription} variants={fadeInUp}>
              {t('public.home.cta.description')}
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={fadeInUp}
              onClick={() => useModalStore.getState().open('register')}
            >
              <Button variant="primary" size="lg" className={styles.heroButtonCta}>
                {t('public.home.hero.actions.create_account')}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default HomePage
