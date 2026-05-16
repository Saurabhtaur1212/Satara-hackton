from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
from services.weather_service import WeatherService
from services.alert_service import AlertService
from models.weather_models import WeatherData, WeatherAlert, FarmingRecommendation
from utils.auth import get_current_user

router = APIRouter()

# Initialize services
weather_service = WeatherService()
alert_service = AlertService()

class LocationRequest(BaseModel):
    latitude: float
    longitude: float
    city: Optional[str] = None
    state: Optional[str] = None

@router.get("/current", response_model=WeatherData)
async def get_current_weather(
    latitude: float,
    longitude: float,
    language: str = "en",
    current_user: dict = Depends(get_current_user)
):
    """
    Get current weather conditions for farmer's location
    """
    try:
        weather_data = await weather_service.get_current_weather(
            latitude=latitude,
            longitude=longitude,
            language=language
        )
        
        return weather_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather: {str(e)}")

@router.get("/forecast", response_model=List[WeatherData])
async def get_weather_forecast(
    latitude: float,
    longitude: float,
    days: int = 7,
    language: str = "en",
    current_user: dict = Depends(get_current_user)
):
    """
    Get weather forecast for next few days
    """
    try:
        if days > 14:
            raise HTTPException(status_code=400, detail="Maximum 14 days forecast available")
        
        forecast_data = await weather_service.get_forecast(
            latitude=latitude,
            longitude=longitude,
            days=days,
            language=language
        )
        
        return forecast_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching forecast: {str(e)}")

@router.get("/alerts", response_model=List[WeatherAlert])
async def get_weather_alerts(
    latitude: float,
    longitude: float,
    language: str = "en",
    current_user: dict = Depends(get_current_user)
):
    """
    Get weather alerts and warnings for the area
    """
    try:
        alerts = await alert_service.get_weather_alerts(
            latitude=latitude,
            longitude=longitude,
            language=language
        )
        
        return alerts
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching alerts: {str(e)}")

@router.post("/farming-recommendations")
async def get_farming_recommendations(
    location: LocationRequest,
    crop_types: List[str],
    language: str = "en",
    current_user: dict = Depends(get_current_user)
):
    """
    Get crop-specific farming recommendations based on weather
    """
    try:
        # Get weather data
        weather_data = await weather_service.get_current_weather(
            latitude=location.latitude,
            longitude=location.longitude
        )
        
        forecast_data = await weather_service.get_forecast(
            latitude=location.latitude,
            longitude=location.longitude,
            days=7
        )
        
        # Generate recommendations
        recommendations = await weather_service.generate_farming_recommendations(
            weather_data=weather_data,
            forecast_data=forecast_data,
            crop_types=crop_types,
            language=language
        )
        
        return {
            "location": location.dict(),
            "recommendations": recommendations,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@router.post("/subscribe-alerts")
async def subscribe_to_alerts(
    location: LocationRequest,
    alert_types: List[str],  # rainfall, temperature, storm, frost, etc.
    notification_method: str = "push",  # push, sms, email
    current_user: dict = Depends(get_current_user)
):
    """
    Subscribe to weather alerts for specific location and alert types
    """
    try:
        subscription = await alert_service.create_alert_subscription(
            user_id=current_user["user_id"],
            location=location.dict(),
            alert_types=alert_types,
            notification_method=notification_method
        )
        
        return {
            "message": "Successfully subscribed to weather alerts",
            "subscription_id": subscription["subscription_id"],
            "alert_types": alert_types
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error subscribing to alerts: {str(e)}")

@router.get("/historical")
async def get_historical_weather(
    latitude: float,
    longitude: float,
    start_date: str,  # YYYY-MM-DD
    end_date: str,    # YYYY-MM-DD
    current_user: dict = Depends(get_current_user)
):
    """
    Get historical weather data for analysis
    """
    try:
        start_dt = datetime.strptime(start_date, "%Y-%m-%d")
        end_dt = datetime.strptime(end_date, "%Y-%m-%d")
        
        if (end_dt - start_dt).days > 365:
            raise HTTPException(status_code=400, detail="Maximum 1 year of historical data allowed")
        
        historical_data = await weather_service.get_historical_weather(
            latitude=latitude,
            longitude=longitude,
            start_date=start_dt,
            end_date=end_dt
        )
        
        return {
            "location": {"latitude": latitude, "longitude": longitude},
            "period": {"start": start_date, "end": end_date},
            "data": historical_data
        }
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching historical data: {str(e)}")

@router.get("/soil-conditions")
async def get_soil_conditions(
    latitude: float,
    longitude: float,
    language: str = "en",
    current_user: dict = Depends(get_current_user)
):
    """
    Get soil condition recommendations based on weather
    """
    try:
        conditions = await weather_service.analyze_soil_conditions(
            latitude=latitude,
            longitude=longitude,
            language=language
        )
        
        return conditions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing soil conditions: {str(e)}")