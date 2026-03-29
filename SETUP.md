# 🛠️ Installation & Setup Guide

Complete step-by-step instructions to get the Software Bug Prediction System running.

## 📋 Prerequisites

Before starting, ensure you have:

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 14+** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

### Verify Installation

```bash
# Check Python version
python --version
# Expected: Python 3.8+

# Check Node.js version
node --version
# Expected: v14+

# Check npm version  
npm --version
# Expected: 6+
```

---

## ✅ Step-by-Step Setup

### **STEP 1: Navigate to Project Directory**

```bash
cd c:\Users\dharm\bug_prediction_from_code
```

### **STEP 2: Create Python Virtual Environment** (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### **STEP 3: Install Python Dependencies**

```bash
pip install -r requirements.txt
```

**Expected Output:**
```
Successfully installed fastapi-0.104.1 
uvicorn-0.24.0 
pandas-2.1.2 
numpy-1.24.3 
scikit-learn-1.3.2 
joblib-1.3.2 
radon-6.0.1 
...
```

### **STEP 4: Verify Model Files**

Check that model files exist:

```bash
# Windows
dir model\

# Output should show:
# 29/03/2024  14:30    2,856,932 feature_names.pkl
# 29/03/2024  14:30   12,456,789 model.pkl
```

If model files don't exist, train them:

```bash
python train_model.py
```

### **STEP 5: Start Backend Server**

**Terminal 1:**

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (press ENTER to quit)
INFO:     Application startup complete
```

**Verify Backend is Running:**

Open browser: http://localhost:8000/docs

You should see the interactive API documentation (Swagger UI)

### **STEP 6: Install Frontend Dependencies**

**Terminal 2:**

```bash
cd frontend
npm install
```

**Expected Output:**
```
up to date, audited 120 packages in 2s

40 packages are looking for funding
```

### **STEP 7: Start Frontend Server**

**Terminal 2 (continued):**

```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view bug-prediction-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

The frontend will automatically open in your browser at http://localhost:3000

---

## 🎯 Verify Everything is Working

### Checklist:

- [ ] Terminal 1: Backend running on port 8000
- [ ] Terminal 2: Frontend running on port 3000
- [ ] Browser: http://localhost:3000 loads the app
- [ ] Browser: http://localhost:8000/docs shows API docs
- [ ] Frontend: "Load Sample Code" button works
- [ ] Frontend: Can type in metrics input
- [ ] Backend: Responds to requests

### Quick Test:

1. **Go to**: http://localhost:3000
2. **Tab 1**: Click "📋 Load Sample Code"
3. **Click**: "🚀 Analyze Code"
4. **Verify**: Metrics appear (LOC, complexity, etc.)
5. **Click**: "🎯 Get Bug Risk Prediction"
6. **Check**: Risk score and explanation display

---

## 🔌 Backend Health Check

Test the backend API directly:

```bash
# Health check
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","model_loaded":true,"features":["loc","v(g)","ev(g)","iv(g)","n","v","d","e"]}
```

---

## 📁 What Gets Created

After setup, your directory will have:

```
bug_prediction_from_code/
├── venv/                          # Virtual environment (if created)
│   ├── Scripts/
│   ├── Lib/
│   └── ...
│
├── frontend/
│   ├── node_modules/              # React dependencies (large!)
│   ├── build/                     # Created when you run npm build
│   └── ...
│
├── model/
│   ├── model.pkl                  # Trained model
│   └── feature_names.pkl          # Features
│
├── backend/
│   └── ...
│
└── ... (other files)
```

---

## 🔄 Daily Usage

### **Starting the System**

Open 2 terminals:

**Terminal 1 - Backend:**
```bash
cd c:\Users\dharm\bug_prediction_from_code
venv\Scripts\activate              # If using virtual environment
cd backend
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd c:\Users\dharm\bug_prediction_from_code
cd frontend
npm start
```

Then open: http://localhost:3000

---

## 🐛 Troubleshooting

### Problem: "Model not loaded"

**Cause**: model.pkl or feature_names.pkl missing

**Solution**:
```bash
# Make sure you're in the project root
cd c:\Users\dharm\bug_prediction_from_code

# Train the model
python train_model.py

# Verify files were created
dir model\
```

### Problem: "Port 8000 already in use"

**Cause**: Another process is using port 8000

**Solution**:
```bash
# Use a different port
cd backend
uvicorn main:app --port 8001
```

