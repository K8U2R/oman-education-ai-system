import React, { useEffect } from 'react';
import { ArrowRight, X, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface NavigationModalProps {
  page: {
    path: string;
    title: string;
    description: string;
  };
  onNavigate: () => void;
  onDismiss: () => void;
}

const NavigationModal: React.FC<NavigationModalProps> = ({
  page,
  onNavigate,
  onDismiss,
}) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onDismiss();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in"
      onClick={handleBackdropClick}
    >
      <Card className="max-w-md w-full relative animate-in zoom-in slide-in-from-bottom-4 shadow-2xl border-ide-accent/20">
        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute left-4 top-4 p-2 hover:bg-ide-border rounded-md transition-all hover:scale-110 z-10"
        >
          <X className="w-4 h-4 text-ide-text-secondary" />
        </button>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-ide-accent/20 to-purple-600/20 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-ide-accent animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-ide-text">اقتراح انتقال</h3>
              <p className="text-sm text-ide-text-secondary">أعتقد أن هذا ما تبحث عنه</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-ide-surface/50 rounded-lg border border-ide-border">
            <h4 className="font-semibold mb-2 text-ide-accent text-lg">{page.title}</h4>
            <p className="text-sm text-ide-text-secondary leading-relaxed">{page.description}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onNavigate}
              className="flex-1 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              الانتقال الآن
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={onDismiss}
              className="flex-1 hover:bg-ide-border transition-all"
            >
              البقاء هنا
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NavigationModal;

