# 🐛 Software Bug Prediction System

A complete end-to-end machine learning system that predicts the probability of software bugs in code modules using advanced software metrics and machine learning.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Model Performance](#model-performance)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Project Overview

This system analyzes Python code to extract software metrics and predict bug risk using a trained Random Forest classifier. It provides both:

1. **Code Analysis**: Automatic metric extraction from source code
2. **Manual Input**: Direct metric input for prediction
3. **Risk Assessment**: Bug probability with explanation and recommendations

**Business Value:**
- Early detection of high-risk code modules
- Prioritize code review efforts
- Reduce defect escape rates
- Improve code quality metrics

---

## ✨ Features

### Phase 1: Machine Learning Model
- ✅ Random Forest Classifier (100 trees)
- ✅ 86.73% accuracy on test set
- ✅ Feature importance analysis
- ✅ Model serialization (joblib)

### Phase 2: RESTful Backend API
- ✅ FastAPI with automatic documentation
- ✅ CORS enabled for frontend
- ✅ `/predict` endpoint for risk scoring
- ✅ `/analyze-code` endpoint for code analysis
- ✅ `/health` endpoint for system status

### Phase 3: Code Analysis
- ✅ Automatic metric extraction using radon
- ✅ LOC (Lines of Code) calculation
- ✅ Cyclomatic complexity analysis
- ✅ Halstead metrics estimation
- ✅ Maintainability index

### Phase 4: React Frontend
- ✅ Clean, modern UI with Tailwind-like styling
- ✅ Code input textarea with sample code
- ✅ Manual metrics input form
- ✅ Real-time prediction display
- ✅ Risk visualization with gauges
- ✅ Feature importance display
- ✅ Recommendations engine
- ✅ Responsive design (mobile-friendly)

---

## 🏗️ Tech Stack

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Data Processing**: Pandas, NumPy
- **ML**: Scikit-learn, Random Forest
- **Code Analysis**: Radon
- **Serialization**: Joblib

### Frontend
- **Library**: React 18.2
- **HTTP Client**: Axios
- **Styling**: CSS3 (custom)
- **Build Tool**: Create React App

### Model Training
- **Language**: Python 3.8+
- **Dataset**: KC1 software metrics (2,109 samples)
- **Target**: Defect prediction (binary: 0/1)

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────┐
│           React Frontend (Port 3000)             │
│  ┌──────────────┐      ┌──────────────┐         │
│  │ Code Input   │  OR  │ Manual Input │         │
│  └──────────────┘      └──────────────┘         │
└─────────────────────────────────────────────────┘
                    ↓ HTTP Requests
┌─────────────────────────────────────────────────┐
│        FastAPI Backend (Port 8000)              │
│  ┌─────────────────────────────────────────┐    │
│  │ /analyze-code   /predict   /health      │    │
│  └─────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────┐   │
│  │ Random Forest Model (model.pkl)          │   │
│  │ Feature Names (feature_names.pkl)        │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Data Flow

1. **Input Phase**: User submits code or manual metrics
2. **Analysis Phase**: 
   - Code → Extract metrics via radon
   - Manual → Validate input
3. **Prediction Phase**: Metrics → Random Forest → Probability
4. **Output Phase**: Display risk score, explanation, recommendations

---

## 📁 Project Structure

```
bug_prediction_from_code/
│
├── data/
│   └── kc1_clean.csv                 # Training dataset (2,109 samples)
│
├── model/
│   ├── model.pkl                     # Trained Random Forest model
│   └── feature_names.pkl             # Feature column names
│
├── backend/
│   ├── main.py                       # FastAPI application
│   ├── code_analyzer.py              # Code metric extraction
│   ├── utils.py                      # Utility functions
│   └── requirements.txt              # Backend dependencies
│
├── frontend/
│   ├── public/
│   │   └── index.html               # HTML entry point
│   ├── components/
│   │   ├── CodeInput.js             # Code input component
│   │   ├── CodeInput.css
│   │   ├── MetricsInput.js          # Manual metrics input
│   │   ├── MetricsInput.css
│   │   ├── PredictionResult.js      # Results display
│   │   ├── PredictionResult.css
│   │   ├── AnalysisResult.js        # Code analysis results
│   │   └── AnalysisResult.css
│   ├── App.js                        # Main React component
│   ├── App.css
│   ├── index.js                      # React entry point
│   ├── index.css
│   └── package.json                  # Frontend dependencies
│
├── docs/
│   └── (Future documentation)
│
├── train_model.py                    # ML model training script
├── requirements.txt                  # Main project requirements
└── README.md                         # This file
```

---

## 🚀 Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Step 1: Clone Repository

```bash
cd bug_prediction_from_code
```

### Step 2: Backend Setup

**Install Python dependencies:**

```bash
pip install -r requirements.txt
```

**Train the model (if not already trained):**

```bash
python train_model.py
```

You should see output:
```
================================================================================
PHASE 1: COMPLETED SUCCESSFULLY!
================================================================================
Accuracy: 0.8673 (86.73%)
✓ Model saved to: model/model.pkl
✓ Feature names saved to: model/feature_names.pkl
```

**Start the FastAPI server:**

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at: http://localhost:8000

**API Documentation:** http://localhost:8000/docs (Swagger UI)

### Step 3: Frontend Setup

**Install Node dependencies:**

```bash
cd frontend
npm install
```

**Start the React development server:**

```bash
npm start
```

The frontend will open at: http://localhost:3000

---

## 📖 Usage

### Option 1: Analyze Code

1. Go to "📝 Analyze Code" tab
2. Paste Python code in the textarea
3. Click "🚀 Analyze Code"
4. Review extracted metrics
5. Click "🎯 Get Bug Risk Prediction"
6. View risk score and recommendations

### Option 2: Manual Input

1. Go to "📊 Manual Input" tab
2. Enter software metrics:
   - **LOC**: Lines of Code (0+)
   - **v(g)**: Cyclomatic Complexity (1+)
   - **ev(g)**: Essential Complexity (1+)
   - **iv(g)**: IV(g) metric (1+)
   - **n**: Number of operators (0+)
   - **v**: Halstead Volume (0+)
   - **d**: Difficulty (0+)
   - **e**: Effort (0+)
3. Click "🚀 Predict Bug Risk"
4. View prediction results

---

## 🔗 API Documentation

### Endpoint 1: Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "features": ["loc", "v(g)", "ev(g)", "iv(g)", "n", "v", "d", "e"]
}
```

### Endpoint 2: Analyze Code

```http
POST /analyze-code
Content-Type: application/json

