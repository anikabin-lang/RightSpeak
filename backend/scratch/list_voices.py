import os
from ibm_watson import TextToSpeechV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from dotenv import load_dotenv

load_dotenv()

def list_voices():
    api_key = os.environ.get("IBM_TTS_API_KEY")
    service_url = os.environ.get("IBM_TTS_URL")
    
    if not api_key or not service_url:
        print("Credentials missing")
        return

    authenticator = IAMAuthenticator(api_key)
    tts = TextToSpeechV1(authenticator=authenticator)
    tts.set_service_url(service_url)

    voices = tts.list_voices().get_result()
    for voice in voices['voices']:
        if 'en-' in voice['name']:
            print(voice['name'])

if __name__ == "__main__":
    list_voices()
