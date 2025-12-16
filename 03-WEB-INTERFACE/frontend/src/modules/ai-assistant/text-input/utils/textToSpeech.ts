/**
 * خدمة تحويل النص إلى كلام (Text-to-Speech)
 */
export class TextToSpeechService {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    } else {
      throw new Error('Text-to-Speech غير مدعوم في هذا المتصفح');
    }
  }

  /**
   * قراءة النص بصوت
   */
  speak(text: string, lang: string = 'ar-SA'): void {
    if (!text || !text.trim()) {
      return;
    }

    this.stop(); // إيقاف أي قراءة سابقة

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = lang;
    this.utterance.rate = 1;
    this.utterance.pitch = 1;
    this.utterance.volume = 1;

    this.utterance.onstart = () => {
      this.isSpeaking = true;
    };

    this.utterance.onend = () => {
      this.isSpeaking = false;
    };

    this.utterance.onerror = (error) => {
      console.error('خطأ في Text-to-Speech:', error);
      this.isSpeaking = false;
    };

    this.synth.speak(this.utterance);
  }

  /**
   * إيقاف القراءة
   */
  stop(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * التحقق من حالة القراءة
   */
  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * تغيير سرعة القراءة
   */
  setRate(rate: number): void {
    if (this.utterance) {
      this.utterance.rate = Math.max(0.1, Math.min(2, rate));
    }
  }

  /**
   * تغيير نبرة الصوت
   */
  setPitch(pitch: number): void {
    if (this.utterance) {
      this.utterance.pitch = Math.max(0, Math.min(2, pitch));
    }
  }

  /**
   * تغيير مستوى الصوت
   */
  setVolume(volume: number): void {
    if (this.utterance) {
      this.utterance.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

// إنشاء instance واحد للخدمة
export const textToSpeechService = new TextToSpeechService();

