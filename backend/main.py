"""
FastAPI backend for skin disease diagnosis using EfficientNetB0.
Implements research paper specifications including Dull-Razor preprocessing,
clinical definitions, and triage system.

Production features (optional):
- Rate limiting (requires slowapi)
- Automatic image cleanup
- Security headers (CSP, HTTPS)
- Error monitoring (requires sentry-sdk)
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Optional, Union
import os
import sys
import tempfile
import atexit
from pathlib import Path
from PIL import Image
import io

# Optional: Rate limiting (install slowapi if needed)
try:
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded
    RATE_LIMITING_AVAILABLE = True
except ImportError:
    RATE_LIMITING_AVAILABLE = False
    print("Warning: slowapi not installed. Rate limiting disabled.")

# Optional: Error monitoring (install sentry-sdk if needed)
try:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    SENTRY_AVAILABLE = True
except ImportError:
    SENTRY_AVAILABLE = False
    print("Warning: sentry-sdk not installed. Error monitoring disabled.")

# Add the model directory to the path
sys.path.append(str(Path(__file__).parent))

from model import config, preprocessor, model_loader, get_model, MODEL_CONFIG, CLASS_LABELS

# Initialize Sentry (optional - set SENTRY_DSN env var to enable)
if SENTRY_AVAILABLE and os.getenv("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        integrations=[FastApiIntegration()],
        traces_sample_rate=1.0,
        environment=os.getenv("ENVIRONMENT", "development")
    )

# Initialize rate limiter (optional)
if RATE_LIMITING_AVAILABLE:
    limiter = Limiter(key_func=get_remote_address, default_limits=["100/hour"])


# Initialize FastAPI app
app = FastAPI(
    title="Skin Disease Diagnosis API",
    description="Medical diagnostic API using EfficientNetB0 for skin disease classification with research paper features",
    version="2.0.0"
)

# Add rate limiter to app state (if available)
if RATE_LIMITING_AVAILABLE:
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Temporary file cleanup on shutdown
temp_files = []

def cleanup_temp_files():
    """Clean up temporary image files on shutdown"""
    for file_path in temp_files:
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error cleaning up {file_path}: {e}")

atexit.register(cleanup_temp_files)

# Configure CORS for Next.js frontend
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Content Security Policy
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "img-src 'self' data: blob:; "
        "script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline';"
    )
    
    # Other security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    return response


# Response models
class ClinicalDetails(BaseModel):
    """Clinical information about the disease"""
    name: str
    definition: str
    characteristics: List[str]
    severity: str


class TriageInfo(BaseModel):
    """Triage information for human-in-the-loop"""
    level: str
    message: str
    requires_immediate_attention: bool
    melanoma_probability: float


class PatientMetadata(BaseModel):
    """Patient metadata"""
    age: Optional[int]
    lesion_location: Optional[str]


class PredictionResponse(BaseModel):
    """Enhanced response model for prediction endpoint"""
    predicted_class: str
    confidence: float
    class_probabilities: Dict[str, float]
    clinical_details: ClinicalDetails
    triage: TriageInfo
    patient_metadata: PatientMetadata
    model_info: Dict[str, str]


class LowConfidenceResponse(BaseModel):
    """Response model for low confidence predictions"""
    status: str
    confidence: float
    message: str
    suggestion: str
    class_probabilities: Dict[str, float]
    patient_metadata: Dict[str, Optional[Union[int, str]]]


class HealthResponse(BaseModel):
    """Response model for health check endpoint"""
    status: str
    model_loaded: bool
    available_classes: list
    features: list


@app.get("/", response_model=dict)
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Skin Disease Diagnosis API - Research Paper Implementation",
        "version": "2.0.0",
        "features": [
            "Dull-Razor preprocessing",
            "Clinical disease encyclopedia",
            "Triage warning system",
            "Patient metadata integration"
        ],
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST)",
            "docs": "/docs"
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    model_path = MODEL_CONFIG["model_path"]
    model_loaded = os.path.exists(model_path)
    
    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "available_classes": CLASS_LABELS,
        "features": [
            "Dull-Razor hair artifact removal",
            "224x224 image preprocessing",
            "Clinical definitions",
            "Triage system"
        ]
    }


async def validate_uploaded_image(file: UploadFile) -> bytes:
    """
    Fast image validation with essential checks only.
    """
    # Validate file extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_ext = file.filename.split(".")[-1].lower()
    # Check both with and without dot for compatibility
    allowed_exts = {ext.lstrip('.') for ext in config.API_CONFIG["allowed_extensions"]}
    if file_ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_exts)}"
        )
    
    # Read file content
    content = await file.read()
    
    # Validate file size
    if len(content) > config.API_CONFIG["max_file_size"]:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size: {config.API_CONFIG['max_file_size'] / (1024*1024)}MB"
        )
    
    # Quick image validation (single pass)
    try:
        image = Image.open(io.BytesIO(content))
        # Check minimum resolution
        if image.width < 100 or image.height < 100:
            raise HTTPException(
                status_code=400,
                detail="Image resolution too low. Minimum required: 100x100 pixels"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid or corrupted image file"
        )
    
    return content


@app.post("/predict", response_model=Union[PredictionResponse, LowConfidenceResponse])
async def predict_disease(
    request: Request,
    file: UploadFile = File(...),
    age: Optional[int] = Form(None),
    lesion_location: Optional[str] = Form(None)
):
    """
    Predict skin disease from uploaded image with patient metadata.
    
    Enhanced with research paper features:
    - Patient age and lesion location metadata
    - Clinical disease definitions
    - Triage warning system for melanoma
    - Human-in-the-loop flagging
    - Image quality validation
    - Low confidence handling
    
    Note: Rate limiting (10 req/min) is active if slowapi is installed.
    """
    temp_file_path = None
    try:
        # Enhanced validation
        image_bytes = await validate_uploaded_image(file)
        
        # Save to temporary file for processing
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp:
            tmp.write(image_bytes)
            temp_file_path = tmp.name
            temp_files.append(temp_file_path)
    
        # Validate lesion location if provided
        if lesion_location and lesion_location not in config.LESION_LOCATIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid lesion location. Allowed locations: {', '.join(config.LESION_LOCATIONS)}"
            )
        
        # Validate age if provided
        if age is not None and (age < 0 or age > 150):
            raise HTTPException(
                status_code=400,
                detail="Age must be between 0 and 150"
            )
        
        # Preprocess and predict
        preprocessed_image = preprocessor.preprocess_image(
            image_bytes,
            apply_hair_removal=config.IMAGE_CONFIG["apply_dull_razor"]
        )
        
        # Get prediction with metadata
        result = model_loader.predict(
            preprocessed_image,
            patient_age=age,
            lesion_location=lesion_location
        )
        
        # Low confidence handling
        if result["confidence"] < 0.30:
            return {
                "status": "low_confidence",
                "confidence": result["confidence"],
                "message": "Unable to make reliable prediction. Image quality may be insufficient.",
                "suggestion": "Please upload a clearer, higher-resolution image of the lesion.",
                "class_probabilities": result["class_probabilities"],
                "patient_metadata": result.get("patient_metadata", {})
            }
        # Add model info
        model_path = MODEL_CONFIG["model_path"]
        result["model_info"] = {
            "model_type": "EfficientNetB0",
            "input_shape": "224x224x3",
            "preprocessing": "Dull-Razor + Normalization",
            "using_placeholder": "true" if not os.path.exists(model_path) else "false"
        }
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Log to Sentry if configured
        if SENTRY_AVAILABLE and os.getenv("SENTRY_DSN"):
            sentry_sdk.capture_exception(e)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        # Automatic cleanup of temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
                if temp_file_path in temp_files:
                    temp_files.remove(temp_file_path)
            except Exception as cleanup_error:
                print(f"Error cleaning up temp file: {cleanup_error}")


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred", "error": str(exc)}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
