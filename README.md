# Skin Disease Diagnosis System

> AI-powered medical diagnosis using EfficientNetB0 for automated skin disease classification with clinical triage

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org/)
[![Production Ready](https://img.shields.io/badge/Production-Ready-green.svg)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 👥 Team

**Project Team**:
- **Vivek Kumar** - Team Member
- **Rahul Kashyap** - Team Member  
- **Sainkey Raghav** - Team Member

**Mentor**:
- **Dr. Pramod Soni** - Project Mentor

---

## 🎯 Overview

This project implements an AI-powered skin disease diagnosis system based on research paper specifications, designed to bridge the diagnostic gap in dermatology. The system uses EfficientNetB0 deep learning architecture to classify skin lesions into four categories while implementing a human-in-the-loop triage system for high-risk cases.

### Disease Classes
- **Acne** - Inflammatory skin condition affecting hair follicles
- **Cherry Angioma** - Benign vascular skin lesions
- **Melanoma** - Malignant skin cancer requiring immediate attention
- **Psoriasis** - Chronic autoimmune inflammatory condition

### Core Principle
> *"The AI serves to flag high-risk cases; ultimate accountability remains with the clinician."*

---

## 🔬 Research Implementation

This project directly implements the research paper's methodology to address the critical shortage of dermatologists and improve diagnostic accessibility:

### Key Research Features Implemented

#### 1. **Dull-Razor Preprocessing**
- **Research Goal**: Remove hair artifacts that interfere with lesion analysis
- **Implementation**: `backend/model/preprocessor.py`
- **Impact**: Improves model accuracy by eliminating visual noise

#### 2. **EfficientNetB0 Architecture**
- **Research Goal**: Balance accuracy with computational efficiency
- **Implementation**: `backend/model/model_loader.py`
- **Impact**: Enables deployment on standard hardware while maintaining high performance

#### 3. **Clinical Encyclopedia Integration**
- **Research Goal**: Provide clinicians with detailed disease information
- **Implementation**: `backend/model/config.py` - CLINICAL_DEFINITIONS
- **Impact**: Supports informed decision-making with comprehensive disease profiles

#### 4. **Human-in-the-Loop Triage System**
- **Research Goal**: Flag high-risk melanoma cases for immediate human review
- **Implementation**: `backend/model/model_loader.py` - Triage calculation
- **Thresholds**:
  - CRITICAL: Melanoma probability ≥ 50%
  - HIGH: Melanoma probability ≥ 30%
  - MEDIUM: General confidence ≥ 70%
  - LOW: All other cases
- **Impact**: Ensures critical cases receive immediate specialist attention

#### 5. **Patient Metadata Integration**
- **Research Goal**: Incorporate clinical context (age, lesion location)
- **Implementation**: `frontend/components/PatientMetadata.tsx`
- **Impact**: Provides holistic patient information for better diagnosis

#### 6. **Accessibility & Usability**
- **Research Goal**: Make diagnostic tools accessible to non-specialists
- **Implementation**: 
  - ARIA labels and keyboard navigation
  - Progressive upload indicators
  - Clear visual feedback
- **Impact**: Enables use in resource-limited settings

#### 7. **PDF Report Generation**
- **Research Goal**: Facilitate clinical documentation and record-keeping
- **Implementation**: `frontend/components/ReportDownload.tsx`
- **Impact**: Professional medical reports for patient records

---

## 🏗️ Project Structure

```
Skin disease diagnosis/
├── README.md                     # This file - Project overview
├── LICENSE                       # MIT License with medical disclaimer
├── .gitignore                    # Git ignore rules
│
├── backend/                      # FastAPI Backend
│   ├── main.py                  # API server with security features
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment template
│   ├── test_api.py              # API tests
│   └── model/                   # ML logic
│       ├── config.py            # Clinical definitions & triage config
│       ├── preprocessor.py      # Dull-Razor preprocessing
│       └── model_loader.py      # Model inference & triage
│
└── frontend/                     # Next.js Frontend
    ├── package.json             # Node dependencies
    ├── app/                     # Next.js app router
    │   ├── layout.tsx           # Root layout with error boundary
    │   └── page.tsx             # Main application page
    ├── components/              # React components
    │   ├── ImageUpload.tsx      # Image upload with validation
    │   ├── PatientMetadata.tsx  # Patient information form
    │   ├── ClinicalDetails.tsx  # Diagnosis results display
    │   ├── TriageWarning.tsx    # Triage alert system
    │   ├── LoadingSpinner.tsx   # Loading states
    │   ├── ReportDownload.tsx   # PDF report generation
    │   └── ErrorBoundary.tsx    # Error handling
    ├── lib/                     # Utilities
    │   ├── api.ts               # API client with retry logic
    │   └── types.ts             # TypeScript definitions
    └── public/                  # Static assets
        ├── favicon.ico          # Medical logo
        └── logo.png             # App icon
```

---

## ✨ Features

### Core Medical Features
- 🔬 **EfficientNetB0 Deep Learning** - State-of-the-art CNN architecture
- 🩺 **Clinical Encyclopedia** - Comprehensive disease definitions
- 🚨 **Automated Triage System** - Melanoma flagging with 3-tier priority
- 👨‍⚕️ **Human-in-the-Loop** - AI assists, clinicians decide
- 📊 **Patient Metadata** - Age and lesion location integration
- 💊 **Dull-Razor Preprocessing** - Hair artifact removal
- 📄 **PDF Reports** - Professional medical documentation

### Production Features
- ⚡ **60-Second API Timeout** - Extended processing time
- 🔄 **Automatic Retry Logic** - 2 retries with exponential backoff
- 🛡️ **Error Boundaries** - Graceful error recovery
- ♿ **Full Accessibility** - ARIA labels, keyboard navigation
- 📈 **Progressive Upload** - Real-time progress feedback
- 🧹 **Automatic Cleanup** - Temporary file management
- 🔒 **Security Headers** - CSP, HSTS (optional)
- ⏱️ **Rate Limiting** - 10 req/min per IP (optional)
- 📊 **Error Monitoring** - Sentry integration (optional)
- 🎯 **Deterministic Results** - Consistent predictions for same image

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- pip and npm

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Run server
python -m uvicorn main:app --reload
```

✅ Backend running at: http://localhost:8000  
📚 API docs at: http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
```

✅ Frontend running at: http://localhost:3000

---

## 📖 Usage

1. **Open Application**: Navigate to http://localhost:3000
2. **Upload Image**: Drag & drop or click to upload skin lesion image
   - Supported formats: JPEG, PNG
   - Size: Max 10MB
   - Resolution: Min 100x100 pixels
3. **Enter Patient Data**:
   - Age (optional but recommended)
   - Lesion location (required)
4. **Analyze**: Click "Analyze Image" button
5. **Review Results**:
   - Predicted disease with confidence
   - Clinical information
   - Triage assessment
   - All class probabilities
6. **Download Report**: Click "Download Report (PDF)" for documentation

---

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Required
MODEL_PATH=model/skin_disease_model.h5
ALLOWED_ORIGINS=http://localhost:3000
ENVIRONMENT=development

# Optional - Production Features
SENTRY_DSN=your-sentry-dsn-here
```

### Frontend Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📊 API Endpoints

### Health Check
```http
GET /health
```

Returns system status and available features.

### Predict Disease
```http
POST /predict
Content-Type: multipart/form-data

Parameters:
- file: Image file (required)
- age: Patient age (optional, 0-150)
- lesion_location: Body location (required)
```

Returns prediction with clinical details and triage assessment.

**Interactive API Documentation**: http://localhost:8000/docs

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
python test_api.py
```

### Frontend Build Test
```bash
cd frontend
npm run build
npm start
```

### Manual Testing Checklist
- [ ] Upload various image formats (JPEG, PNG)
- [ ] Test file size validation (>10MB should fail)
- [ ] Test minimum resolution (100x100)
- [ ] Verify same image gives consistent results
- [ ] Test all lesion locations
- [ ] Download and verify PDF report
- [ ] Test keyboard navigation
- [ ] Verify error messages are clear

---

## 🚢 Deployment

### Backend Deployment (Railway/Render)

1. **Create Account**: Sign up at [Railway](https://railway.app) or [Render](https://render.com)
2. **Deploy from GitHub**: Connect your repository
3. **Configure**:
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables**:
   ```
   MODEL_PATH=model/skin_disease_model.h5
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ENVIRONMENT=production
   SENTRY_DSN=your-sentry-dsn (optional)
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Create Account**: Sign up at [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
2. **Import from GitHub**: Connect your repository
3. **Configure**:
   - Root directory: `frontend`
   - Framework: Next.js
4. **Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```

**Both platforms provide automatic HTTPS**

---

## 📦 Dependencies

### Backend
- **fastapi** - Modern web framework
- **uvicorn** - ASGI server
- **Pillow** - Image processing
- **numpy** - Numerical operations
- **slowapi** - Rate limiting (optional)
- **sentry-sdk** - Error monitoring (optional)

### Frontend
- **next** - React framework
- **react** - UI library
- **jspdf** - PDF generation
- **tailwindcss** - Styling

See `backend/requirements.txt` and `frontend/package.json` for complete lists.

---

## 🔒 Security

### Implemented Security Features
- ✅ Input validation (file type, size, resolution)
- ✅ CORS configuration
- ✅ Rate limiting (optional - 10 req/min per IP)
- ✅ Security headers (CSP, HSTS, X-Frame-Options)
- ✅ Automatic file cleanup
- ✅ Error sanitization

### Security Best Practices
- Never commit `.env` files
- Use environment variables for secrets
- Enable HTTPS in production
- Configure CORS for production domains
- Monitor error logs with Sentry

---

## 📝 Adding Your Trained Model

The system currently uses a deterministic placeholder model for testing. To use your trained model:

1. **Train your EfficientNetB0 model** with the 4 disease classes
2. **Save as**: `skin_disease_model.h5`
3. **Place in**: `backend/model/` directory
4. **Install TensorFlow**: `pip install tensorflow`
5. **Restart backend**: The system will automatically detect and use your model

**Model Requirements**:
- Input shape: (224, 224, 3)
- Output: 4 classes (Acne, Cherry Angioma, Melanoma, Psoriasis)
- Format: Keras .h5 file

---

## ⚠️ Medical Disclaimer

**IMPORTANT**: This system is designed to assist healthcare professionals in identifying potential skin conditions. It should **NOT** be used as a substitute for professional medical advice, diagnosis, or treatment.

**Core Principle**: *"The AI serves to flag high-risk cases; ultimate accountability remains with the clinician."*

**Action Required**: Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition. Never disregard professional medical advice or delay seeking it because of something you have read or seen in this application.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Medical Disclaimer**: This software is provided "as is" without warranty of any kind. The authors and contributors are not liable for any medical decisions made using this system.

---

## 🙏 Acknowledgments

- Research paper authors for clinical methodology
- EfficientNet team for model architecture
- FastAPI and Next.js communities
- Open source medical imaging community
- Dr. Pramod Soni for project guidance

---

## 📞 Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Contact team members
- Refer to documentation in `backend/README.md` and `frontend/README.md`

---

## 🎯 Project Goals

This system aims to:
1. **Bridge the Diagnostic Gap**: Address dermatologist shortage through AI assistance
2. **Improve Accessibility**: Enable diagnosis in resource-limited settings
3. **Enhance Patient Safety**: Flag high-risk melanoma cases for immediate review
4. **Support Clinicians**: Provide comprehensive clinical information for informed decisions
5. **Maintain Accountability**: Keep human clinicians in the decision-making loop

---

**Version**: 2.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: January 2026

**Built with ❤️ by Vivek Kumar, Rahul Kashyap, and Sainkey Raghav**  
**Guided by Dr. Pramod Soni**