{
  "code": "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Metrics extracted successfully",
  "metrics": {
    "loc": 5,
    "v_g": 2.5,
    "ev_g": 1.8,
    "iv_g": 2.5,
    "n": 12,
    "v": 156.3,
    "d": 8.5,
    "e": 1328.6,
    "maintainability_index": 87.5
  },
  "raw_metrics": {
    "loc": 5,
    "lloc": 4,
    "sloc": 4,
    "comments": 0,
    "multi": 0,
    "single_line": 0,
    "blank": 1
  }
}
```

### Endpoint 3: Predict Bug Risk

```http
POST /predict
Content-Type: application/json

{
  "loc": 50,
  "v_g": 8,
  "ev_g": 6,
  "iv_g": 8,
  "n": 141,
  "v": 769.78,
  "d": 14.86,
  "e": 11436.73
}
```

**Response:**
```json
{
  "risk_score": 0.687,
  "prediction": "High Risk",
  "explanation": "High cyclomatic complexity detected; Large file size (LOC > 50); High effort (E) required; High difficulty (D) level; Multiple risk factors identified.",
  "confidence": 0.687,
  "metrics": {
    "loc": 50,
    "v_g": 8,
    "ev_g": 6,
    "iv_g": 8,
    "n": 141,
    "v": 769.78,
    "d": 14.86,
    "e": 11436.73
  },
  "feature_importance": {
    "v": 0.3856,
    "e": 0.3426,
    "d": 0.3054
  }
}
```

---

## 📊 Model Performance

### Dataset Information
- **Total Samples**: 2,109
- **Training Set**: 1,687 (80%)
- **Test Set**: 422 (20%)
- **Class Distribution**: 1,783 no defect (84.5%), 326 defect (15.5%)

### Model Metrics
- **Algorithm**: Random Forest Classifier (100 trees)
- **Accuracy**: **86.73%**
- **Precision (Defect)**: 0.66
- **Recall (Defect)**: 0.29
- **F1-Score**: 0.40

### Confusion Matrix
```
              Predicted
            No Def    Def
