import os
import httpx
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

# AppID Configuration
APPID_DISCOVERY_ENDPOINT = os.environ.get("APPID_DISCOVERY_ENDPOINT")
APPID_CLIENT_ID = os.environ.get("APPID_CLIENT_ID")

security = HTTPBearer()

# Cache for Public Keys
cached_public_keys = None

async def get_public_keys():
    global cached_public_keys
    if cached_public_keys is None:
        async with httpx.AsyncClient() as client:
            # 1. Get the discovery info
            response = await client.get(APPID_DISCOVERY_ENDPOINT)
            discovery_info = response.json()
            
            # 2. Get the JWKS URI
            jwks_uri = discovery_info.get("jwks_uri")
            
            # 3. Fetch the public keys
            jwks_response = await client.get(jwks_uri)
            cached_public_keys = jwks_response.json()
            
    return cached_public_keys

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verifies the IBM AppID JWT token.
    """
    token = credentials.credentials
    try:
        # Get public keys for verification
        public_keys = await get_public_keys()
        
        # Verify and decode the token
        payload = jwt.decode(
            token,
            public_keys,
            algorithms=["RS256"],
            audience=APPID_CLIENT_ID,
            options={"verify_aud": True}
        )
        
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}"
        )
