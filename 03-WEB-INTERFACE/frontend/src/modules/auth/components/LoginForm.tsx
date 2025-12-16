import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { authService } from '@/services/auth/auth-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const { handleError, showSuccess } = useErrorHandler();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.login({ email, password });
      showSuccess('تم تسجيل الدخول', 'مرحباً بك مرة أخرى!');
      navigate('/chat');
    } catch (error) {
      handleError(error, 'فشل تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="البريد الإلكتروني"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        leftIcon={<Mail className="w-4 h-4" />}
        placeholder="example@email.com"
      />
      <Input
        label="كلمة المرور"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        leftIcon={<Lock className="w-4 h-4" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 rounded hover:bg-ide-border transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        }
        placeholder="••••••••"
      />
      <div className="flex items-center justify-between">
        <Checkbox
          label="تذكرني"
          checked={rememberMe}
          onChange={setRememberMe}
        />
        <a
          href="/forgot-password"
          className="text-sm text-ide-accent hover:underline"
        >
          نسيت كلمة المرور؟
        </a>
      </div>
      <Button type="submit" className="w-full" isLoading={isLoading}>
        تسجيل الدخول
      </Button>
    </form>
  );
};

export default LoginForm;

