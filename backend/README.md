# Skin Disease Diagnosis API

FastAPI backend for medical diagnosis using EfficientNetB0 deep learning model to classify skin diseases.

## Features

- **Deep Learning Model**: EfficientNetB0 architecture for image classification
- **4 Disease Classes**: Acne, Cherry Angioma, Melanoma, Psoriasis
- **Image Preprocessing**: Automatic resize to 224x224 and normalization
- **REST API**: Simple `/predict` endpoint for image classification
- **CORS Enabled**: Ready for Next.js frontend integration
- **Placeholder Support**: Works without trained model for testing

## Project Structure

```
backend/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── model/
│   ├── __init__.py        # Package initialization
│   ├── config.py          # Model configuration
│   ├── model_loader.py    # Model loading and prediction
│   ├── preprocessor.py    # Image preprocessing
│   └── skin_disease_model.h5  # Your trained model (add this)
└── README.md              # This file
```

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Add Your Model (Optional)

Place your trained EfficientNetB0 `.h5` model file in the `model/` directory:

```bash
backend/model/skin_disease_model.h5
```

If you don't have a model yet, the API will use a placeholder that returns random predictions for testing.

### 3. Configure Environment (Optional)

```bash
cp .env.example .env
# Edit .env to customize settings
```

### 4. Run the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload

# Or using Python directly
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "available_classes": ["Acne", "Cherry Angioma", "Melanoma", "Psoriasis"]
}
```

### Predict Disease
```bash
POST /predict
Content-Type: multipart/form-data
```

**Parameters:**
- `file`: Image file (JPEG, PNG) - max 10MB

**Example using curl:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@skin_image.jpg"
```

**Response:**
```json
{
  "predicted_class": "Melanoma",
  "confidence": 0.87,
  "class_probabilities": {
    "Acne": 0.05,
    "Cherry Angioma": 0.03,
    "Melanoma": 0.87,
    "Psoriasis": 0.05
  },
  "model_info": {
    "model_type": "EfficientNetB0",
    "input_shape": "224x224x3",
    "using_placeholder": "false"
  }
}
```

## Testing

### Using Interactive Docs

Visit `http://localhost:8000/docs` for Swagger UI where you can test the API interactively.

### Using Python

```python
import requests

url = "http://localhost:8000/predict"
files = {"file": open("test_image.jpg", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

### Using JavaScript (Next.js)

```javascript
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('http://localhost:8000/predict', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log(result);
```

## Deployment

### Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables:
   - `PORT=8000`
   - `MODEL_PATH=model/skin_disease_model.h5`
4. Deploy!

Railway will automatically detect the Python app and install dependencies.

### Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables
6. Deploy!

### Docker (Optional)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Model Information

- **Architecture**: EfficientNetB0
- **Input Size**: 224x224x3 (RGB)
- **Preprocessing**: Resize + Normalize to [0, 1]
- **Output**: 4 classes with softmax probabilities

### Training Your Model

If you need to train the model, here's a basic structure:

```python
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# Load base model
base_model = EfficientNetB0(
    weights='imagenet',
    include_top=False,
    input_shape=(224, 224, 3)
)

# Add custom layers
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
predictions = Dense(4, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

# Compile and train
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Save after training
model.save('model/skin_disease_model.h5')
```

## Troubleshooting

### Model Not Loading
- Ensure the `.h5` file is in the correct location
- Check file permissions
- Verify TensorFlow installation

### CORS Errors
- Update `allow_origins` in `main.py` with your frontend URL
- For production, replace `["*"]` with specific domains

### Large Model File
- Use Git LFS for version control
- For deployment, upload model separately or use cloud storage

## License

This project is for educational and research purposes.

## Support

For issues or questions, please refer to the research paper or contact the development team.
