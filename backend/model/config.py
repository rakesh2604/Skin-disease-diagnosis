"""
Configuration for the skin disease diagnosis model.
Includes clinical definitions from research paper.
"""

import os

# Model configuration
MODEL_CONFIG = {
    "input_shape": (224, 224, 3),
    "model_path": os.getenv("MODEL_PATH", "model/skin_disease_model.h5"),
    "num_classes": 4,
}

# Class labels based on research paper
CLASS_LABELS = [
    "Acne",
    "Cherry Angioma",
    "Melanoma",
    "Psoriasis"
]

# Clinical definitions from research paper
CLINICAL_DEFINITIONS = {
    "Acne": {
        "name": "Acne",
        "definition": "Inflammatory skin condition characterized by comedones, papules, pustules, and nodules. Common in adolescents and young adults, primarily affecting face, chest, and back.",
        "characteristics": ["Comedones (blackheads/whiteheads)", "Inflammatory pustules", "Possible scarring"],
        "severity": "Low to Moderate"
    },
    "Cherry Angioma": {
        "name": "Cherry Angioma",
        "definition": "Benign vascular lesions appearing as bright red papules. Common in adults, typically harmless proliferations of capillaries.",
        "characteristics": ["Bright red color", "Dome-shaped papules", "1-5mm diameter"],
        "severity": "Benign"
    },
    "Melanoma": {
        "name": "Melanoma",
        "definition": "Malignant melanocytic neoplasm with irregular borders and color variation. Most dangerous form of skin cancer requiring immediate medical attention.",
        "characteristics": ["Asymmetric shape", "Irregular borders", "Color variation", "Diameter > 6mm", "Evolving appearance"],
        "severity": "Critical - Requires Immediate Medical Attention"
    },
    "Psoriasis": {
        "name": "Psoriasis",
        "definition": "Chronic autoimmune condition presenting as red color, scaly plaques with well-defined edges. Commonly affects elbows, knees, and scalp.",
        "characteristics": ["Red plaques", "Silvery scales", "Well-defined edges", "Symmetrical distribution"],
        "severity": "Moderate - Chronic Condition"
    }
}

# Lesion location options for patient metadata
LESION_LOCATIONS = [
    "Face",
    "Chest",
    "Back",
    "Arms",
    "Legs",
    "Hands",
    "Feet",
    "Scalp",
    "Neck",
    "Other"
]

# Triage configuration for melanoma detection (human-in-the-loop)
TRIAGE_CONFIG = {
    "melanoma_threshold_critical": 0.70,  # High confidence melanoma
    "melanoma_threshold_high": 0.50,      # Medium confidence melanoma
    "general_threshold_high": 0.85,       # High confidence any disease
}

# Image preprocessing configuration
IMAGE_CONFIG = {
    "target_size": (224, 224),
    "color_mode": "rgb",
    "normalization_range": (0, 1),  # Normalize pixel values to [0, 1]
    "apply_dull_razor": True,       # Apply hair artifact removal
}

# API configuration
API_CONFIG = {
    "max_file_size": 10 * 1024 * 1024,  # 10 MB
    "allowed_extensions": {".jpg", ".jpeg", ".png"},
}
