from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import List, Dict, Any
import cv2
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from services.ai_service import CropDiseaseDetector
from services.translation_service import TranslationService
from models.crop_models import DiseaseDetectionResponse, TreatmentRecommendation
from utils.auth import get_current_user

router = APIRouter()

# Initialize services
disease_detector = CropDiseaseDetector()
translator = TranslationService()

@router.post("/detect", response_model=DiseaseDetectionResponse)
async def detect_crop_disease(
    file: UploadFile = File(...),
    language: str = "en",
    current_user: dict = Depends(get_current_user)
):
    """
    Detect crop diseases, nutrient deficiencies, and pest attacks from uploaded images
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to OpenCV format
        opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Detect disease
        detection_result = await disease_detector.detect_disease(opencv_image)
        
        # Get treatment recommendations
        treatments = await disease_detector.get_treatment_recommendations(
            detection_result['disease_type'],
            detection_result['severity']
        )
        
        # Translate if needed
        if language != "en":
            detection_result = await translator.translate_detection_result(
                detection_result, language
            )
            treatments = await translator.translate_treatments(treatments, language)
        
        return DiseaseDetectionResponse(
            disease_detected=detection_result['disease_detected'],
            disease_type=detection_result['disease_type'],
            confidence=detection_result['confidence'],
            severity=detection_result['severity'],
            affected_area_percentage=detection_result['affected_area'],
            treatments=treatments,
            preventive_measures=detection_result['preventive_measures'],
            fertilizer_recommendations=detection_result['fertilizers']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@router.get("/diseases/common")
async def get_common_diseases(
    crop_type: str,
    region: str = "india",
    language: str = "en"
):
    """
    Get common diseases for specific crop types in a region
    """
    try:
        diseases = await disease_detector.get_common_diseases(crop_type, region)
        
        if language != "en":
            diseases = await translator.translate_disease_list(diseases, language)
        
        return {"crop_type": crop_type, "common_diseases": diseases}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-batch")
async def analyze_batch_images(
    files: List[UploadFile] = File(...),
    language: str = "en",
    current_user: dict = Depends(get_current_user)
):
    """
    Analyze multiple crop images in batch
    """
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 images allowed per batch")
    
    results = []
    
    for file in files:
        try:
            contents = await file.read()
            image = Image.open(io.BytesIO(contents))
            opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            detection_result = await disease_detector.detect_disease(opencv_image)
            results.append({
                "filename": file.filename,
                "result": detection_result
            })
            
        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": str(e)
            })
    
    return {"batch_results": results}