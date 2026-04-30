from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from services.gemini_service import explain_rights
from services.auth_service import verify_token

router = APIRouter()

class QueryRequest(BaseModel):
    query: str

@router.post("/ask")
async def ask_question(request: QueryRequest, user: dict = Depends(verify_token)):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    try:
        response = await explain_rights(request.query)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
