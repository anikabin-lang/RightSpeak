import os
import json
import asyncio
import hashlib
import logging
import time
from typing import List, Optional, Dict
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Logging Configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("GeminiService")

class GeminiKey:
    """Represents an individual API key with health and client instance."""
    def __init__(self, key: str, index: int):
        self.key = key
        self.index = index
        self.key_hash = hashlib.sha256(key.encode()).hexdigest()[:8]
        self.is_healthy = True
        self.cooldown_until = 0
        self.error_count = 0
        self.request_count = 0
        # Initialize a dedicated client for this key
        self.client = genai.Client(api_key=self.key)

    def mark_failed(self, cooldown_seconds: int = 60):
        self.is_healthy = False
        self.cooldown_until = time.time() + cooldown_seconds
        self.error_count += 1
        logger.warning(f"Key [{self.key_hash}] (Index {self.index}) marked unhealthy for {cooldown_seconds}s")

    def check_health(self) -> bool:
        if not self.is_healthy and time.time() > self.cooldown_until:
            self.is_healthy = True
            logger.info(f"Key [{self.key_hash}] cooldown expired. Re-entering rotation.")
        return self.is_healthy

class GeminiMultiKeyManager:
    """Manager for rotating and failing over across multiple Gemini API keys using the modern google-genai SDK."""
    
    def __init__(self):
        # Load keys from environment variable
        raw_keys = os.environ.get("GEMINI_API_KEYS", "").split(",")
        self.keys: List[GeminiKey] = [GeminiKey(k.strip(), i) for i, k in enumerate(raw_keys) if k.strip()]
        
        if not self.keys:
            single_key = os.environ.get("GEMINI_API_KEY")
            if single_key:
                self.keys = [GeminiKey(single_key, 0)]
            else:
                raise RuntimeError("No Gemini API keys found in environment variables.")

        self._current_index = 0
        self._lock = asyncio.Lock()
        self.model_name = os.environ.get("GEMINI_MODEL", "gemini-3-flash-preview")
        logger.info(f"MultiKeyManager (google-genai) initialized with {len(self.keys)} keys.")

    async def _get_next_key(self) -> GeminiKey:
        async with self._lock:
            for _ in range(len(self.keys)):
                key = self.keys[self._current_index]
                self._current_index = (self._current_index + 1) % len(self.keys)
                
                if key.check_health():
                    return key
            
            raise RuntimeError("All Gemini API keys are currently exhausted or unhealthy.")

    async def get_next_key(self) -> GeminiKey:
        """Expose key selection for multi-step operations like document analysis."""
        return await self._get_next_key()

    async def call_gemini(self, prompt: str, generation_config: Optional[Dict] = None, forced_key: Optional[GeminiKey] = None) -> dict:
        """Call Gemini API using an instance-based client for thread-safety and accurate usage tracking."""
        attempts = 0
        max_attempts = min(len(self.keys), 3) # Retry up to 3 different keys per request
        
        last_error = None
        while attempts < max_attempts:
            if forced_key and attempts == 1:
                key_obj = forced_key
            else:
                key_obj = await self._get_next_key()
            
            attempts += 1
            start_time = time.perf_counter()
            
            try:
                # Use the dedicated async client for this key
                # This ensures no race conditions between parallel requests
                response = await key_obj.client.aio.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json"
                    )
                )
                
                latency = time.perf_counter() - start_time
                key_obj.request_count += 1
                
                logger.info(json.dumps({
                    "event": "request_success",
                    "key_id": key_obj.key_hash,
                    "latency_ms": round(latency * 1000, 2),
                    "attempt": attempts
                }))

                # Extract and parse JSON
                generated_text = response.text
                return json.loads(generated_text)

            except Exception as e:
                last_error = str(e)
                key_obj.mark_failed(cooldown_seconds=60)
                
                logger.error(json.dumps({
                    "event": "request_failure",
                    "key_id": key_obj.key_hash,
                    "error": last_error,
                    "attempt": attempts
                }))
                
                if attempts >= max_attempts:
                    break
        
        raise RuntimeError(f"Gemini API failed after {attempts} attempts. Last error: {last_error}")

# Singleton Instance
manager = GeminiMultiKeyManager()

# --- Public API for the application ---

PROMPT_TEMPLATE = """You are a legal assistant for Indian law.

Explain the user's legal question in plain language.

Return JSON:
{{
  "plain_explanation": "string",
  "key_rights": ["string"],
  "relevant_laws": ["string"],
  "next_steps": ["string"],
  "disclaimer": "string"
}}

User question:
{query}"""

DOCUMENT_ANALYSIS_PROMPT = '''You are a legal assistant specialized in simplifying documents. 
Analyze the following section of a legal document and return output in STRICT JSON format.

Document Section:
"""{document_text}"""

Return JSON with exactly these keys:
{{
  "key_clauses": ["list of important clauses found in this section"],
  "red_flags": ["list of potential risks or unfair terms found in this section"],
  "what_it_means": "a plain-language summary of what this section covers",
  "suggested_actions": ["practical steps the user should take based on this section"]
}}
'''

async def analyze_document_chunk(text: str, key_obj: Optional[GeminiKey] = None) -> dict:
    """Analyze a single chunk of document text using the Multi-Key Manager."""
    prompt = DOCUMENT_ANALYSIS_PROMPT.format(document_text=text)
    try:
        return await manager.call_gemini(prompt, forced_key=key_obj)
    except Exception as e:
        logger.error(f"Error analyzing chunk: {e}")
        return {
            "key_clauses": [],
            "red_flags": [],
            "what_it_means": f"Error during analysis: {str(e)}",
            "suggested_actions": []
        }

def merge_analysis_results(results: list[dict]) -> dict:
    """Merges multiple chunk analysis results into a single structured output."""
    merged = {
        "key_clauses": [],
        "red_flags": [],
        "what_it_means": "",
        "suggested_actions": []
    }
    summaries = []
    for res in results:
        merged["key_clauses"].extend(res.get("key_clauses", []))
        merged["red_flags"].extend(res.get("red_flags", []))
        merged["suggested_actions"].extend(res.get("suggested_actions", []))
        if res.get("what_it_means"):
            summaries.append(res["what_it_means"])

    merged["key_clauses"] = list(dict.fromkeys(merged["key_clauses"]))
    merged["red_flags"] = list(dict.fromkeys(merged["red_flags"]))
    merged["suggested_actions"] = list(dict.fromkeys(merged["suggested_actions"]))
    merged["what_it_means"] = " ".join(summaries)
    return merged

async def explain_rights(query: str) -> dict:
    """Process a legal rights query using the Multi-Key Manager."""
    prompt = PROMPT_TEMPLATE.format(query=query)
    try:
        return await manager.call_gemini(prompt)
    except Exception as e:
        raise Exception(f"Failed to process with Gemini: {str(e)}")
