import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Code, BookOpen, Rocket, Shield, Zap } from 'lucide-react'
import { Button, Card } from '../components/common'
import './HomePage.scss'

const HomePage: React.FC = () => {
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
      description: 'صمم واجهات ويب احترافية بمساعدة الذكاء الاصطناعي',
    },
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-page__hero">
        <div className="home-page__hero-content">
          <div style={{ textAlign: 'center' }}>
            <h1 className="home-page__hero-title">
              نظام التعليم الذكي
              <br />
              <span style={{ color: 'var(--color-primary-200, #bfdbfe)' }}>
                Oman Education AI System
              </span>
            </h1>
            <p className="home-page__hero-description">
              نظام تعليمي متكامل يعتمد على الذكاء الاصطناعي لتطوير المهارات التقنية
              <br />
              يدعم توليد الكود، مساعدة التعلم، بناء المشاريع، تصميم الويب، وأكثر...
            </p>
            <div className="home-page__hero-actions">
              <Link to="/register">
                <Button variant="secondary" size="lg" className="home-page__hero-button--primary">
                  ابدأ الآن مجاناً
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="home-page__hero-button--outline">
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-page__features">
        <div className="home-page__features-container">
          <div className="home-page__features-header">
            <h2 className="home-page__features-title">الميزات الرئيسية</h2>
            <p className="home-page__features-subtitle">
              اكتشف القوة الكاملة للذكاء الاصطناعي في التعليم
            </p>
          </div>

          <div className="home-page__features-grid">
            {features.map((feature, index) => (
              <Card key={index} className="home-page__feature-card" hoverable>
                <div className="home-page__feature-icon">{feature.icon}</div>
                <h3 className="home-page__feature-title">{feature.title}</h3>
                <p className="home-page__feature-description">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="home-page__why-us">
        <div className="home-page__why-us-container">
          <div className="home-page__why-us-header">
            <h2 className="home-page__why-us-title">لماذا نحن؟</h2>
          </div>

          <div className="home-page__why-us-grid">
            <Card className="home-page__why-us-card" hoverable>
              <Shield className="home-page__why-us-icon" />
              <h3 className="home-page__why-us-card-title">آمن وموثوق</h3>
              <p className="home-page__why-us-card-description">
                نستخدم أحدث تقنيات الأمان مع Supabase Authentication
              </p>
            </Card>

            <Card className="home-page__why-us-card" hoverable>
              <Zap className="home-page__why-us-icon" />
              <h3 className="home-page__why-us-card-title">سريع وفعال</h3>
              <p className="home-page__why-us-card-description">أداء عالي وتجربة مستخدم سلسة</p>
            </Card>

            <Card className="home-page__why-us-card" hoverable>
              <Sparkles className="home-page__why-us-icon" />
              <h3 className="home-page__why-us-card-title">ذكاء اصطناعي متقدم</h3>
              <p className="home-page__why-us-card-description">
                أحدث تقنيات AI لتحسين تجربة التعلم
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-page__cta">
        <div className="home-page__cta-container">
          <h2 className="home-page__cta-title">ابدأ رحلتك التعليمية اليوم</h2>
          <p className="home-page__cta-description">
            انضم إلى آلاف الطلاب والمطورين الذين يستخدمون نظامنا
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg" className="home-page__cta-button">
              إنشاء حساب مجاني
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
