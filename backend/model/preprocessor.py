"""
Image preprocessing utilities for skin disease diagnosis.
Implements preprocessing pipeline from research paper including Dull-Razor algorithm.
"""

import numpy as np
from PIL import Image
from io import BytesIO
from .config import IMAGE_CONFIG


def apply_dull_razor(image: Image.Image) -> Image.Image:
    """
    Dull-Razor algorithm placeholder for hair artifact removal.
    
    This is a placeholder implementation acknowledging the hair artifact removal
    step mentioned in the research paper. In production, this would implement
    the actual Dull-Razor algorithm for removing hair from dermoscopic images.
    
    Args:
        image: PIL Image object
        
    Returns:
        Processed image with hair artifacts removed (currently returns original)
    """
    # PLACEHOLDER: Actual Dull-Razor implementation would go here
    # The algorithm typically involves:
    # 1. Grayscale conversion
    # 2. Black hat morphological operation to detect dark hair
    # 3. Binary thresholding to create hair mask
    # 4. Inpainting to fill hair regions
    
    # For now, return the original image
    # TODO: Implement actual Dull-Razor algorithm when needed
    return image


def preprocess_image(image_bytes: bytes, apply_hair_removal: bool = True) -> np.ndarray:
    """
    Preprocess image for model prediction according to research paper specifications.
    
    Pipeline:
    1. Apply Dull-Razor algorithm for hair artifact removal (optional)
    2. Resize to 224×224 pixels (as per research paper)
    3. Normalize pixel values to [0, 1] range
    
    Args:
        image_bytes: Raw image bytes from uploaded file
        apply_hair_removal: Whether to apply Dull-Razor algorithm (default: True)
        
    Returns:
        Preprocessed image array ready for model input
        Shape: (1, 224, 224, 3) with values normalized to [0, 1]
    """
    try:
        # Open image from bytes
        image = Image.open(BytesIO(image_bytes))
        
        # Convert to RGB if necessary (handles RGBA, grayscale, etc.)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Step 1: Apply Dull-Razor algorithm for hair artifact removal
        if apply_hair_removal:
            image = apply_dull_razor(image)
        
        # Step 2: Resize to 224×224 pixels (research paper specification)
        target_size = IMAGE_CONFIG["target_size"]  # (224, 224)
        image = image.resize(target_size, Image.Resampling.LANCZOS)
        
        # Step 3: Convert to numpy array
        image_array = np.array(image, dtype=np.float32)
        
        # Step 4: Normalize pixel values to [0, 1] range (research paper specification)
        image_array = image_array / 255.0
        
        # Add batch dimension: (224, 224, 3) -> (1, 224, 224, 3)
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
        
    except Exception as e:
        raise ValueError(f"Error preprocessing image: {str(e)}")


def validate_image(image_bytes: bytes) -> bool:
    """
    Validate that the uploaded file is a valid image.
    
    Args:
        image_bytes: Raw image bytes
        
    Returns:
        True if valid image, False otherwise
    """
    try:
        image = Image.open(BytesIO(image_bytes))
        image.verify()
        return True
    except Exception:
        return False
