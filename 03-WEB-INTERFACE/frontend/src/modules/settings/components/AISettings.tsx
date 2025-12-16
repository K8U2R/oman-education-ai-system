import React, { useState } from 'react';
import { Bot, Key, Zap } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { useErrorHandler } from '@/hooks/useErrorHandler';

const AISettings: React.FC = () => {
  const { showSuccess, showError } = useErrorHandler();
  const [provider, setProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-1.5-pro');
  const [temperature, setTemperature] = useState(0.7);
  const [isTesting, setIsTesting] = useState(false);

  // تحديث النماذج عند تغيير المزود
  const getModelsForProvider = (provider: string) => {
    switch (provider) {
      case 'gemini':
        return [
          { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (موصى به)' },
          { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (سريع)' },
          { value: 'gemini-pro', label: 'Gemini Pro' },
          { value: 'gemini-pro-vision', label: 'Gemini Pro Vision' },
        ];
      case 'openai':
        return [
          { value: 'gpt-4', label: 'GPT-4' },
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
        ];
      case 'anthropic':
        return [
          { value: 'claude-3-opus', label: 'Claude 3 Opus' },
          { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
          { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
        ];
      default:
        return [];
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      showError('خطأ', 'يرجى إدخال API Key أولاً');
      return;
    }

    setIsTesting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_AI_API_URL || 'http://localhost:8001/api/ai'}/test-connection?provider=${provider}&api_key=${apiKey}`);
      const data = await response.json();

      if (data.connected) {
        showSuccess('نجح الاتصال', 'تم الاتصال بنجاح مع ' + provider);
      } else {
        showError('فشل الاتصال', data.error || 'فشل الاتصال مع ' + provider);
      }
    } catch (error) {
      showError('خطأ', 'فشل اختبار الاتصال');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey) {
      showError('خطأ', 'يرجى إدخال API Key');
      return;
    }

    try {
      // حفظ في localStorage (في الإنتاج، استخدم Backend API)
      const settings = {
        provider,
        apiKey,
        model,
        temperature,
      };
      localStorage.setItem('ai_settings', JSON.stringify(settings));
      
      // تحديث aiService
      const { aiService } = await import('@/services/api/ai-service');
      aiService.setProvider(provider as 'gemini' | 'openai' | 'anthropic');
      aiService.setApiKey(apiKey);

      showSuccess('تم الحفظ', 'تم حفظ إعدادات AI بنجاح');
    } catch (error) {
      showError('خطأ', 'فشل حفظ الإعدادات');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-ide-accent" />
          إعدادات AI
        </h2>
        <div className="space-y-4">
          <Select
            label="مزود AI"
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              // تحديث النموذج الافتراضي عند تغيير المزود
              const models = getModelsForProvider(e.target.value);
              if (models.length > 0) {
                setModel(models[0].value);
              }
            }}
            options={[
              { value: 'gemini', label: 'Google Gemini (موصى به)' },
              { value: 'openai', label: 'OpenAI' },
              { value: 'anthropic', label: 'Anthropic' },
            ]}
          />
          <Input
            label="API Key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            leftIcon={<Key className="w-4 h-4" />}
            placeholder={provider === 'gemini' ? 'أدخل Gemini API Key' : 'أدخل مفتاح API'}
          />
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey}
              className="flex-1"
            >
              {isTesting ? 'جاري الاختبار...' : 'اختبار الاتصال'}
            </Button>
          </div>
          <Select
            label="النموذج"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            options={getModelsForProvider(provider)}
          />
          <Input
            label="Temperature"
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={temperature.toString()}
            onChange={(e) => setTemperature(Number(e.target.value))}
            leftIcon={<Zap className="w-4 h-4" />}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave}>حفظ</Button>
      </div>
    </div>
  );
};

export default AISettings;

