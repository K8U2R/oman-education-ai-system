"""
AI Routes - مسارات الذكاء الاصطناعي
API routes for AI services (Gemini, OpenAI, Anthropic)
"""

import os
import sys
from pathlib import Path
from fastapi import APIRouter, HTTPException, Request, Body
from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
import logging

# Add parent directories to path
# Calculate project root: go up from ai_routes.py
# ai_routes.py is at: 01-OPERATING-SYSTEM/api_gateway/routes/ai_routes.py
# Go up 4 levels: routes -> api_gateway -> 01-OPERATING-SYSTEM -> oman-education-ai-system
current_file = Path(__file__).resolve()
project_root = current_file.parent.parent.parent.parent
sys.path.insert(0, str(project_root))

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/ai", tags=["AI"])


# Pydantic Models
class AIMessage(BaseModel):
    role: str = Field(..., description="Role: user, assistant, or system")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    messages: List[AIMessage] = Field(..., description="List of messages")
    model: Optional[str] = Field(None, description="Model name")
    temperature: Optional[float] = Field(0.7, ge=0.0, le=1.0, description="Temperature")
    max_tokens: Optional[int] = Field(None, description="Maximum tokens")
    provider: Optional[str] = Field("gemini", description="AI Provider: gemini, openai, anthropic")
    api_key: Optional[str] = Field(None, description="API Key (optional, can use env var)")


class ChatResponse(BaseModel):
    message: str
    usage: Optional[Dict[str, Any]] = None
    model: Optional[str] = None
    timestamp: Optional[str] = None


class CodeGenerationRequest(BaseModel):
    prompt: str = Field(..., description="Code generation prompt")
    language: str = Field("python", description="Programming language")
    model: Optional[str] = None
    provider: Optional[str] = Field("gemini", description="AI Provider")
    api_key: Optional[str] = None


class CodeExplanationRequest(BaseModel):
    code: str = Field(..., description="Code to explain")
    language: str = Field("python", description="Programming language")
    model: Optional[str] = None
    provider: Optional[str] = Field("gemini", description="AI Provider")
    api_key: Optional[str] = None


# AI Integration Manager
class AIManager:
    """Manager for AI integrations"""
    
    def __init__(self):
        self.gemini_integration = None
        self.openai_integration = None
        self.anthropic_integration = None
    
    def get_gemini(self, api_key: Optional[str] = None) -> Any:
        """Get or create Gemini integration"""
        try:
            import sys
            from pathlib import Path
            import importlib.util
            import os
            # Add project root to path
            # Calculate project root: go up from ai_routes.py to project root
            # ai_routes.py is at: 01-OPERATING-SYSTEM/api_gateway/routes/ai_routes.py
            current_file = Path(__file__).resolve()  # Get absolute path
            # Go up: routes -> api_gateway -> 01-OPERATING-SYSTEM -> oman-education-ai-system (project_root)
            # We need to go up 4 levels from ai_routes.py
            project_root = current_file.parent.parent.parent.parent
            sys.path.insert(0, str(project_root))
            # Load gemini integration module
            gemini_path = project_root / "17-EXTERNAL-INTEGRATIONS" / "ai-services" / "gemini-integration.py"
            if not gemini_path.exists():
                raise FileNotFoundError(f"Gemini integration file not found: {gemini_path}")
            spec = importlib.util.spec_from_file_location("gemini_integration", gemini_path)
            gemini_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(gemini_module)
            GeminiIntegration = gemini_module.GeminiIntegration
            
            key = api_key or os.getenv('GEMINI_API_KEY')
            if not key:
                raise ValueError("GEMINI_API_KEY not found")
            
            if not self.gemini_integration or self.gemini_integration.api_key != key:
                self.gemini_integration = GeminiIntegration(api_key=key)
            
            return self.gemini_integration
        except Exception as e:
            logger.error(f"Failed to initialize Gemini: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to initialize Gemini: {str(e)}")
    
    def get_openai(self, api_key: Optional[str] = None) -> Any:
        """Get or create OpenAI integration"""
        # TODO: Implement OpenAI integration
        raise HTTPException(status_code=501, detail="OpenAI integration not yet implemented")
    
    def get_anthropic(self, api_key: Optional[str] = None) -> Any:
        """Get or create Anthropic integration"""
        # TODO: Implement Anthropic integration
        raise HTTPException(status_code=501, detail="Anthropic integration not yet implemented")


