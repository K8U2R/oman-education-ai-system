import React, { useCallback, useEffect } from 'react';
import { Send, Image, Folder } from 'lucide-react';
import Button from '@/components/ui/Button';
import { SelectedFilesPreview } from '../../components/chat/SelectedFilesPreview';
import type { DirectoryInputProps } from '../../types/input-props';

/**
 * واجهة Props لمكون ChatInput
 * 
 * @property {string} message - النص الحالي في حقل الإدخال
 * @property {(msg: string) => void} setMessage - دالة لتحديث النص
 * @property {() => void} onSend - دالة يتم استدعاؤها عند إرسال الرسالة
 * @property {boolean} isLoading - حالة التحميل (لتعطيل الحقل أثناء الإرسال)
 * @property {File[]} selectedFiles - قائمة الملفات المحددة
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onFileSelect - معالج اختيار الملفات
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onFolderSelect - معالج اختيار المجلدات
 * @property {(index: number) => void} onRemoveFile - معالج حذف ملف من القائمة
 * @property {'center' | 'regular'} variant - نوع التصميم: 'center' للعرض المركزي (عند عدم وجود رسائل)، 'regular' للعرض العادي
 * @property {React.RefObject<HTMLInputElement>} fileInputRef - مرجع لعنصر input الملفات
 * @property {React.RefObject<HTMLInputElement>} folderInputRef - مرجع لعنصر input المجلدات
 * @property {React.RefObject<HTMLTextAreaElement>} inputRef - مرجع لعنصر textarea
 */
interface ChatInputProps {
  message: string;
  setMessage: (msg: string) => void;
  onSend: () => void;
  isLoading: boolean;
  selectedFiles: File[];
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFolderSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  variant: 'center' | 'regular';
  fileInputRef: React.RefObject<HTMLInputElement>;
  folderInputRef: React.RefObject<HTMLInputElement>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

/**
 * مكون حقل الإدخال للمحادثة
 * 
 * يدعم وضعين من التصميم:
 * - 'center': عرض مركزي كبير (يستخدم عند عدم وجود رسائل)
 * - 'regular': عرض عادي مضغوط (يستخدم أثناء المحادثة)
 * 
 * المميزات:
 * - إدخال نص متعدد الأسطر مع تكيف تلقائي للارتفاع
 * - أزرار لإضافة الملفات والمجلدات داخل حقل الإدخال
 * - زر إرسال متكامل
 * - معاينة الملفات المحددة
 * - دعم اختصارات لوحة المفاتيح (Enter للإرسال، Shift+Enter للسطر الجديد)
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  onSend,
  isLoading,
  selectedFiles,
  onFileSelect,
  onFolderSelect,
  onRemoveFile,
  variant,
  fileInputRef,
  folderInputRef,
  inputRef,
}) => {
  /**
   * ضبط ارتفاع textarea تلقائياً
   * 
   * يتم استدعاؤها عند تغيير المحتوى أو عند تغيير variant
   */
  const adjustTextareaHeight = useCallback(() => {
    if (!inputRef.current) return;
    const textarea = inputRef.current;
    // إعادة تعيين الارتفاع لاحتساب الارتفاع الجديد
    textarea.style.height = 'auto';
    // تحديد الحد الأقصى للارتفاع حسب نوع التصميم
    const maxHeight = variant === 'center' ? 200 : 128;
    // ضبط الارتفاع مع مراعاة الحد الأقصى
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    // إزالة التمرير إذا كان الارتفاع أقل من الحد الأقصى
    textarea.style.overflowY = newHeight >= maxHeight ? 'auto' : 'hidden';
  }, [variant, inputRef]);

  /**
   * معالج تغيير النص في textarea
   * 
   * يقوم بـ:
   * 1. تحديث حالة النص
   * 2. ضبط الارتفاع تلقائياً حسب المحتوى
   * 3. تحديد الحد الأقصى للارتفاع حسب نوع التصميم
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // استخدام requestAnimationFrame لتحسين الأداء
    requestAnimationFrame(() => {
      adjustTextareaHeight();
    });
  }, [setMessage, adjustTextareaHeight]);

  /**
   * معالج ضغطات لوحة المفاتيح
   * 
   * يدعم:
   * - Enter: إرسال الرسالة (إذا لم يكن Shift أو Ctrl مضغوط)
   * - Shift+Enter: إضافة سطر جديد
   * - Ctrl+Enter: إضافة سطر جديد
   * - Tab: إضافة مسافة بادئة (إذا كان النص فارغاً)
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // إرسال الرسالة عند الضغط على Enter بدون Shift أو Ctrl
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSend();
      }
    }
    // منع Tab من الخروج من textarea
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = message.substring(0, start) + '  ' + message.substring(end);
      setMessage(newValue);
      // استعادة موضع المؤشر بعد إضافة المسافة
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        textarea.focus();
      }, 0);
    }
  }, [message, isLoading, onSend, setMessage]);

  /**
   * ضبط الارتفاع عند تغيير variant أو message
   */
  useEffect(() => {
    adjustTextareaHeight();
  }, [variant, adjustTextareaHeight]);

