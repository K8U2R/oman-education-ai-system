import React from 'react';

const DocsHomePage: React.FC = () => {
    return (
        <div className="docs-home">
            <h1 className="text-4xl font-bold mb-6 text-foreground">مركز التوثيق والمعرفة 📚</h1>
            <p className="text-xl text-muted-foreground mb-8">
                مرحباً بك في وثائق نظام عمان التعليمي الذكي. ستجد هنا كل ما تحتاجه للبدء واستخدام النظام بكفاءة.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold mb-2">🚀 البداية السريعة</h2>
                    <p className="text-muted-foreground">كيفية إنشاء حساب، إعداد ملفك الشخصي، والبدء في أول درس لك.</p>
                </div>
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold mb-2">🧠 المعلم الذكي</h2>
                    <p className="text-muted-foreground">شرح تفصيلي لكيفية عمل الذكاء الاصطناعي وكيفية الاستفادة منه.</p>
                </div>
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold mb-2">💎 الاشتراكات والميزات</h2>
                    <p className="text-muted-foreground">تعرف على الفرق بين الباقة المجانية والباقات المدفوعة.</p>
                </div>
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold mb-2">🛡️ الأمان والخصوصية</h2>
                    <p className="text-muted-foreground">كيف نحمي بياناتك ومعلوماتك الشخصية.</p>
                </div>
            </div>
        </div>
    );
};

export default DocsHomePage;