# Global AI Manager
ai_manager = AIManager()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: Request, chat_request: ChatRequest = Body(...)) -> ChatResponse:
    """
    Send a chat message to AI
    
    Args:
        chat_request: Chat request with messages and options
    
    Returns:
        AI response
    """
    try:
        provider = chat_request.provider or "gemini"
        
        if provider == "gemini":
            gemini = ai_manager.get_gemini(api_key=chat_request.api_key)
            
            # Convert messages to dict format
            messages = [
                {"role": msg.role, "content": msg.content}
                for msg in chat_request.messages
            ]
            
            response = gemini.chat(
                messages=messages,
                model=chat_request.model,
                temperature=chat_request.temperature,
                max_tokens=chat_request.max_tokens,
            )
            
            return ChatResponse(
                message=response.get('message', ''),
                usage=response.get('usage'),
                model=response.get('model'),
                timestamp=response.get('timestamp'),
            )
        
        elif provider == "openai":
            raise HTTPException(status_code=501, detail="OpenAI integration not yet implemented")
        
        elif provider == "anthropic":
            raise HTTPException(status_code=501, detail="Anthropic integration not yet implemented")
        
        else:
            raise HTTPException(status_code=400, detail=f"Unknown provider: {provider}")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/generate-code")
async def generate_code(
    request: Request,
    code_request: CodeGenerationRequest = Body(...)
) -> Dict[str, Any]:
    """
    Generate code based on prompt
    
    Args:
        code_request: Code generation request
    
    Returns:
        Generated code
    """
    try:
        provider = code_request.provider or "gemini"
        
        if provider == "gemini":
            gemini = ai_manager.get_gemini(api_key=code_request.api_key)
            
            code = gemini.generate_code(
                prompt=code_request.prompt,
                language=code_request.language,
                model=code_request.model,
            )
            
            return {
                "status": "success",
                "code": code,
                "language": code_request.language,
                "provider": provider,
                "timestamp": datetime.now().isoformat(),
            }
        
        else:
            raise HTTPException(status_code=400, detail=f"Provider {provider} not supported for code generation")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in generate-code endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/explain-code")
async def explain_code(
    request: Request,
    explain_request: CodeExplanationRequest = Body(...)
) -> Dict[str, Any]:
    """
    Explain code
    
    Args:
        explain_request: Code explanation request
    
    Returns:
        Code explanation
    """
    try:
        provider = explain_request.provider or "gemini"
        
        if provider == "gemini":
            gemini = ai_manager.get_gemini(api_key=explain_request.api_key)
            
            explanation = gemini.explain_code(
                code=explain_request.code,
                language=explain_request.language,
                model=explain_request.model,
            )
            
            return {
                "status": "success",
                "explanation": explanation,
                "language": explain_request.language,
                "provider": provider,
                "timestamp": datetime.now().isoformat(),
            }
        
        else:
            raise HTTPException(status_code=400, detail=f"Provider {provider} not supported for code explanation")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in explain-code endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/models")
async def list_models(
    request: Request,
    provider: Optional[str] = "gemini"
) -> Dict[str, Any]:
    """
    List available models for a provider
    
    Args:
        provider: AI provider name
    
    Returns:
        List of available models
    """
    try:
        if provider == "gemini":
            gemini = ai_manager.get_gemini()
            models = gemini.get_available_models()
            
            return {
                "status": "success",
                "provider": provider,
                "models": models,
                "timestamp": datetime.now().isoformat(),
            }
        
        else:
            raise HTTPException(status_code=400, detail=f"Provider {provider} not supported")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in models endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/test-connection")
async def test_connection(
    request: Request,
    provider: Optional[str] = "gemini",
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Test connection to AI provider
    
    Args:
        provider: AI provider name
        api_key: API key (optional)
    
    Returns:
        Connection test result
    """
    try:
        if provider == "gemini":
            gemini = ai_manager.get_gemini(api_key=api_key)
            is_connected = gemini.test_connection()
            
            return {
                "status": "success" if is_connected else "failed",
                "provider": provider,
                "connected": is_connected,
                "timestamp": datetime.now().isoformat(),
            }
        
        else:
            raise HTTPException(status_code=400, detail=f"Provider {provider} not supported")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in test-connection endpoint: {str(e)}", exc_info=True)
        return {
            "status": "failed",
            "provider": provider,
            "connected": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
        }

