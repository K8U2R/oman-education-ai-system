import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { authService } from '@/application'
import { Button, Card, Input } from '../components/common'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: '',
    acceptTerms: false,
    acceptPrivacyPolicy: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Check for OAuth callback (tokens in hash) or errors
  useEffect(() => {
    const location = window.location

    // Check for OAuth tokens in hash (if redirected here by mistake)
    const hash = location.hash
    if (hash && hash.includes('access_token')) {
      // Redirect to callback handler
      window.location.href = '/auth/callback'
      return
    }

    // Check for OAuth errors in query params
    const urlParams = new URLSearchParams(location.search)
    const oauthError = urlParams.get('error_description')

    if (oauthError) {
      const decodedError = decodeURIComponent(oauthError.replace(/\+/g, ' '))
      setErrors({ submit: `فشل تسجيل الدخول عبر OAuth: ${decodedError}` })
      // Clean URL
      window.history.replaceState({}, '', '/register')
    }
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة'
    } else if (formData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة'
    }

    // First name validation
    if (!formData.firstName) {
      newErrors.firstName = 'الاسم الأول مطلوب'
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'الاسم الأول يجب أن يكون حرفين على الأقل'
    }

    // Last name validation
    if (!formData.lastName) {
      newErrors.lastName = 'اسم العائلة مطلوب'
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'اسم العائلة يجب أن يكون حرفين على الأقل'
    }

    // Terms and Privacy Policy validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'يجب الموافقة على الشروط والأحكام'
    }
    if (!formData.acceptPrivacyPolicy) {
      newErrors.acceptPrivacyPolicy = 'يجب الموافقة على سياسة الخصوصية'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await authService.register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username || undefined,
        accept_terms: formData.acceptTerms,
        accept_privacy_policy: formData.acceptPrivacyPolicy,
      })

      setSuccess(true)
      // Note: Supabase requires email verification before login
      // User will receive verification email automatically
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.',
            requiresVerification: true,
          },
        })
      }, 3000)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setErrors({
        submit: error.response?.data?.detail || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  if (success) {
    return (
      <Card className="w-full text-center">
        <div className="py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إنشاء الحساب بنجاح! ✅</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-right">
            <p className="text-sm font-semibold text-blue-800 mb-2">
              📧 يرجى التحقق من بريدك الإلكتروني
            </p>
            <p className="text-sm text-blue-700 mb-2">
              تم إرسال رابط التحقق إلى: <strong>{formData.email}</strong>
            </p>
            <p className="text-xs text-blue-600">
              انقر على الرابط في الرسالة لتفعيل حسابك، ثم يمكنك تسجيل الدخول.
            </p>
            <p className="text-xs text-blue-500 mt-2">💡 تحقق من مجلد Spam إذا لم تجد الرسالة</p>
          </div>
          <p className="text-gray-600 mb-4">سيتم توجيهك إلى صفحة تسجيل الدخول...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء حساب جديد</h1>
        <p className="text-gray-600">انضم إلينا وابدأ رحلتك التعليمية اليوم</p>
      </div>

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 ml-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            type="text"
            label="الاسم الأول"
            placeholder="أحمد"
            value={formData.firstName}
            onChange={e => handleChange('firstName', e.target.value)}
            error={errors.firstName}
            autoComplete="given-name"
            required
            disabled={isLoading}
          />

          <Input
            type="text"
            label="اسم العائلة"
            placeholder="محمد"
            value={formData.lastName}
            onChange={e => handleChange('lastName', e.target.value)}
            error={errors.lastName}
            autoComplete="family-name"
            required
            disabled={isLoading}
          />
        </div>

        <Input
          type="text"
          label="اسم المستخدم (اختياري)"
          placeholder="username"
          value={formData.username}
          onChange={e => handleChange('username', e.target.value)}
          error={errors.username}
          autoComplete="username"
          disabled={isLoading}
          helperText="إذا لم تقم بإدخال اسم مستخدم، سيتم استخدام بريدك الإلكتروني"
        />

        <Input
          type="email"
          label="البريد الإلكتروني"
          placeholder="example@email.com"
          value={formData.email}
          onChange={e => handleChange('email', e.target.value)}
          error={errors.email}
          autoComplete="email"
          required
          disabled={isLoading}
        />

        <Input
          type="password"
          label="كلمة المرور"
          placeholder="••••••••"
          value={formData.password}
          onChange={e => handleChange('password', e.target.value)}
          error={errors.password}
          autoComplete="new-password"
          required
          disabled={isLoading}
          helperText="8 أحرف على الأقل، حرف كبير وصغير ورقم"
        />

        <Input
          type="password"
          label="تأكيد كلمة المرور"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={e => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
          disabled={isLoading}
        />

        <div className="space-y-3">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              checked={formData.acceptTerms}
              onChange={e => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
              required
            />
            <label htmlFor="terms" className="mr-2 text-sm text-gray-600">
              أوافق على{' '}
              <Link
                to="/terms"
                target="_blank"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                الشروط والأحكام
              </Link>
            </label>
          </div>
          {errors.acceptTerms && <p className="text-sm text-red-600 mr-6">{errors.acceptTerms}</p>}

          <div className="flex items-start">
            <input
              type="checkbox"
              id="privacy"
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              checked={formData.acceptPrivacyPolicy}
              onChange={e =>
                setFormData(prev => ({ ...prev, acceptPrivacyPolicy: e.target.checked }))
              }
              required
            />
            <label htmlFor="privacy" className="mr-2 text-sm text-gray-600">
              أوافق على{' '}
              <Link
                to="/privacy"
                target="_blank"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                سياسة الخصوصية
              </Link>
            </label>
          </div>
          {errors.acceptPrivacyPolicy && (
            <p className="text-sm text-red-600 mr-6">{errors.acceptPrivacyPolicy}</p>
          )}
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
          إنشاء حساب
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">أو</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              // Always redirect to /auth/callback to handle OAuth tokens
              const oauthUrl = authService.getOAuthUrl(
                'google',
                `${window.location.origin}/auth/callback`
              )
              window.location.href = oauthUrl
            }}
            disabled={isLoading}
            className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="mr-2">Google</span>
          </button>

          <button
            type="button"
            onClick={() => {
              // Always redirect to /auth/callback to handle OAuth tokens
              const oauthUrl = authService.getOAuthUrl(
                'github',
                `${window.location.origin}/auth/callback`
              )
              window.location.href = oauthUrl
            }}
            disabled={isLoading}
            className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="mr-2">GitHub</span>
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        لديك حساب بالفعل؟{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          تسجيل الدخول
        </Link>
      </p>
    </Card>
  )
}

export default RegisterPage
