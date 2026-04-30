from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import Response
from services.voice_service import voice_service
from services.gemini_service import explain_rights
from services.auth_service import verify_token
from pydantic import BaseModel

router = APIRouter(prefix="/voice", tags=["voice"])

class TTSRequest(BaseModel):
    text: str

@router.post("/query")
async def voice_query(
    file: UploadFile = File(...),
    user: dict = Depends(verify_token)
):
    """
    Ingests audio, transcribes it, and processes it via Gemini.
    """
    try:
        audio_content = await file.read()
        
        # 1. STT
        transcript = voice_service.transcribe_audio(audio_content, content_type=file.content_type)
        if not transcript:
            raise HTTPException(status_code=400, detail="Could not understand audio. Please speak clearly.")

        # 2. Gemini Analysis
        ai_response = await explain_rights(transcript)

        return {
            "transcript": transcript,
            "response": ai_response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/synthesize")
async def synthesize_response(
    request: TTSRequest,
    user: dict = Depends(verify_token)
):
    """
    Converts text response to speech.
    """
    try:
        audio_content = voice_service.synthesize_speech(request.text)
        if not audio_content:
            raise HTTPException(status_code=500, detail="Failed to synthesize speech.")
            
        return Response(content=audio_content, media_type="audio/mp3")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
