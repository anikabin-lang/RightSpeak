import os
from ibm_watson import SpeechToTextV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from dotenv import load_dotenv

load_dotenv()

def list_models():
    api_key = os.environ.get("IBM_STT_API_KEY")
    service_url = os.environ.get("IBM_STT_URL")
    
    if not api_key or not service_url:
        print("Credentials missing")
        return

    authenticator = IAMAuthenticator(api_key)
    stt = SpeechToTextV1(authenticator=authenticator)
    stt.set_service_url(service_url)

    models = stt.list_models().get_result()
    for model in models['models']:
        if 'en-IN' in model['name']:
            print(model['name'])

if __name__ == "__main__":
    list_models()
