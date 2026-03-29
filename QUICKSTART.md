# 🚀 Quick Start Guide

## 5-Minute Setup

### Terminal 1: Backend Setup & Model Training

```bash
# Navigate to project root
cd bug_prediction_from_code

# Install Python dependencies
pip install -r requirements.txt

# Train the ML model (one-time setup)
python train_model.py

# Start the FastAPI server
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
✓ Model saved to: model/model.pkl
INFO:     Application startup complete [press ENTER to quit]
```

### Terminal 2: Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install React dependencies
npm install

# Start the React development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view bug-prediction-frontend in the browser.
  Local:            http://localhost:3000
```

---

## 3 Simple Steps to Use

1. **Open Frontend**: http://localhost:3000
2. **Choose Method**:
   - **Tab 1**: Paste Python code → Click "Analyze Code" → Click "Get Prediction"
   - **Tab 2**: Enter metrics manually → Click "Predict Bug Risk"
3. **View Results**: See risk score, explanation, and recommendations

---

## File Locations Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| Trained Model | `model/model.pkl` | Random Forest classifier |
| Feature Names | `model/feature_names.pkl` | Feature column names |
| Backend API | `backend/main.py` | FastAPI application |
| Code Analyzer | `backend/code_analyzer.py` | Metric extraction |
| Frontend App | `frontend/App.js` | React main component |
| Dataset | `data/kc1_clean.csv` | Training data |
| Training Script | `train_model.py` | ML model training |

---

## API Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Check system status |
| `/analyze-code` | POST | Extract metrics from code |
| `/predict` | POST | Get bug risk prediction |
| `/docs` | GET | Interactive API docs |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Model not loaded" | Run: `python train_model.py` |
| Port 8000 in use | Run: `uvicorn main:app --port 8001` |
| Port 3000 in use | Run: `PORT=3001 npm start` |
| CORS error | Check backend is running (http://localhost:8000/docs) |
| Module not found | Run: `pip install -r requirements.txt` |

---

## Key Commands

```bash
# Train model
python train_model.py

# Start backend
cd backend && uvicorn main:app --reload

# Start frontend
cd frontend && npm start

# Check backend health
curl http://localhost:8000/health

# View API docs
open http://localhost:8000/docs
```

---

## Architecture Overview

```
User Input
    ↓
React Frontend (Port 3000)
    ↓ (HTTP Request)
FastAPI Backend (Port 8000)
    ↓
Code Analyzer (radon)  OR  Model Predictor
    ↓
Random Forest Model (model.pkl)
    ↓ (Prediction)
Risk Score & Explanation
    ↓
Display Results (Frontend)
```

---

## Next Steps

1. ✅ Run both servers
2. ✅ Try sample code (click "Load Sample Code")
3. ✅ Experiment with manual metrics
4. ✅ Analyze your own Python code
5. ✅ Check API docs at /docs
6. ✅ Deploy to production (see README.md)

---

## Performance Stats

- **Model Accuracy**: 86.73%
- **Processing Time**: < 100ms
- **Frontend Response**: Instant
- **Dataset Size**: 2,109 samples
- **Features Used**: 8 software metrics

---

**Happy Bug Predicting! 🎉**
