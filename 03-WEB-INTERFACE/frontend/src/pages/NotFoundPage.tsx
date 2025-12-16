import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ide-bg flex items-center justify-center p-4 w-full overflow-y-auto">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-ide-accent mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">الصفحة غير موجودة</h2>
        <p className="text-ide-text-secondary mb-8 max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ide-accent text-white rounded-md hover:bg-ide-accent-hover transition-colors"
          >
            <Home className="w-4 h-4" />
            الصفحة الرئيسية
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ide-surface border border-ide-border text-ide-text rounded-md hover:bg-ide-border transition-colors"
          >
            لوحة التحكم
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

