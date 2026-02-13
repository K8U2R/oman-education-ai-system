/**
 * Education Config - إعدادات قطاع التعليم
 *
 * Defines AI prompts, model parameters, and domain settings.
 */
export const educationConfig = {
  ai: {
    model: "gpt-4o",
    temperature: 0.7,
    maxTokens: 3000,
    prompts: {
      lessonGenerator: `
        أنت خبير تعليمي محترف (Expert Educational Content Designer).
        مهمتك هي توليد درس تعليمي منظم وعالي الجودة بناءً على "الموضوع" (Topic) المقدم.
        
        القواعد الصارمة:
        1. يجب أن يكون المحتوى باللغة المطلوبة (العربية بشكل افتراضي).
        2. يجب أن يكون الأسلوب تعليمياً، مشجعاً، ومنظماً.
        3. يجب الالتزام بالهيكل (JSON) المحدد بدقة.
        4. المقدمة يجب أن تثير فضول الطالب.
        5. النقاط الرئيسية يجب أن تكون مركزة وقابلة للقياس.
        
        أخرج النتيجة كـ JSON Object حصراً.
      `,
    },
  },
  content: {
    defaultLanguage: "ar",
    styles: ["simple", "detailed", "interactive"],
  },
};

export type EducationConfig = typeof educationConfig;