Actual   No Def  347    10
         Def      46    19
```

### Feature Importance (Top 5)
| Feature | Importance |
|---------|------------|
| v (Volume) | 0.201 |
| e (Effort) | 0.177 |
| loc (Lines of Code) | 0.161 |
| d (Difficulty) | 0.159 |
| n (Operators) | 0.154 |

---

## 📈 Metrics Explanation

### **LOC (Lines of Code)**
- Indicator of code size
- Higher LOC generally correlates with more bugs
- Threshold: Consider refactoring if LOC > 100

### **v(g) - Cyclomatic Complexity**
- Measures decision paths in code
- Higher values indicate more complex control flow
- Threshold: Keep v(g) < 10 for maintainability

### **Halstead Metrics**
- **Volume (V)**: Amount of information flow in code
- **Difficulty (D)**: Difficulty to write and understand
- **Effort (E)**: Total effort required (D × V)
- Higher values indicate greater risk

### **Maintainability Index**
- Composite metric (0-100)
- Combines LOC, cyclomatic complexity, Halstead metrics
- > 85: High, 70-85: Medium, < 70: Low

---

## 🔧 Configuration

### Backend Configuration
Edit `backend/main.py`:

```python
# CORS settings (line 23)
allow_origins=["*"]  # Specify frontend URL in production

# Model paths (line 34-35)
MODEL_PATH = '../model/model.pkl'
FEATURE_NAMES_PATH = '../model/feature_names.pkl'
```

### Frontend Configuration
Edit `frontend/App.js`:

```javascript
// Backend URL (line 17)
const response = await fetch('http://localhost:8000/analyze-code', {
```

In production, change to your backend URL.

---

## 🐛 Troubleshooting

### Issue: "Model not loaded" error
**Solution**: Run `python train_model.py` in the root directory

### Issue: CORS errors
**Solution**: Backend CORS is already enabled for all origins. Check that backend is running on port 8000.

### Issue: Port already in use
**Solution**: 
```bash
# For port 8000 (backend)
uvicorn main:app --reload --port 8001

# For port 3000 (frontend)
PORT=3001 npm start
```

### Issue: Code analysis not working
**Solution**: Ensure radon is installed: `pip install radon`

---

## 📚 Dataset Information

**KC1 Software Metrics Dataset**
- Source: PROMISE Software Engineering Repository
- Samples: 2,109 software modules
- Features: 8 software metrics
- Target: Binary defect indicator (0=no defect, 1=defect)

**Columns:**
- `loc` - Lines of Code
- `v(g)` - Cyclomatic Complexity
- `ev(g)` - Essential Complexity
- `iv(g)` - IV(g) metric
- `n` - Number of operators
- `v` - Halstead Volume
- `d` - Difficulty
- `e` - Effort
- `defects` - Target variable

---

## 🚀 Deployment

### Backend Deployment (Heroku Example)

```bash
# Create Procfile
echo "web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT" > Procfile

# Deploy
heroku create bug-prediction-api
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
cd frontend
npm run build
# Deploy the build folder to Vercel
```

---

## 📝 Future Enhancements

- [ ] Support for other programming languages (Java, C++, JS)
- [ ] Real-time code analysis as you type
- [ ] Historical tracking of predictions
- [ ] User authentication
- [ ] Advanced visualizations (3D scatter plots)
- [ ] Export reports (PDF, Excel)
- [ ] Integration with GitHub/GitLab
- [ ] Cloud deployment (AWS, GCP, Azure)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👨‍💻 Author

Built with ❤️ for software quality improvement

---

## 📞 Support

For issues, questions, or suggestions:
1. Check the Troubleshooting section
2. Review API documentation at `/docs`
3. Open an issue in the repository

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
