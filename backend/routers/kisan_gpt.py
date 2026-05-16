from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from services.kisan_gpt_service import KisanGPTService
from services.voice_service import VoiceService
from services.translation_service import TranslationService
from models.chat_models import ChatMessage, ChatResponse, VoiceMessage
from utils.auth import get_current_user

router = APIRouter()

# Initialize services
kisan_gpt = KisanGPTService()
voice_service = VoiceService()
translator = TranslationService()

class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    context: Optional[Dict[str, Any]] = None
    location: Optional[Dict[str, float]] = None

class VoiceRequest(BaseModel):
    audio_data: str  # base64 encoded audio
    language: str = "hi"

@router.post("/chat", response_model=ChatResponse)
async def chat_with_kisan_gpt(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Chat with KisanGPT for farming guidance and advice
    """
    try:
        # Get user context (crops, location, farming history)
        user_context = {
            "user_id": current_user["user_id"],
            "location": request.location,
            "farming_profile": current_user.get("farming_profile", {}),
            "chat_context": request.context
        }
        
        # Process message through KisanGPT
        response = await kisan_gpt.process_message(
            message=request.message,
            language=request.language,
            context=user_context
        )
        
        return ChatResponse(
            response=response["message"],
            suggestions=response.get("suggestions", []),
            related_topics=response.get("related_topics", []),
            confidence=response.get("confidence", 0.9),
            sources=response.get("sources", [])
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@router.post("/voice-chat")
async def voice_chat_with_kisan_gpt(
    request: VoiceRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Voice-based interaction with KisanGPT
    """
    try:
        # Convert speech to text
        text_message = await voice_service.speech_to_text(
            request.audio_data,
            request.language
        )
        
        # Process through KisanGPT
        user_context = {
            "user_id": current_user["user_id"],
            "farming_profile": current_user.get("farming_profile", {})
        }
        
        response = await kisan_gpt.process_message(
            message=text_message,
            language=request.language,
            context=user_context
        )
        
        # Convert response to speech
        audio_response = await voice_service.text_to_speech(
            response["message"],
            request.language
        )
        
        return {
            "text_input": text_message,
            "text_response": response["message"],
            "audio_response": audio_response,  # base64 encoded audio
            "suggestions": response.get("suggestions", [])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing voice chat: {str(e)}")

@router.get("/topics")
async def get_farming_topics(
    category: Optional[str] = None,
    language: str = "en"
):
    """
    Get available farming topics and categories
    """
    try:
        topics = await kisan_gpt.get_available_topics(category)
        
        if language != "en":
            topics = await translator.translate_topics(topics, language)
        
        return {"topics": topics}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/quick-answers")
async def get_quick_answers(
    query_type: str,  # crops, fertilizers, irrigation, schemes, prices
    language: str = "en",
    location: Optional[str] = None
):
    """
    Get quick answers for common farming queries
    """
    try:
        answers = await kisan_gpt.get_quick_answers(
            query_type=query_type,
            language=language,
            location=location
        )
        
        return {"query_type": query_type, "answers": answers}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feedback")
async def submit_chat_feedback(
    chat_id: str,
    rating: int,  # 1-5
    feedback: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Submit feedback for chat responses to improve KisanGPT
    """
    try:
        await kisan_gpt.submit_feedback(
            chat_id=chat_id,
            user_id=current_user["user_id"],
            rating=rating,
            feedback=feedback
        )
        
        return {"message": "Feedback submitted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))