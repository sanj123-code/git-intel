from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer import analyze_commits

app = FastAPI(title="Git Intel API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://git-intel-backend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class RepoRequest(BaseModel):
    repo_url: str

@app.get("/")
def root():
    return {"message": "Git Intel API is running! 🚀"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@app.post("/analyze")
def analyze_repo(request: RepoRequest):
    try:
        print(f"Analyzing: {request.repo_url}")
        result = analyze_commits(request.repo_url)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))