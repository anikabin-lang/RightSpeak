from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
try:
    from routes import ask, analyze, voice, library
except ImportError as e:
    print(f"ERROR: Missing dependencies: {e}")
    print("Please run: pip install -r requirements.txt")
    # Define dummy routers or just let it fail later to avoid silent failure
    # but at least we get a clean print statement.
    raise

app = FastAPI(title="RightSpeak API", version="1.0.0")

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/{rest_of_path:path}")
async def preflight_handler():
    return {}

app.include_router(ask.router)
app.include_router(analyze.router)
app.include_router(voice.router)
app.include_router(library.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to RightSpeak API"}