Then update frontend to use:
```bash
fetch('http://localhost:8001/predict', ...)
```

### Problem: "Port 3000 already in use"

**Cause**: Another process is using port 3000

**Solution**:
```bash
# Windows
set PORT=3001
npm start

# macOS/Linux
PORT=3001 npm start
```

### Problem: "Module not found" (Python)

**Cause**: Dependencies not installed

**Solution**:
```bash
pip install -r requirements.txt
```

### Problem: "Module not found" (React)

**Cause**: npm dependencies not installed

**Solution**:
```bash
cd frontend
npm install
```

### Problem: "CORS error" in frontend

**Cause**: Backend not running or wrong URL

**Solution**:
1. Check terminal 1 shows backend is running
2. Visit http://localhost:8000/docs in browser
3. If not loading, restart backend:
```bash
cd backend
uvicorn main:app --reload
```

### Problem: Can't connect to backend

**Cause**: Firewall blocking or wrong host

**Solution**:
```bash
# Make sure backend is accessible
curl http://localhost:8000/health

# Should return JSON response
```

### Problem: "No module named 'radon'"

**Cause**: Code analysis library not installed

**Solution**:
```bash
pip install radon==6.0.1
```

---

## 🧹 Cleanup

### Remove Virtual Environment

```bash
# Deactivate first
deactivate

# Remove folder
rmdir /s venv
```

### Remove Node Modules

```bash
cd frontend
rmdir /s node_modules
```

### Clean Build

```bash
# Python cache
cd frontend
npm run build   # Remove old build

# Python cache
python -m pip cache purge
```

---

## 🚀 Advanced Setup

### Using a Different Database

For distributed setups, you can modify `backend/main.py` to load models from cloud storage:

```python
# Example: Load from AWS S3
import boto3
s3 = boto3.client('s3')
s3.download_file('my-bucket', 'model.pkl', '../model/model.pkl')
model = joblib.load('../model/model.pkl')
```

### Production Deployment

For production, use:

```bash
# Backend (Gunicorn + Uvicorn)
gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app

# Frontend (Build first)
cd frontend
npm run build
# Deploy the build/ folder to Vercel/Netlify
```

### Docker Setup

Create `Dockerfile` for containerization:

```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0"]
```

---

## ✨ Environment Variables (Optional)

Create `.env` file in root:

```
# Backend
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
MODEL_PATH=./model/model.pkl
FEATURE_NAMES_PATH=./model/feature_names.pkl

# Frontend
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

Then load in Python:

```python
from dotenv import load_dotenv
import os

load_dotenv()
MODEL_PATH = os.getenv('MODEL_PATH', '../model/model.pkl')
```

---

## 📊 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 2 GB | 8 GB |
| Disk | 500 MB | 2 GB |
| Python | 3.8 | 3.10+ |
| Node.js | 14 | 18+ |

---

## 📞 Getting Help

If you encounter issues:

1. **Check Troubleshooting** section above
2. **Review README.md** for detailed docs
3. **Check browser console** (F12) for frontend errors
4. **Check terminal output** for backend errors
5. **Verify port 8000 and 3000** are available
6. **Run health check**: curl http://localhost:8000/health

---

## ✅ Validation Checklist

Before declaring setup complete:

- [ ] Python 3.8+ installed
- [ ] Node.js 14+ installed
- [ ] Virtual environment created (optional but recommended)
- [ ] Dependencies installed (pip install -r requirements.txt)
- [ ] Model files exist (model.pkl, feature_names.pkl)
- [ ] Backend starts without errors
- [ ] Frontend installs without errors
- [ ] Frontend starts and loads http://localhost:3000
- [ ] Sample code works
- [ ] Manual metrics input works
- [ ] API docs load at /docs
- [ ] Health check works

---

## 🎓 Next Steps

After successful setup:

1. **Read README.md** - Comprehensive documentation
2. **Check QUICKSTART.md** - Quick usage guide
3. **Explore API docs** - http://localhost:8000/docs
4. **Try sample code** - Click "Load Sample Code"
5. **Analyze your own code** - Test with your Python files
6. **Review predictions** - Understand the risk scoring

---

## 📚 Additional Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **Scikit-learn**: https://scikit-learn.org/
- **Radon**: https://radon.readthedocs.io/

---

**Setup Complete! Happy Bug Predicting! 🎉**

For issues or questions, refer to the main README.md or PROJECT_SUMMARY.md
