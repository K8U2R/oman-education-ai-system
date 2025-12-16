"""
Google Gemini Integration
gemini-integration.py

تكامل مع Google Gemini API
Integration with Google Gemini API
"""

import os
import google.generativeai as genai
from typing import Optional, List, Dict, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class GeminiIntegration:
    """
    تكامل مع Google Gemini API
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        تهيئة التكامل مع Gemini
        
        Args:
            api_key: مفتاح API لـ Gemini (إذا لم يتم توفيره، سيتم قراءته من البيئة)
        """
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        
        if not self.api_key:
            raise ValueError(
                "Gemini API Key مطلوب. قم بتعيين GEMINI_API_KEY في متغيرات البيئة أو تمريره في البناء."
            )
        
        # تكوين Gemini
        genai.configure(api_key=self.api_key)
        
        # النماذج المتاحة
        self.available_models = {
            'gemini-pro': 'gemini-pro',
            'gemini-pro-vision': 'gemini-pro-vision',
            'gemini-1.5-pro': 'gemini-1.5-pro',
            'gemini-1.5-flash': 'gemini-1.5-flash',
        }
        
        # النموذج الافتراضي
        self.default_model = 'gemini-1.5-pro'
        
        logger.info(f"تم تهيئة Gemini Integration بنجاح. النموذج الافتراضي: {self.default_model}")
    
    def chat(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        system_prompt: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        إرسال رسالة إلى Gemini والحصول على رد
        
        Args:
            messages: قائمة الرسائل (كل رسالة تحتوي على 'role' و 'content')
            model: اسم النموذج (افتراضي: gemini-1.5-pro)
            temperature: درجة الحرارة (0.0 - 1.0)
            max_tokens: الحد الأقصى للرموز (اختياري)
            system_prompt: رسالة النظام (اختياري)
        
        Returns:
            Dict يحتوي على:
                - message: نص الرد
                - usage: معلومات الاستخدام
                - model: النموذج المستخدم
        """
        try:
            model_name = model or self.default_model
            
            if model_name not in self.available_models.values():
                logger.warning(f"النموذج {model_name} غير معروف، استخدام النموذج الافتراضي")
                model_name = self.default_model
            
            # إنشاء النموذج
            gemini_model = genai.GenerativeModel(model_name)
            
            # تحويل الرسائل إلى تنسيق Gemini
            # Gemini يستخدم تنسيق مختلف (parts بدلاً من messages)
            conversation_parts = []
            
            # إضافة رسالة النظام إذا كانت موجودة
            if system_prompt:
                conversation_parts.append(system_prompt)
            
            # تحويل الرسائل
            for msg in messages:
                role = msg.get('role', 'user')
                content = msg.get('content', '')
                
                if role == 'system':
                    # رسائل النظام تُضاف في البداية
                    conversation_parts.insert(0, content)
                elif role == 'user':
                    conversation_parts.append(f"المستخدم: {content}")
                elif role == 'assistant':
                    conversation_parts.append(f"المساعد: {content}")
            
            # دمج جميع الأجزاء في رسالة واحدة
            full_prompt = "\n\n".join(conversation_parts)
            
            # إعدادات الجيل
            generation_config = {
                'temperature': temperature,
            }
            
            if max_tokens:
                generation_config['max_output_tokens'] = max_tokens
            
            # إرسال الطلب
            response = gemini_model.generate_content(
                full_prompt,
                generation_config=generation_config,
            )
            
            # استخراج النص
            response_text = response.text if hasattr(response, 'text') else str(response)
            
            # معلومات الاستخدام
            usage_info = {}
            if hasattr(response, 'usage_metadata'):
                usage_info = {
                    'prompt_tokens': getattr(response.usage_metadata, 'prompt_token_count', 0),
                    'completion_tokens': getattr(response.usage_metadata, 'completion_token_count', 0),
                    'total_tokens': getattr(response.usage_metadata, 'total_token_count', 0),
                }
            
            logger.info(f"تم الحصول على رد من Gemini بنجاح. النموذج: {model_name}")
            
            return {
                'message': response_text,
                'usage': usage_info,
                'model': model_name,
                'timestamp': datetime.now().isoformat(),
            }
            
        except Exception as e:
            logger.error(f"خطأ في التواصل مع Gemini: {str(e)}")
            raise Exception(f"فشل التواصل مع Gemini API: {str(e)}")
    
    def generate_code(
        self,
        prompt: str,
        language: str = 'python',
        model: Optional[str] = None,
    ) -> str:
        """
        توليد كود بناءً على الطلب
        
        Args:
            prompt: وصف الكود المطلوب
            language: لغة البرمجة
            model: النموذج المستخدم
        
        Returns:
            الكود المُولد
        """
        system_prompt = f"""أنت مساعد برمجي متخصص في لغة {language}.
قم بإنشاء كود {language} احترافي بناءً على الطلب.
تأكد من:
1. الكود نظيف ومنظم
2. يحتوي على تعليقات بالعربية
3. يتبع أفضل الممارسات
4. جاهز للاستخدام مباشرة"""
        
        messages = [
            {
                'role': 'user',
                'content': prompt,
            }
        ]
        
        response = self.chat(
            messages=messages,
            model=model,
            system_prompt=system_prompt,
            temperature=0.3,  # درجة حرارة أقل للكود
        )
        
        return response['message']
    
    def explain_code(
        self,
        code: str,
        language: str = 'python',
        model: Optional[str] = None,
    ) -> str:
        """
        شرح الكود
        
        Args:
            code: الكود المراد شرحه
            language: لغة البرمجة
            model: النموذج المستخدم
        
        Returns:
            شرح الكود
        """
        system_prompt = f"""أنت مساعد برمجي متخصص في شرح الكود.
قم بشرح الكود التالي بلغة {language} بشكل واضح ومفصل بالعربية.
تأكد من:
1. شرح كل جزء من الكود
2. شرح الوظيفة الرئيسية
3. شرح المتغيرات والدوال
4. شرح أي مفاهيم معقدة"""
        
        messages = [
            {
                'role': 'user',
                'content': f"اشرح هذا الكود:\n\n```{language}\n{code}\n```",
            }
        ]
        
        response = self.chat(
            messages=messages,
            model=model,
            system_prompt=system_prompt,
        )
        
        return response['message']
    
    def get_available_models(self) -> List[str]:
        """
        الحصول على قائمة النماذج المتاحة
        
        Returns:
            قائمة أسماء النماذج
        """
        return list(self.available_models.values())
    
    def test_connection(self) -> bool:
        """
        اختبار الاتصال مع Gemini API
        
        Returns:
            True إذا كان الاتصال ناجحاً
        """
        try:
            test_response = self.chat(
                messages=[{'role': 'user', 'content': 'مرحباً'}],
                max_tokens=10,
            )
            return True
        except Exception as e:
            logger.error(f"فشل اختبار الاتصال مع Gemini: {str(e)}")
            return False


# دالة مساعدة لإنشاء instance
def create_gemini_integration(api_key: Optional[str] = None) -> GeminiIntegration:
    """
    إنشاء instance من GeminiIntegration
    
    Args:
        api_key: مفتاح API (اختياري)
    
    Returns:
        GeminiIntegration instance
    """
    return GeminiIntegration(api_key=api_key)


if __name__ == "__main__":
    # اختبار التكامل
    import sys
    
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
    else:
        api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        print("يرجى توفير GEMINI_API_KEY")
        sys.exit(1)
    
    try:
        gemini = GeminiIntegration(api_key=api_key)
        print("✅ تم تهيئة Gemini بنجاح")
        
        # اختبار الاتصال
        if gemini.test_connection():
            print("✅ الاتصال مع Gemini ناجح")
        else:
            print("❌ فشل الاتصال مع Gemini")
        
        # اختبار محادثة بسيطة
        response = gemini.chat(
            messages=[
                {'role': 'user', 'content': 'مرحباً، كيف حالك؟'}
            ]
        )
        print(f"\nالرد: {response['message']}")
        
    except Exception as e:
        print(f"❌ خطأ: {str(e)}")
        sys.exit(1)

