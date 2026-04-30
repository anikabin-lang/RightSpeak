from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import Optional
from utils.file_parser import parse_file
from utils.text_utils import chunk_text
from services.gemini_service import analyze_document_chunk, merge_analysis_results
from services.auth_service import verify_token
from services.nlu_service import nlu_service
import asyncio

router = APIRouter(prefix="/analyze", tags=["analysis"])

@router.post("")
async def analyze_document(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    user: dict = Depends(verify_token)
):
    """
    Analyzes a document (file or text) and returns a structured summary.
    """
    document_text = ""
    
    if file:
        try:
            content = await file.read()
            document_text = parse_file(content, file.filename)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")
    elif text:
        document_text = text
    else:
        raise HTTPException(status_code=400, detail="No file or text provided")

    if not document_text.strip():
        raise HTTPException(status_code=400, detail="Extracted text is empty")

    # 1. Chunking
    chunks = chunk_text(document_text)
    
    # 2. Parallel Processing: Gemini (Chunks) and Watson NLU (Full text or first 5k)
    from services.gemini_service import manager
    key_for_request = await manager.get_next_key()
    
    # Create tasks for parallel execution
    gemini_tasks = [analyze_document_chunk(chunk, key_obj=key_for_request) for chunk in chunks]
    
    # We run NLU in a thread pool since the IBM SDK is synchronous
    loop = asyncio.get_event_loop()
    nlu_task = loop.run_in_executor(None, nlu_service.analyze_tone, document_text)
    
    # Wait for everything
    chunk_results = await asyncio.gather(*gemini_tasks)
    tone_result = await nlu_task
    
    # 3. Merging results
    final_result = merge_analysis_results(chunk_results)
    final_result["tone_analysis"] = tone_result
    
    return final_result
