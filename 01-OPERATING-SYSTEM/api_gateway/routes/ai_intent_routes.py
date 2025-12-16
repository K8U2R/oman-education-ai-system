"""
AI Intent Routes - مسارات تحليل نية المستخدم مع الذكاء الاصطناعي

توفر هذه الوحدة مساراً متقدماً يدمج بين:
- الحصول على رد المحادثة من نموذج الذكاء الاصطناعي (Gemini حالياً)
- تحليل نية المستخدم واقتراح صفحة/مسار مناسب داخل النظام

الاستجابة تكون منظمة لتسهيل استخدامها في الواجهة الأمامية.
"""

from __future__ import annotations

import json
from typing import Any, Dict, List, Optional
from datetime import datetime
from pathlib import Path
import sys
import logging

from fastapi import APIRouter, HTTPException, Body, Request
from pydantic import BaseModel, Field

# تضمين جذر المشروع في المسار
current_file = Path(__file__).resolve()
project_root = current_file.parent.parent.parent.parent
sys.path.insert(0, str(project_root))

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/ai", tags=["AI-Intent"])


class AIMessage(BaseModel):
    role: str = Field(..., description="Role: user, assistant, or system")
    content: str = Field(..., description="Message content")


class IntentChatRequest(BaseModel):
    messages: List[AIMessage] = Field(..., description="Full chat history including latest user message")
    model: Optional[str] = Field(None, description="Model name")
    temperature: Optional[float] = Field(0.7, ge=0.0, le=1.0, description="Temperature")
    max_tokens: Optional[int] = Field(1024, description="Maximum tokens for reply")
    provider: Optional[str] = Field("gemini", description="AI Provider: gemini, openai, anthropic")
    api_key: Optional[str] = Field(None, description="API Key (optional, can use env var)")


class IntentSuggestion(BaseModel):
    intent_type: Optional[str] = Field(
        None,
        description="High level intent (create_project, create_office, manage_files, code_help, settings, other)",
    )
    confidence: Optional[float] = Field(
        None,
        description="Confidence score between 0 and 1",
    )
    suggested_path: Optional[str] = Field(None, description="Suggested frontend path (e.g. /projects/new)")
    suggested_title: Optional[str] = Field(None, description="Suggested navigation title")
    suggested_description: Optional[str] = Field(None, description="Suggested navigation description")


class IntentChatResponse(BaseModel):
    message: str = Field(..., description="Assistant reply text to show in chat")
    usage: Optional[Dict[str, Any]] = None
    model: Optional[str] = None
    timestamp: Optional[str] = None
    intent: Optional[IntentSuggestion] = None


def _load_gemini_integration(api_key: Optional[str] = None) -> Any:
    """
    تحميل تكامل Gemini بنفس الأسلوب المستخدم في ai_routes.py
    """
    try:
        import importlib.util
        import os

        # جذر المشروع: oman-education-ai-system
        # ai_intent_routes.py is at: 01-OPERATING-SYSTEM/api_gateway/routes/ai_intent_routes.py
        # Go up 4 levels: routes -> api_gateway -> 01-OPERATING-SYSTEM -> oman-education-ai-system
        project_root = current_file.parent.parent.parent.parent
        sys.path.insert(0, str(project_root))

        gemini_path = project_root / "17-EXTERNAL-INTEGRATIONS" / "ai-services" / "gemini-integration.py"
        if not gemini_path.exists():
            raise FileNotFoundError(f"Gemini integration file not found: {gemini_path}")

        spec = importlib.util.spec_from_file_location("gemini_integration", gemini_path)
        if spec is None or spec.loader is None:
            raise ImportError("Could not load gemini_integration module")

        gemini_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(gemini_module)
        GeminiIntegration = getattr(gemini_module, "GeminiIntegration")

        key = api_key or os.getenv("GEMINI_API_KEY")
        if not key:
            raise HTTPException(
                status_code=401,
                detail={
                    "error": "gemini_api_key_missing",
                    "message": "مفتاح Gemini API غير موجود. يرجى إضافته إلى ملف .env كـ GEMINI_API_KEY أو متغيرات البيئة.",
                    "help_url": "https://ai.google.dev/docs"
                }
            )

        # التحقق من أن المفتاح ليس فارغاً أو placeholder
        if key.strip() == "" or key.lower() in ["your-api-key-here", "your_key_here", "your_key"]:
            raise HTTPException(
                status_code=401,
                detail={
                    "error": "gemini_api_key_invalid",
                    "message": "مفتاح Gemini API غير صحيح. يرجى استخدام مفتاح صحيح من Google Cloud Console.",
                    "help_url": "https://console.cloud.google.com/apis/credentials"
                }
            )

        return GeminiIntegration(api_key=key)
    except HTTPException:
        # إعادة رفع HTTPException كما هي
        raise
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Failed to initialize Gemini for intent endpoint: {e}")
        
        # معالجة أخطاء محددة
        if "GEMINI_API_KEY" in error_msg or "API key" in error_msg.lower() or "API Key" in error_msg:
            raise HTTPException(
                status_code=401,
                detail={
                    "error": "gemini_api_key_missing",
                    "message": "مفتاح Gemini API غير موجود. يرجى إضافته إلى ملف .env كـ GEMINI_API_KEY.",
                    "help_url": "https://ai.google.dev/docs"
                }
            )
        
        raise HTTPException(
            status_code=500,
            detail={
                "error": "gemini_initialization_failed",
                "message": f"فشل في تهيئة Gemini: {error_msg[:200]}",
                "original_error": error_msg[:200]
            }
        )


