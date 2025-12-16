import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { textToSpeechService } from '../../text-input';

interface TextToSpeechButtonProps {
  text: string;
  lang?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg'; // محفوظ للتوافق مع الاستخدامات السابقة
}

/**
 * زر القراءة الصوتية
 * 
 * يسمح بتشغيل/إيقاف القراءة الصوتية للنص
 */
export const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({
  text,
  lang = 'ar-SA',
  className = '',
  size: _size = 'sm',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  /**
   * التحقق من حالة القراءة بشكل دوري
   */
  useEffect(() => {
    const checkSpeaking = () => {
      setIsSpeaking(textToSpeechService.getIsSpeaking());
    };

    const interval = setInterval(checkSpeaking, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /**
   * معالج النقر على الزر
   */
  const handleClick = () => {
    if (isSpeaking) {
      // إيقاف القراءة
      textToSpeechService.stop();
      setIsSpeaking(false);
    } else {
      // بدء القراءة
      textToSpeechService.speak(text, lang);
      setIsSpeaking(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-1.5 rounded-lg bg-ide-surface/60 hover:bg-ide-surface border border-ide-border/30 hover:border-ide-border/60 transition-all backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-105 ${className}`}
      title={isSpeaking ? 'إيقاف القراءة' : 'قراءة بصوت مسموع'}
      aria-label={isSpeaking ? 'إيقاف القراءة' : 'قراءة بصوت مسموع'}
    >
      {isSpeaking ? (
        <VolumeX className="w-4 h-4 text-red-400 animate-pulse" />
      ) : (
        <Volume2 className="w-4 h-4 text-ide-text" />
      )}
    </button>
  );
};

