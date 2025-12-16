import React from 'react';
import { Github, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';

const OAuthButtons: React.FC = () => {
  const handleOAuthLogin = (provider: 'github' | 'google') => {
    // TODO: Implement OAuth login
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-ide-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-ide-bg text-ide-text-secondary">أو</span>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthLogin('github')}
      >
        <Github className="w-4 h-4" />
        تسجيل الدخول مع GitHub
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthLogin('google')}
      >
        <Mail className="w-4 h-4" />
        تسجيل الدخول مع Google
      </Button>
    </div>
  );
};

export default OAuthButtons;