  /**
   * ============================================
   * الوضع المركزي (Center Variant)
   * ============================================
   * 
   * يستخدم عند عدم وجود رسائل في المحادثة.
   * يتميز بـ:
   * - حقل إدخال كبير ومركزي
   * - جميع الأزرار (إرسال وإرفاق) مدمجة داخل حقل الإدخال
   * - تصميم جذاب ومرحب مع تناغم بصري أفضل
   */
  if (variant === 'center') {
    return (
      <div className="space-y-5">
        {/* معاينة الملفات المحددة */}
        <SelectedFilesPreview files={selectedFiles} onRemove={onRemoveFile} variant="center" />
        
        {/* حاوية textarea مع جميع الأزرار المدمجة */}
        <div className="relative min-w-0">
          {/* حقل الإدخال الرئيسي */}
          {/* 
            padding-right: pr-24 لإفساح مساحة لزر الإرسال على اليمين (RTL)
            padding-left: pl-20 لإفساح مساحة لأزرار الإرفاق على اليسار
          */}
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="اكتب رسالتك هنا..."
            aria-label="حقل إدخال الرسالة"
            aria-describedby="input-help-center"
            aria-invalid={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="true"
            dir="rtl"
            className="w-full px-6 py-6 pr-24 pl-20 text-base sm:text-lg rounded-2xl bg-ide-bg/90 backdrop-blur-md border-2 border-ide-border/60 text-ide-text placeholder:text-ide-text-secondary/60 focus:outline-none focus:ring-4 focus:ring-ide-accent/40 focus:border-ide-accent focus:shadow-[0_0_0_4px_rgba(91,141,239,0.1)] transition-all duration-300 ease-out resize-none min-h-[72px] max-h-[240px] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:border-ide-border/80 leading-relaxed font-normal selection:bg-ide-accent/30 selection:text-ide-text scrollbar-thin scrollbar-thumb-ide-border/50 scrollbar-track-transparent"
            disabled={isLoading}
            rows={3}
            style={{
              lineHeight: '1.6',
              letterSpacing: '0.01em',
            }}
          />
          
          {/* أزرار الإرفاق داخل textarea - أسفل اليسار */}
          {/* 
            أزرار الملفات والمجلدات مدمجة داخل textarea
            استخدام pointer-events-none على الحاوية و pointer-events-auto على الأزرار
            يضمن أن النقر على textarea يعمل بشكل صحيح بينما الأزرار قابلة للنقر
          */}
          <div className="absolute bottom-3 left-3 flex gap-2 flex-shrink-0 pointer-events-none">
            {/* Input مخفي لاختيار الملفات */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onFileSelect}
              className="hidden"
            />
            {/* زر إضافة الصور */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-[40px] w-[40px] p-0 rounded-lg hover:bg-ide-accent/20 hover:border-ide-accent/50 border border-ide-border/30 bg-ide-surface/90 backdrop-blur-sm transition-all hover:scale-105 pointer-events-auto shadow-sm"
              title="إضافة صور"
            >
              <Image className="w-5 h-5 text-ide-accent" />
            </Button>
            
            {/* Input مخفي لاختيار المجلدات */}
            <input
              ref={folderInputRef}
              type="file"
              {...({ webkitdirectory: '', directory: '' } as DirectoryInputProps)}
              multiple
              onChange={onFolderSelect}
              className="hidden"
            />
            {/* زر إضافة المجلدات */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => folderInputRef.current?.click()}
              className="h-[40px] w-[40px] p-0 rounded-lg hover:bg-ide-accent/20 hover:border-ide-accent/50 border border-ide-border/30 bg-ide-surface/90 backdrop-blur-sm transition-all hover:scale-105 pointer-events-auto shadow-sm"
              title="إضافة مجلد"
            >
              <Folder className="w-5 h-5 text-ide-accent" />
            </Button>
          </div>
          
          {/* زر الإرسال داخل textarea - أسفل اليمين (RTL) */}
          {/* 
            في الوضع المركزي، زر الإرسال الآن مدمج داخل textarea
            ليكون جزءاً من الوحدة البصرية الواحدة
          */}
          <div className="absolute bottom-3 right-3 pointer-events-none">
            <Button
              onClick={onSend}
              disabled={isLoading || !message.trim()}
              className="h-[48px] w-[48px] p-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-ide-accent via-blue-500 to-purple-600 hover:from-ide-accent-hover hover:via-blue-600 hover:to-purple-700 flex items-center justify-center border-0 pointer-events-auto"
              title="إرسال (Enter)"
            >
              <Send className="w-5 h-5 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </div>
          
          {/* نص مساعد للقارئ الشاشة (Screen Reader) */}
          <div id="input-help-center" className="sr-only">
            اضغط Enter للإرسال، Shift+Enter للسطر الجديد
          </div>
        </div>
      </div>
    );
  }

  /**
   * ============================================
   * الوضع العادي (Regular Variant)
   * ============================================
   * 
   * يستخدم أثناء المحادثة عندما توجد رسائل.
   * يتميز بـ:
   * - حقل إدخال مضغوط في الأسفل
   * - زر إرسال داخل حقل الإدخال (على اليمين - RTL)
   * - تصميم مدمج وموفر للمساحة
   */
  return (
    <div className="w-full">
      {/* معاينة الملفات المحددة */}
      <SelectedFilesPreview files={selectedFiles} onRemove={onRemoveFile} variant="regular" />
      
      {/* حاوية textarea مع جميع الأزرار */}
      <div className="relative">
        {/* حقل الإدخال الرئيسي */}
        {/* 
          padding-right: pr-20 لإفساح مساحة لزر الإرسال على اليمين
          padding-left: pl-16 لإفساح مساحة لأزرار الملفات على اليسار
        */}
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="اكتب رسالتك هنا..."
          aria-label="حقل إدخال الرسالة"
          aria-describedby="input-help"
          aria-invalid={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="true"
          dir="rtl"
          className="w-full px-4 py-3 pr-20 pl-16 rounded-xl bg-ide-bg/90 backdrop-blur-md border border-ide-border/60 text-ide-text placeholder:text-ide-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-ide-accent/60 focus:border-ide-accent transition-all duration-300 ease-out resize-none min-h-[52px] max-h-32 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:border-ide-border/80 leading-relaxed font-normal selection:bg-ide-accent/30 selection:text-ide-text scrollbar-thin scrollbar-thumb-ide-border/50 scrollbar-track-transparent"
          disabled={isLoading}
          rows={1}
          style={{
            lineHeight: '1.5',
            letterSpacing: '0.01em',
          }}
        />
        
        {/* أزرار الإجراءات داخل textarea - أسفل اليسار */}
        {/* 
          أزرار الملفات والمجلدات
          تستخدم pointer-events-none على الحاوية و pointer-events-auto على الأزرار
        */}
        <div className="absolute bottom-2 left-2 flex gap-1.5 pointer-events-none">
          {/* Input مخفي لاختيار الملفات */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFileSelect}
            className="hidden"
          />
          {/* زر إضافة الصور */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-[32px] w-[32px] p-0 rounded-lg hover:bg-ide-accent/20 hover:border-ide-accent/50 border border-ide-border/30 bg-ide-surface/90 backdrop-blur-sm transition-all hover:scale-105 pointer-events-auto shadow-sm"
            title="إضافة صور"
          >
            <Image className="w-3.5 h-3.5 text-ide-accent" />
          </Button>
          
          {/* Input مخفي لاختيار المجلدات */}
          <input
            ref={folderInputRef}
            type="file"
            {...({ webkitdirectory: '', directory: '' } as DirectoryInputProps)}
            multiple
            onChange={onFolderSelect}
            className="hidden"
          />
          {/* زر إضافة المجلدات */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => folderInputRef.current?.click()}
            className="h-[32px] w-[32px] p-0 rounded-lg hover:bg-ide-accent/20 hover:border-ide-accent/50 border border-ide-border/30 bg-ide-surface/90 backdrop-blur-sm transition-all hover:scale-105 pointer-events-auto shadow-sm"
            title="إضافة مجلد"
          >
            <Folder className="w-3.5 h-3.5 text-ide-accent" />
          </Button>
        </div>
        
        {/* زر الإرسال داخل textarea - أسفل اليمين (RTL) */}
        {/* 
          في الوضع العادي، زر الإرسال يكون داخل textarea
          ليكون مدمجاً ومتاحاً بسهولة أثناء المحادثة
        */}
        <div className="absolute bottom-2 right-2 pointer-events-none">
          <Button
            onClick={onSend}
            disabled={isLoading || !message.trim()}
            className="h-[36px] w-[36px] p-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-ide-accent via-blue-500 to-purple-600 hover:from-ide-accent-hover hover:via-blue-600 hover:to-purple-700 flex items-center justify-center border-0 pointer-events-auto"
            title="إرسال (Enter)"
          >
            <Send className="w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        </div>
        
        {/* نص مساعد للقارئ الشاشة (Screen Reader) */}
        <div id="input-help" className="sr-only">
          اضغط Enter للإرسال، Shift+Enter للسطر الجديد
        </div>
      </div>
    </div>
  );
};

