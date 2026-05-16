import tensorflow as tf
import cv2
import numpy as np
from PIL import Image
import json
import os
from typing import Dict, List, Any, Tuple
import logging

logger = logging.getLogger(__name__)

class CropDiseaseDetector:
    def __init__(self):
        self.model = None
        self.class_names = []
        self.disease_info = {}
        self.load_model()
        self.load_disease_database()
    
    def load_model(self):
        """Load the trained crop disease detection model"""
        try:
            model_path = os.path.join("ai-models", "crop_disease_model.h5")
            if os.path.exists(model_path):
                self.model = tf.keras.models.load_model(model_path)
                logger.info("Crop disease model loaded successfully")
            else:
                # For demo purposes, create a mock model
                self.model = self.create_mock_model()
                logger.warning("Using mock model for demonstration")
                
            # Load class names
            classes_path = os.path.join("ai-models", "class_names.json")
            if os.path.exists(classes_path):
                with open(classes_path, 'r') as f:
                    self.class_names = json.load(f)
            else:
                self.class_names = self.get_default_classes()
                
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self.model = self.create_mock_model()
            self.class_names = self.get_default_classes()
    
    def create_mock_model(self):
        """Create a mock model for demonstration"""
        model = tf.keras.Sequential([
            tf.keras.layers.Input(shape=(224, 224, 3)),
            tf.keras.layers.Conv2D(32, 3, activation='relu'),
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dense(len(self.get_default_classes()), activation='softmax')
        ])
        return model
    
    def get_default_classes(self):
        """Default disease classes for Indian crops"""
        return [
            "healthy",
            "bacterial_blight",
            "brown_spot",
            "leaf_blast",
            "tungro",
            "bacterial_leaf_streak",
            "sheath_blight",
            "downy_mildew",
            "rust",
            "powdery_mildew",
            "anthracnose",
            "mosaic_virus",
            "nutrient_deficiency_nitrogen",
            "nutrient_deficiency_potassium",
            "nutrient_deficiency_phosphorus",
            "pest_attack_aphids",
            "pest_attack_thrips",
            "pest_attack_whitefly"
        ]
    
    def load_disease_database(self):
        """Load disease information database"""
        self.disease_info = {
            "bacterial_blight": {
                "name": "Bacterial Blight",
                "hindi_name": "जीवाणु झुलसा",
                "severity_levels": ["low", "medium", "high"],
                "symptoms": [
                    "Water-soaked lesions on leaves",
                    "Yellow halos around lesions",
                    "Wilting of leaves"
                ],
                "treatments": [
                    {
                        "name": "Copper-based fungicide",
                        "description": "Apply copper oxychloride 50% WP @ 3g/L",
                        "application_method": "Foliar spray every 10-15 days"
                    },
                    {
                        "name": "Streptocycline",
                        "description": "Streptocycline 500 ppm + Copper oxychloride",
                        "application_method": "Spray during early morning or evening"
                    }
                ],
                "preventive_measures": [
                    "Use disease-free seeds",
                    "Maintain proper field sanitation",
                    "Avoid overhead irrigation",
                    "Remove infected plant debris"
                ],
                "fertilizers": [
                    {
                        "name": "Balanced NPK",
                        "composition": "19:19:19",
                        "application_method": "Soil application @ 25kg/acre"
                    }
                ]
            },
            "brown_spot": {
                "name": "Brown Spot",
                "hindi_name": "भूरा धब्बा",
                "severity_levels": ["low", "medium", "high"],
                "symptoms": [
                    "Small brown spots on leaves",
                    "Spots with yellow halos",
                    "Premature leaf death"
                ],
                "treatments": [
                    {
                        "name": "Mancozeb",
                        "description": "Mancozeb 75% WP @ 2.5g/L",
                        "application_method": "Foliar spray at 15-day intervals"
                    }
                ],
                "preventive_measures": [
                    "Proper water management",
                    "Balanced fertilization",
                    "Crop rotation"
                ],
                "fertilizers": [
                    {
                        "name": "Potash fertilizer",
                        "composition": "Muriate of Potash",
                        "application_method": "Soil application @ 15kg/acre"
                    }
                ]
            },
            "nutrient_deficiency_nitrogen": {
                "name": "Nitrogen Deficiency",
                "hindi_name": "नाइट्रोजन की कमी",
                "severity_levels": ["low", "medium", "high"],
                "symptoms": [
                    "Yellowing of older leaves",
                    "Stunted growth",
                    "Reduced tillering"
                ],
                "treatments": [
                    {
                        "name": "Urea application",
                        "description": "Apply urea @ 25kg/acre",
                        "application_method": "Top dressing with irrigation"
                    },
                    {
                        "name": "Foliar nitrogen spray",
                        "description": "Urea 2% solution",
                        "application_method": "Foliar spray in evening"
                    }
                ],
                "preventive_measures": [
                    "Regular soil testing",
                    "Proper fertilizer scheduling",
                    "Use of organic manures"
                ],
                "fertilizers": [
                    {
                        "name": "Urea",
                        "composition": "46% N",
                        "application_method": "Split application in 3 doses"
                    }
                ]
            }
        }
    
    async def detect_disease(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Detect disease from crop image
        
        Args:
            image: OpenCV image array
            
        Returns:
            Dictionary containing detection results
        """
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image)
            
            # Make prediction
            if self.model:
                predictions = self.model.predict(np.expand_dims(processed_image, axis=0))
                predicted_class_idx = np.argmax(predictions[0])
                confidence = float(predictions[0][predicted_class_idx])
                predicted_class = self.class_names[predicted_class_idx]
            else:
                # Mock prediction for demo
                predicted_class = np.random.choice(self.class_names)
                confidence = np.random.uniform(0.7, 0.95)
            
            # Determine if disease is detected
            disease_detected = predicted_class != "healthy"
            
            # Calculate affected area (mock calculation)
            affected_area = self.calculate_affected_area(image) if disease_detected else 0
            
            # Determine severity
            severity = self.determine_severity(confidence, affected_area)
            
            # Get disease information
            disease_info = self.disease_info.get(predicted_class, {})
            
            result = {
                "disease_detected": disease_detected,
                "disease_type": predicted_class if disease_detected else None,
                "confidence": confidence,
                "severity": severity,
                "affected_area": affected_area,
                "symptoms": disease_info.get("symptoms", []),
                "preventive_measures": disease_info.get("preventive_measures", []),
                "fertilizers": disease_info.get("fertilizers", [])
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error in disease detection: {e}")
            return {
                "disease_detected": False,
                "disease_type": None,
                "confidence": 0.0,
                "severity": "unknown",
                "affected_area": 0,
                "symptoms": [],
                "preventive_measures": [],
                "fertilizers": []
            }
    
    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Preprocess image for model input"""
        # Resize to model input size
        image_resized = cv2.resize(image, (224, 224))
        
        # Convert BGR to RGB
        image_rgb = cv2.cvtColor(image_resized, cv2.COLOR_BGR2RGB)
        
        # Normalize pixel values
        image_normalized = image_rgb.astype(np.float32) / 255.0
        
        return image_normalized
    
    def calculate_affected_area(self, image: np.ndarray) -> float:
        """Calculate percentage of affected area (mock implementation)"""
        # This is a simplified mock implementation
        # In reality, you would use image segmentation techniques
        
        # Convert to HSV for better color analysis
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Define range for brown/yellow colors (disease symptoms)
        lower_disease = np.array([10, 50, 50])
        upper_disease = np.array([30, 255, 255])
        
        # Create mask for disease colors
        mask = cv2.inRange(hsv, lower_disease, upper_disease)
        
        # Calculate percentage
        total_pixels = image.shape[0] * image.shape[1]
        disease_pixels = cv2.countNonZero(mask)
        percentage = (disease_pixels / total_pixels) * 100
        
        return min(percentage, 100.0)  # Cap at 100%
    
    def determine_severity(self, confidence: float, affected_area: float) -> str:
        """Determine disease severity based on confidence and affected area"""
        if affected_area < 10 and confidence < 0.8:
            return "low"
        elif affected_area < 30 and confidence < 0.9:
            return "medium"
        else:
            return "high"
    
    async def get_treatment_recommendations(self, disease_type: str, severity: str) -> List[Dict[str, str]]:
        """Get treatment recommendations for detected disease"""
        if disease_type and disease_type in self.disease_info:
            treatments = self.disease_info[disease_type].get("treatments", [])
            
            # Filter treatments based on severity
            if severity == "low":
                return treatments[:1]  # Mild treatment
            elif severity == "medium":
                return treatments[:2]  # Moderate treatment
            else:
                return treatments  # All treatments
        
        return []
    
    async def get_common_diseases(self, crop_type: str, region: str) -> List[Dict[str, Any]]:
        """Get common diseases for specific crop and region"""
        # Mock data for common diseases
        common_diseases = {
            "rice": [
                "bacterial_blight",
                "brown_spot",
                "leaf_blast",
                "sheath_blight"
            ],
            "wheat": [
                "rust",
                "powdery_mildew",
                "leaf_blight"
            ],
            "cotton": [
                "bacterial_blight",
                "anthracnose",
                "mosaic_virus"
            ]
        }
        
        diseases = common_diseases.get(crop_type.lower(), [])
        
        result = []
        for disease in diseases:
            if disease in self.disease_info:
                disease_data = self.disease_info[disease].copy()
                disease_data["disease_id"] = disease
                result.append(disease_data)
        
        return result