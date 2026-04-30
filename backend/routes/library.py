import os
import json
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/library", tags=["library"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return None
    with open(path, "r") as f:
        return json.load(f)

@router.get("/categories")
async def get_categories():
    return [
        {"id": "constitution", "name": "Constitution of India", "path": "constitution.json"},
        {"id": "criminal", "name": "Criminal Law", "sub_laws": [
            {"id": "ipc", "name": "Indian Penal Code", "path": "criminal/ipc.json"},
            {"id": "crpc", "name": "CrPC", "path": "criminal/crpc.json"}
        ]},
        {"id": "civil", "name": "Civil Law", "sub_laws": [
            {"id": "contract", "name": "Contract Act", "path": "civil/contract.json"}
        ]},
        {"id": "labour", "name": "Labour Law", "sub_laws": [
            {"id": "wages", "name": "Minimum Wages Act", "path": "labour/wages.json"}
        ]},
        {"id": "cyber", "name": "Cyber Law", "sub_laws": [
            {"id": "it_act", "name": "IT Act, 2000", "path": "cyber/it_act.json"}
        ]},
        {"id": "consumer", "name": "Consumer Law", "sub_laws": [
            {"id": "consumer_act", "name": "Consumer Protection Act", "path": "consumer/consumer_protection.json"}
        ]}
    ]

@router.get("/law")
async def get_law(path: str):
    data = load_json(path)
    if not data:
        raise HTTPException(status_code=404, detail="Law data not found")
    return data

@router.get("/search")
async def search_library(q: str):
    q = q.lower()
    results = []
    
    def search_file(filename, category_name):
        data = load_json(filename)
        if not data: return
        
        # Handle Constitution structure
        if "parts" in data:
            for part in data["parts"]:
                for art in part["articles"]:
                    if q in art["article"].lower() or q in art["title"].lower() or q in art["summary"].lower():
                        results.append({**art, "category": category_name})
        
        # Handle Chapter/Section structure
        if "chapters" in data:
            for chap in data["chapters"]:
                for sec in chap["sections"]:
                    if q in sec["section"].lower() or q in sec["title"].lower() or q in sec["summary"].lower():
                        results.append({**sec, "category": category_name})

    search_file("constitution.json", "Constitution")
    search_file("criminal/ipc.json", "Criminal Law")
    search_file("civil/contract.json", "Civil Law")
                
    return results
