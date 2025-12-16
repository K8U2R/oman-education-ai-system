import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authService } from '@/services/auth/auth-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const { handleError, showSuccess } = useErrorHandler();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      handleError(new Error('كلمات المرور غير متطابقة'), 'خطأ في التحقق');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({ name, email, password });
      showSuccess('تم التسجيل', 'تم إنشاء حسابك بنجاح!');
      navigate('/verify-email');
    } catch (error) {
      handleError(error, 'فشل التسجيل');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="الاسم الكامل"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        leftIcon={<User className="w-4 h-4" />}
        placeholder="أحمد محمد"
      />
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
      <Input
        label="تأكيد كلمة المرور"
        type={showPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        leftIcon={<Lock className="w-4 h-4" />}
        placeholder="••••••••"
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        إنشاء حساب
      </Button>
    </form>
  );
};

export default RegisterForm;

