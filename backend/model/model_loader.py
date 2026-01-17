"""
Model loading and management utilities.
"""

import os
import numpy as np
from typing import Optional
from .config import MODEL_CONFIG, CLASS_LABELS


# Global model instance (singleton pattern)
_model = None


class PlaceholderModel:
    """
    Placeholder model for testing when actual .h5 file is not available.
    Returns deterministic predictions based on image content hash.
    """
    
    def predict(self, x: np.ndarray, verbose: int = 0) -> np.ndarray:
        """
        Generate deterministic predictions based on image content.
        
        Args:
            x: Input array of shape (batch_size, 224, 224, 3)
            verbose: Verbosity mode (0 = silent, 1 = progress bar)
            
        Returns:
            Predictions array of shape (batch_size, num_classes)
        """
        batch_size = x.shape[0]
        num_classes = MODEL_CONFIG["num_classes"]
        
        predictions = []
        for i in range(batch_size):
            # Use image content to generate deterministic seed
            # Hash the image array to get consistent results for same image
            image_hash = hash(x[i].tobytes())
            
            # Use the hash as seed for reproducible random numbers
            rng = np.random.RandomState(seed=abs(image_hash) % (2**31))
            
            # Generate deterministic probabilities that sum to 1
            pred = rng.dirichlet(np.ones(num_classes))
            predictions.append(pred)
        
        return np.array(predictions, dtype=np.float32)


def load_model():
    """
    Load the EfficientNetB0 model from disk.
    Falls back to placeholder model if .h5 file not found.
    
    Returns:
        Loaded Keras model or PlaceholderModel instance
    """
    model_path = MODEL_CONFIG["model_path"]
    
    if os.path.exists(model_path):
        try:
            # Import tensorflow only when needed
            import tensorflow as tf
            from tensorflow import keras
            
            print(f"Loading model from {model_path}...")
            model = keras.models.load_model(model_path)
            print("Model loaded successfully!")
            return model
            
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Falling back to placeholder model...")
            return PlaceholderModel()
    else:
        print(f"Model file not found at {model_path}")
        print("Using placeholder model for testing...")
        return PlaceholderModel()


def get_model():
    """
    Get the model instance (singleton pattern).
    Loads the model on first call, then returns cached instance.
    
    Returns:
        Model instance
    """
    global _model
    
    if _model is None:
        _model = load_model()
    
    return _model


def predict(image_array: np.ndarray, patient_age: Optional[int] = None, 
            lesion_location: Optional[str] = None) -> dict:
    """
    Make prediction on preprocessed image with patient metadata.
    
    Args:
        image_array: Preprocessed image array of shape (1, 224, 224, 3)
        patient_age: Optional patient age
        lesion_location: Optional lesion location on body
        
    Returns:
        Dictionary with predicted class, confidence, clinical details, and triage level
    """
    from .config import CLINICAL_DEFINITIONS, TRIAGE_CONFIG
    
    model = get_model()
    
    # Get predictions
    predictions = model.predict(image_array, verbose=0)
    
    # Get the predicted class index and confidence
    predicted_class_idx = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][predicted_class_idx])
    
    # Get class label
    predicted_class = CLASS_LABELS[predicted_class_idx]
    
    # Get all class probabilities
    class_probabilities = {
        CLASS_LABELS[i]: float(predictions[0][i])
        for i in range(len(CLASS_LABELS))
    }
    
    # Calculate triage level (human-in-the-loop for melanoma)
    melanoma_confidence = class_probabilities.get("Melanoma", 0.0)
    
    if melanoma_confidence >= TRIAGE_CONFIG["melanoma_threshold_critical"]:
        triage_level = "CRITICAL"
        triage_message = "URGENT: Flagged for immediate human review - High melanoma probability detected"
        requires_immediate_attention = True
    elif melanoma_confidence >= TRIAGE_CONFIG["melanoma_threshold_high"]:
        triage_level = "HIGH"
        triage_message = "High priority: Recommend professional dermatologist consultation"
        requires_immediate_attention = True
    elif confidence >= TRIAGE_CONFIG["general_threshold_high"]:
        triage_level = "MEDIUM"
        triage_message = "Moderate priority: Consider professional consultation"
        requires_immediate_attention = False
    else:
        triage_level = "LOW"
        triage_message = "Low priority: Monitor condition and consult if symptoms persist"
        requires_immediate_attention = False
    
    # Get clinical definition for predicted disease
    clinical_info = CLINICAL_DEFINITIONS.get(predicted_class, {})
    
    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "class_probabilities": class_probabilities,
        "clinical_details": {
            "name": clinical_info.get("name", predicted_class),
            "definition": clinical_info.get("definition", "No definition available"),
            "characteristics": clinical_info.get("characteristics", []),
            "severity": clinical_info.get("severity", "Unknown")
        },
        "triage": {
            "level": triage_level,
            "message": triage_message,
            "requires_immediate_attention": requires_immediate_attention,
            "melanoma_probability": melanoma_confidence
        },
        "patient_metadata": {
            "age": patient_age,
            "lesion_location": lesion_location
        }
    }
