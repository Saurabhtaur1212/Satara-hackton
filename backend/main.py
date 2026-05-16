from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import uvicorn
from typing import List, Optional
import os
from datetime import datetime

from routers import (
    crop_detection,
    kisan_gpt,
    weather,
    marketplace,
    labor_hiring,
    government_schemes,
    dashboard,
    auth
)
from database import init_db
from config import settings

app = FastAPI(
    title="AgriSaathi API",
    description="AI-Powered Smart Agriculture Platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def startup_event():
    await init_db()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(crop_detection.router, prefix="/api/crop-detection", tags=["Crop Disease Detection"])
app.include_router(kisan_gpt.router, prefix="/api/kisan-gpt", tags=["KisanGPT Assistant"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather & Alerts"])
app.include_router(marketplace.router, prefix="/api/marketplace", tags=["Farmer Marketplace"])
app.include_router(labor_hiring.router, prefix="/api/labor", tags=["Labor & Equipment"])
app.include_router(government_schemes.router, prefix="/api/schemes", tags=["Government Schemes"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to AgriSaathi API",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )