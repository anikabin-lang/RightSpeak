import os
import logging
from ibm_watson import SpeechToTextV1, TextToSpeechV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("VoiceService")

class VoiceService:
    def __init__(self):
        # STT Config
        self.stt_api_key = os.environ.get("IBM_STT_API_KEY")
        self.stt_url = os.environ.get("IBM_STT_URL")
        
        # TTS Config
        self.tts_api_key = os.environ.get("IBM_TTS_API_KEY")
        self.tts_url = os.environ.get("IBM_TTS_URL")

        self.stt_client = self._init_stt()
        self.tts_client = self._init_tts()

    def _init_stt(self):
        if not self.stt_api_key or not self.stt_url:
            logger.warning("IBM STT credentials missing.")
            return None
        authenticator = IAMAuthenticator(self.stt_api_key)
        client = SpeechToTextV1(authenticator=authenticator)
        client.set_service_url(self.stt_url)
        return client

    def _init_tts(self):
        if not self.tts_api_key or not self.tts_url:
            logger.warning("IBM TTS credentials missing.")
            return None
        authenticator = IAMAuthenticator(self.tts_api_key)
        client = TextToSpeechV1(authenticator=authenticator)
        client.set_service_url(self.tts_url)
        return client

    def transcribe_audio(self, audio_data: bytes, content_type: str = "audio/webm") -> str:
        """
        Converts audio binary to text using IBM Watson STT.
        """
        if not self.stt_client:
            return "STT Service not configured."

        try:
            logger.info(f"Transcribing audio with content_type: {content_type}")
            
            # For MP4/AAC on iOS, IBM STT usually prefers audio/mp4 or audio/mpeg
            # We pass the content_type directly from the frontend blob
            
            response = self.stt_client.recognize(
                audio=audio_data,
                content_type=content_type,
                model='en-IN_Telephony' if 'mp4' in content_type else 'en-IN', # Use telephony model for compressed mobile audio if needed
                smart_formatting=True
            ).get_result()

            results = response.get('results', [])
            if not results:
                return ""
            
            transcript = results[0]['alternatives'][0]['transcript']
            return transcript.strip()
        except Exception as e:
            logger.error(f"STT Error: {str(e)}")
            return ""

    def synthesize_speech(self, text: str) -> bytes:
        """
        Converts text to audio binary using IBM Watson TTS.
        """
        if not self.tts_client:
            return b""

        try:
            response = self.tts_client.synthesize(
                text=text,
                accept='audio/mp3',
                voice='en-US_AllisonV3Voice' # Using a reliable English voice
            ).get_result()
            return response.content
        except Exception as e:
            logger.error(f"TTS Error: {str(e)}")
            return b""

# Singleton instance
voice_service = VoiceService()
