import os
import logging
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import Features, EmotionOptions, SentimentOptions
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("NLUService")

class NLUService:
    def __init__(self):
        self.api_key = os.environ.get("WATSON_NLU_API_KEY")
        self.service_url = os.environ.get("WATSON_NLU_SERVICE_URL")
        
        if not self.api_key or not self.service_url:
            logger.warning("IBM Watson NLU credentials missing. Tone detection will be disabled.")
            self.client = None
        else:
            authenticator = IAMAuthenticator(self.api_key)
            self.client = NaturalLanguageUnderstandingV1(
                version='2022-04-07',
                authenticator=authenticator
            )
            self.client.set_service_url(self.service_url)

    def analyze_tone(self, text: str) -> dict:
        """
        Analyzes the emotional tone of the legal document using IBM Watson NLU.
        Maps the output to deterministic legal categories.
        """
        if not self.client:
            return {"tone": "Unknown", "explanation": "NLU Service not configured"}

        if not text.strip():
            return {"tone": "Neutral", "explanation": "Empty text provided"}

        # Limit text to 5000 characters to stay within NLU limits for a single call
        text_to_analyze = text[:5000]

        try:
            response = self.client.analyze(
                text=text_to_analyze,
                features=Features(
                    emotion=EmotionOptions(),
                    sentiment=SentimentOptions()
                )
            ).get_result()

            emotion = response.get('emotion', {}).get('document', {}).get('emotion', {})
            sentiment = response.get('sentiment', {}).get('document', {})
            
            score = sentiment.get('score', 0)
            label = sentiment.get('label', 'neutral')

            # Extract emotions
            anger = emotion.get('anger', 0)
            fear = emotion.get('fear', 0)
            sadness = emotion.get('sadness', 0)
            joy = emotion.get('joy', 0)
            disgust = emotion.get('disgust', 0)

            # Tone Classification Logic (as per requirements)
            if anger > 0.5 or score < -0.6:
                tone = "Aggressive"
                explanation = "The document contains forceful or one-sided language."
            elif fear > 0.4:
                tone = "Strict"
                explanation = "The document outlines rigid and restrictive conditions."
            elif -0.6 <= score <= -0.2:
                tone = "Biased"
                explanation = "The language appears to favor one party over the other."
            else:
                tone = "Neutral"
                explanation = "The document maintains a balanced and professional tone."

            return {
                "tone": tone,
                "explanation": explanation,
                "raw_metrics": {
                    "sentiment_score": score,
                    "anger": round(anger, 2),
                    "fear": round(fear, 2),
                    "sentiment_label": label
                }
            }

        except Exception as e:
            logger.error(f"Watson NLU Analysis failed: {str(e)}")
            return {"tone": "Unknown", "explanation": "Could not determine tone reliably"}

# Singleton instance
nlu_service = NLUService()
