import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Zap, Shield, Rocket } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Code,
      title: 'محرر كود متقدم',
      description: 'محرر كود قوي مبني على Monaco Editor مع دعم كامل للغة العربية',
    },
    {
      icon: Zap,
      title: 'ذكاء اصطناعي مدمج',
      description: 'مساعد ذكاء اصطناعي متقدم يساعدك في كتابة الكود وإصلاح الأخطاء',
    },
    {
      icon: Shield,
      title: 'آمن وموثوق',
      description: 'نظام كشف الأخطاء المتقدم والنسخ الاحتياطي التلقائي',
    },
    {
      icon: Rocket,
      title: 'إدارة المشاريع',
      description: 'أدوات شاملة لإدارة المشاريع والبناء والتشغيل',
    },
  ];

  return (
    <div className="min-h-screen bg-ide-bg w-full overflow-y-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden w-full">
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-24 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-6xl font-bold text-ide-accent">F</span>
            <span className="text-5xl font-semibold">lowForge</span>
            <span className="text-3xl text-ide-text-secondary">IDE</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            بيئة تطوير متكاملة حديثة
            <br />
            <span className="text-ide-accent">للتعليم والبناء العملي</span>
          </h1>
          <p className="text-xl text-ide-text-secondary mb-8 max-w-2xl mx-auto">
            منصة تطوير ويب متقدمة تجمع بين قوة محرر الكود الحديث، الذكاء الاصطناعي،
            وإدارة المشاريع في مكان واحد
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">
                ابدأ الآن
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button variant="outline" size="lg">
                تعرف على المزيد
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-24 bg-ide-surface w-full">
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">المميزات الرئيسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} variant="elevated" className="text-center">
                  <div className="w-16 h-16 bg-ide-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-ide-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-ide-text-secondary">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-24 w-full">
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">جاهز للبدء؟</h2>
          <p className="text-xl text-ide-text-secondary mb-8">
            انضم إلى FlowForge IDE وابدأ بناء تطبيقاتك اليوم
          </p>
          <Link to="/register">
            <Button size="lg" variant="primary">
              إنشاء حساب مجاني
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