@router.post("/intent-chat", response_model=IntentChatResponse)
async def intent_chat(request: Request, intent_request: IntentChatRequest = Body(...)) -> IntentChatResponse:
    """
    مسار متقدم لإرسال رسالة إلى الذكاء الاصطناعي والحصول على:
    - رد المحادثة
    - تحليل نية المستخدم
    - اقتراح صفحة/مسار مناسب

    يستخدم حالياً مزود Gemini فقط.
    """
    provider = intent_request.provider or "gemini"

    if provider != "gemini":
        # يمكن دعم مزودين آخرين لاحقاً بنفس النمط
        raise HTTPException(
            status_code=400,
            detail=f"Provider {provider} not supported yet for intent-chat",
        )

    try:
        # التحقق من وجود API Key قبل المحاولة
        import os
        api_key = intent_request.api_key or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=401,
                detail={
                    "error": "gemini_api_key_missing",
                    "message": "مفتاح Gemini API غير موجود. يرجى إضافته إلى ملف .env كـ GEMINI_API_KEY.",
                    "help_url": "https://ai.google.dev/docs"
                }
            )
        
        logger.info(f"استخدام Gemini API Key (الطول: {len(api_key)} حرف)")
        gemini = _load_gemini_integration(api_key=api_key)

        # نص نظام يحدد شكل الاستجابة
        system_prompt = """
أنت مساعد ذكاء اصطناعي لنظام تعليم ذكي.
مهمتك:
1) الرد على رسالة المستخدم بشكل مفيد بالعربية (حقل: assistant_reply).
2) تحليل نية المستخدم واقتراح تنقل داخل النظام إن كان مناسباً.

يجب أن تكون استجابتك JSON صالح فقط بدون أي نص إضافي،
وبالبنية التالية تماماً (حتى لو كانت بعض الحقول فارغة):

{
  "assistant_reply": "نص الرد للمستخدم هنا",
  "intent_type": "create_project | create_office | manage_files | code_help | view_projects | settings | other",
  "confidence": 0.0,
  "suggested_path": "/projects/new أو مسار آخر أو null",
  "suggested_title": "عنوان قصير للاقتراح أو null",
  "suggested_description": "وصف قصير للاقتراح أو null"
}

القواعد:
- إذا لم تكن متأكداً من النية، استخدم intent_type = "other" و confidence = 0.0 ولا تقترح مساراً.
- إذا كانت الرسالة تتعلق بمشاريع برمجية جديدة، استخدم intent_type = "create_project" واقترح المسار "/projects/new".
- إذا كانت الرسالة عن ملفات Office (Word/Excel/PowerPoint)، استخدم intent_type = "create_office" مع المسار "/office" أو "/office?app=word" ... إلخ.
- إذا كانت عن إدارة الملفات أو استعراض المشاريع، استخدم "manage_files" أو "view_projects" مع مسار "/projects".
- إذا كانت عن مشاكل كود أو شرح كود، استخدم "code_help".
- إذا كانت عن الإعدادات، استخدم "settings" مع المسار "/settings".
- assistant_reply يجب أن يكون موجهاً للمستخدم بالعربية.
"""

        # تحويل الرسائل إلى صيغة متوافقة مع GeminiIntegration.chat
        messages = [
            {"role": msg.role, "content": msg.content}
            for msg in intent_request.messages
        ]

        raw_response = gemini.chat(
            messages=messages,
            model=intent_request.model,
            temperature=intent_request.temperature or 0.7,
            max_tokens=intent_request.max_tokens or 1024,
            system_prompt=system_prompt,
        )

        raw_text = raw_response.get("message", "") or ""

        # محاولة قراءة JSON من رد النموذج
        intent_data: Dict[str, Any] = {}
        assistant_reply = raw_text

        try:
            intent_data = json.loads(raw_text)
            if isinstance(intent_data, dict) and "assistant_reply" in intent_data:
                assistant_reply = str(intent_data.get("assistant_reply") or "").strip() or assistant_reply
        except json.JSONDecodeError:
            # إذا لم يكن JSON صالحاً، نستخدم النص كهو
            logger.warning("Gemini intent-chat response is not valid JSON; returning raw text as message")

        intent_suggestion: Optional[IntentSuggestion] = None
        if isinstance(intent_data, dict):
            intent_suggestion = IntentSuggestion(
                intent_type=intent_data.get("intent_type"),
                confidence=intent_data.get("confidence"),
                suggested_path=intent_data.get("suggested_path"),
                suggested_title=intent_data.get("suggested_title"),
                suggested_description=intent_data.get("suggested_description"),
            )

        return IntentChatResponse(
            message=assistant_reply or raw_text or "لم يتم استلام رد من خدمة الذكاء الاصطناعي.",
            usage=raw_response.get("usage"),
            model=raw_response.get("model"),
            timestamp=raw_response.get("timestamp") or datetime.now().isoformat(),
            intent=intent_suggestion,
        )

    except HTTPException:
        raise
    except Exception as e:
        error_message = str(e)
        logger.error(f"Error in intent-chat endpoint: {e}", exc_info=True)
        
        # معالجة أخطاء Gemini API المحددة
        if "SERVICE_DISABLED" in error_message or "403" in error_message:
            # استخراج رابط التفعيل إن وجد
            activation_url = None
            if "activationUrl" in error_message or "console.developers.google.com" in error_message:
                import re
                url_match = re.search(r'https://console\.developers\.google\.com[^\s\)]+', error_message)
                if url_match:
                    activation_url = url_match.group(0)
            
            detail_message = "Gemini API غير مفعّل في مشروع Google Cloud الخاص بك."
            if activation_url:
                detail_message += f" يرجى تفعيله من هنا: {activation_url}"
            else:
                detail_message += " يرجى تفعيل Generative Language API من Google Cloud Console."
            
            raise HTTPException(
                status_code=503,
                detail={
                    "error": "gemini_api_disabled",
                    "message": detail_message,
                    "activation_url": activation_url,
                    "original_error": error_message[:200]  # أول 200 حرف فقط
                }
            )
        elif "GEMINI_API_KEY" in error_message or "API key" in error_message.lower():
            raise HTTPException(
                status_code=401,
                detail={
                    "error": "gemini_api_key_missing",
                    "message": "مفتاح Gemini API غير موجود أو غير صحيح. يرجى التحقق من متغير البيئة GEMINI_API_KEY.",
                    "original_error": error_message[:200]
                }
            )
        else:
            # خطأ عام
            raise HTTPException(
                status_code=500,
                detail={
                    "error": "internal_server_error",
                    "message": f"خطأ داخلي في الخادم: {error_message[:200]}",
                    "original_error": error_message[:200]
                }
            )


