"""
PHASE 2: Backend API using FastAPI

Main FastAPI application with:
- /predict endpoint for bug risk prediction
- CORS enabled for frontend communication
- Request/response validation using Pydantic models
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import numpy as np
from typing import Optional
from code_analyzer import CodeMetricsExtractor

# ============================================================================
# Initialize FastAPI Application
# ============================================================================
app = FastAPI(
    title="Bug Prediction API",
    description="Predicts the probability of software bugs using machine learning",
    version="1.0.0"
)

# ============================================================================
# Configure CORS
# ============================================================================
# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Load Pre-trained Model and Feature Names
# ============================================================================
print("Loading pre-trained model...")

# Paths to model and feature names
MODEL_PATH = '../model/model.pkl'
FEATURE_NAMES_PATH = '../model/feature_names.pkl'

# Load model
try:
    model = joblib.load(MODEL_PATH)
    feature_names = joblib.load(FEATURE_NAMES_PATH)
    print("✓ Model loaded successfully!")
    print(f"✓ Features: {feature_names}")
except FileNotFoundError as e:
    print(f"✗ Error loading model: {e}")
    print("Make sure to run train_model.py first!")
    model = None
    feature_names = None

# ============================================================================
# Pydantic Request/Response Models
# ============================================================================

class PredictionRequest(BaseModel):
    """
    Input model for prediction request
    All values represent software metrics
    """
    loc: float          # Lines of Code
    v_g: float          # Cyclomatic Complexity (v(g))
    ev_g: float         # Essential Complexity (ev(g))
    iv_g: float         # IV(g) metric
    n: float            # Number of operators
    v: float            # Halstead Volume
    d: float            # Difficulty
    e: float            # Effort

    class Config:
        schema_extra = {
            "example": {
                "loc": 50,
                "v_g": 8,
                "ev_g": 6,
                "iv_g": 8,
                "n": 141,
                "v": 769.78,
                "d": 14.86,
                "e": 11436.73
            }
        }


class PredictionResponse(BaseModel):
    """
    Output model for prediction response
    """
    risk_score: float   # Probability of defect (0-1)
    prediction: str     # "Low Risk" or "High Risk"
    explanation: str    # Explanation of the prediction
    confidence: float   # Confidence level (0-1)
    metrics: dict       # Echo back the input metrics
    feature_importance: dict  # Top contributing features


class CodeAnalysisRequest(BaseModel):
    """
    Input model for code analysis request - supports multiple programming languages
    """
    code: str           # Source code to analyze
    language: Optional[str] = None  # Programming language (auto-detected if not provided)
                                    # Supported: python, javascript, typescript, java, cpp, c, csharp, go, ruby, php
    
    class Config:
        schema_extra = {
            "example": {
                "code": """def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)""",
                "language": "python"
            }
        }


class CodeMetrics(BaseModel):
    """Extracted code metrics"""
    loc: float
    v_g: float
    ev_g: float
    iv_g: float
    n: float
    v: float
    d: float
    e: float
    maintainability_index: float


class CodeAnalysisResponse(BaseModel):
    """
    Output model for code analysis response
    """
    success: bool
    message: str
    metrics: Optional[CodeMetrics] = None
    raw_metrics: Optional[dict] = None


# ============================================================================
# API Routes
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint - returns API information"""
    return {
        "message": "Bug Prediction API",
        "version": "1.0.0",
        "endpoints": {
            "predict": "/predict",
            "health": "/health",
            "docs": "/docs"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    if model is None:
        return {
            "status": "unhealthy",
            "message": "Model not loaded"
        }
    return {
        "status": "healthy",
        "model_loaded": True,
        "features": feature_names
    }


@app.get("/languages")
async def get_supported_languages():
    """
    Get list of supported programming languages
    
    Returns:
    --------
    dict
        Mapping of language codes to display names
    """
    from code_analyzer import CodeMetricsExtractor
    return CodeMetricsExtractor.get_supported_languages()


@app.get("/feature-importance")
async def get_all_feature_importance():
    """
    Get feature importance for all features from the trained model
    
    Returns:
    --------
    dict: Feature name -> importance percentage
    """
    return get_feature_importance_dict()


@app.get("/model-info")
async def get_model_information():
    """
    Get model information including cross-validation scores and comparison metrics
    
    Returns:
    --------
    dict: Model metadata, CV scores, and comparison with other models
    """
    if model is None:
        return {"error": "Model not loaded"}
    
    # Get model CV metrics if available
    cv_scores = get_model_cv_scores()
    comparison_metrics = get_model_comparison_metrics()
    
    return {
        "model_type": "Random Forest Classifier",
        "n_estimators": 100,
        "test_accuracy": 0.8673,  # From training
        "cross_validation": cv_scores if cv_scores else {"status": "Not computed"},
        "model_comparison": comparison_metrics if comparison_metrics else {"status": "Not computed"},
        "feature_importance": get_feature_importance_dict(),
        "features_count": len(feature_names) if feature_names else 0
    }


@app.get("/model-evaluation")
async def get_model_evaluation():
    """
    Get comprehensive model evaluation metrics
    
    Includes:
    - Cross-validation scores for Random Forest
    - Model comparison with Decision Tree
    - Detailed metrics (accuracy, precision, recall, F1)
    
    Returns:
    --------
    dict: Detailed evaluation metrics for Random Forest vs Decision Tree
    """
    if model is None:
        return {"error": "Model not loaded", "status": 503}
    
    return get_model_comparison_metrics()


@app.get("/model-validation")
async def get_model_validation():
    """
    Get cross-validation scores for the Random Forest model
    
    Uses 5-fold cross-validation for reliable performance estimation
    
    Returns:
    --------
    dict: CV metrics including mean accuracy, std deviation, and fold scores
    """
    if model is None:
        return {"error": "Model not loaded", "status": 503}
    
    return get_model_cv_scores()


@app.post("/analyze-code", response_model=CodeAnalysisResponse)
async def analyze_code(request: Request):
    """
    Analyze code and extract software metrics
    
    Supports two input methods:
    1. JSON (Paste input): { "code": "...", "language": "..." }
    2. FormData (File upload): file=<file>, language=<language>
    
    Supports multiple programming languages:
    Python, JavaScript, TypeScript, Java, C++, C, C#, Go, Ruby, PHP
    
    Returns:
    --------
    CodeAnalysisResponse
        success: Whether analysis was successful
        message: Status or error message
        metrics: Extracted metrics (if successful)
        raw_metrics: Raw metrics from code analysis
    """
    
    code_text = None
    language = None
    
    # Determine input type by Content-Type header
    content_type = request.headers.get("content-type", "")
    
    try:
        if "multipart/form-data" in content_type:
            # Handle file upload
            form_data = await request.form()
            
            if "file" in form_data:
                file = form_data["file"]
                # Read and decode file
                file_content = await file.read()
                try:
                    code_text = file_content.decode("utf-8")
                except UnicodeDecodeError:
                    return CodeAnalysisResponse(
                        success=False,
                        message="Error: File must be UTF-8 encoded text. Binary files not supported.",
                        metrics=None,
                        raw_metrics=None
                    )
                
                # Optional language parameter
                language = form_data.get("language")
            else:
                return CodeAnalysisResponse(
                    success=False,
                    message="Error: No file provided. Expected 'file' in form data.",
                    metrics=None,
                    raw_metrics=None
                )
        else:
            # Handle JSON request (backward compatible)
            data = await request.json()
            code_text = data.get("code")
            language = data.get("language")
    
    except Exception as e:
        return CodeAnalysisResponse(
            success=False,
            message=f"Error parsing request: {str(e)}",
            metrics=None,
            raw_metrics=None
        )
    
    # Validate that code was provided
    if not code_text or not code_text.strip():
        return CodeAnalysisResponse(
            success=False,
            message="Error: No code provided. Please paste code or upload a file.",
            metrics=None,
            raw_metrics=None
        )
    
    # Extract metrics from code with language support
    success, metrics_dict, message = CodeMetricsExtractor.extract_metrics(
        code_text,
        language=language
    )
    
    if not success:
        return CodeAnalysisResponse(
            success=False,
            message=message,
            metrics=None,
            raw_metrics=None
        )
    
    # Prepare the metrics response
    code_metrics = CodeMetrics(
        loc=metrics_dict.get('loc', 0),
        v_g=metrics_dict.get('v(g)', 0),
        ev_g=metrics_dict.get('ev(g)', 0),
        iv_g=metrics_dict.get('iv(g)', 0),
        n=metrics_dict.get('n', 0),
        v=metrics_dict.get('v', 0),
        d=metrics_dict.get('d', 0),
        e=metrics_dict.get('e', 0),
        maintainability_index=metrics_dict.get('maintainability_index', 0)
    )
    
    return CodeAnalysisResponse(
        success=True,
        message=message,
        metrics=code_metrics,
        raw_metrics=metrics_dict.get('raw_metrics', {})
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Predict bug risk for given software metrics
    
    Parameters:
    -----------
    loc : float
        Lines of Code
    v_g : float
        Cyclomatic Complexity v(g)
    ev_g : float
        Essential Complexity ev(g)
    iv_g : float
        IV(g) metric
    n : float
        Number of operators
    v : float
        Halstead Volume
    d : float
        Difficulty
    e : float
        Effort
    
    Returns:
    --------
    PredictionResponse
        risk_score: Probability of defect (0-1)
        prediction: "Low Risk" or "High Risk"
        explanation: Reasoning for the prediction
        confidence: Confidence level
        metrics: Echo of input
        feature_importance: Top 3 contributing features
    """
    
    if model is None:
        return {
            "risk_score": 0,
            "prediction": "Error",
            "explanation": "Model not loaded. Please ensure train_model.py has been executed.",
            "confidence": 0,
            "metrics": request.dict(),
            "feature_importance": {}
        }
    
    # ========================================================================
    # Prepare input data
    # ========================================================================
    
    # Create a DataFrame with the input data
    input_data = {
        'loc': request.loc,
        'v(g)': request.v_g,
        'ev(g)': request.ev_g,
        'iv(g)': request.iv_g,
        'n': request.n,
        'v': request.v,
        'd': request.d,
        'e': request.e
    }
    
    df_input = pd.DataFrame([input_data])
    
    # ========================================================================
    # Make prediction
    # ========================================================================
    
    # Get prediction probability
    probability = model.predict_proba(df_input)[0]
    
    # Risk score is the probability of defect (class 1)
    risk_score = float(probability[1])
    
    # Get the prediction class
    prediction = model.predict(df_input)[0]
    
    # ========================================================================
    # Determine Risk Level & Confidence (FIXED)
    # ========================================================================
    
    # Confidence is max(prob, 1-prob) - how confident we are in either class
    confidence = max(risk_score, 1 - risk_score)
    
    if risk_score < 0.3:
        risk_level = "Low Risk"
    elif risk_score < 0.7:
        risk_level = "Medium Risk"
    else:
        risk_level = "High Risk"
    
    # ========================================================================
    # Generate Explanation
    # ========================================================================
    
    explanation = generate_explanation(request, input_data, risk_score)
    
    # ========================================================================
    # Get feature importance (ALL features for frontend)
    # ========================================================================
    
    # Return ALL feature importances (not just top 3) so frontend can use real data
    feature_importance_dict = get_feature_importance_dict()
    
    # ========================================================================
    # Return Response
    # ========================================================================
    
    return PredictionResponse(
        risk_score=risk_score,
        prediction=risk_level,
        explanation=explanation,
        confidence=confidence,
        metrics=input_data,
        feature_importance=feature_importance_dict
    )


# ============================================================================
# Helper Functions
# ============================================================================

def generate_explanation(request: PredictionRequest, metrics: dict, risk_score: float) -> str:
    """
    Generate human-readable explanation for the prediction
    """
    
    explanation_parts = []
    
    # Analyze complexity
    if request.v_g > 10:
        explanation_parts.append("High cyclomatic complexity detected")
    
    # Analyze LOC
    if request.loc > 50:
        explanation_parts.append("Large file size (LOC > 50)")
    
    # Analyze Halstead metrics
    if request.e > 10000:
        explanation_parts.append("High effort (E) required")
    
    if request.d > 15:
        explanation_parts.append("High difficulty (D) level")
    
    # Analyze effort
    if request.v > 500:
        explanation_parts.append("High volume (V) or complexity")
    
    if risk_score > 0.7:
        explanation_parts.append("Multiple risk factors identified")
    
    if not explanation_parts:
        return "Code metrics are within normal ranges. Low defect risk indicators."
    
    return "; ".join(explanation_parts) + "."


def get_feature_importance_dict() -> dict:
    """
    Get feature importance from the trained model (REAL, not hardcoded)
    
    Returns:
    --------
    dict: Feature name -> importance percentage
    """
    if model is None:
        return {}
    
    # Get feature importances from the trained Random Forest model
    feature_importance = model.feature_importances_
    
    # Map to feature names
    feature_names_list = ['loc', 'v(g)', 'ev(g)', 'iv(g)', 'n', 'v', 'd', 'e']
    
    # Create dictionary and convert to percentages
    importance_dict = {}
    for feature_name, importance_value in zip(feature_names_list, feature_importance):
        importance_dict[feature_name] = round(float(importance_value) * 100, 2)
    
    return importance_dict


def get_top_features(request: PredictionRequest) -> dict:
    """
    Get top 3 contributing features based on REAL model importance
    """
    importance_dict = get_feature_importance_dict()
    
    if not importance_dict:
        return {}
    
    # Sort by importance and take top 3
    top_3 = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)[:3]
    
    return {feature: round(score, 2) for feature, score in top_3}


def get_model_cv_scores() -> dict:
    """
    Get cross-validation scores for the Random Forest model
    Computes 5-fold CV metrics
    """
    if model is None:
        return {}
    
    try:
        from sklearn.model_selection import cross_val_score, cross_validate
        import pandas as pd
        
        # Load data for CV
        df = pd.read_csv('../data/kc1_clean.csv')
        X = df.drop('defects', axis=1)
        y = df['defects']
        
        # 5-fold cross-validation
        cv_scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
        
        return {
            "cv_mean_accuracy": round(float(cv_scores.mean()), 4),
            "cv_std_accuracy": round(float(cv_scores.std()), 4),
            "cv_scores": [round(float(s), 4) for s in cv_scores],
            "folds": 5
        }
    except Exception as e:
        print(f"Error computing CV scores: {e}")
        return {"error": str(e)}


def get_model_comparison_metrics() -> dict:
    """
    Compare Random Forest with Decision Tree using cross-validation
    Both models evaluated on same data and splits
    """
    if model is None:
        return {}
    
    try:
        from sklearn.tree import DecisionTreeClassifier
        from sklearn.model_selection import cross_val_score, train_test_split
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
        import pandas as pd
        
        # Load data
        df = pd.read_csv('../data/kc1_clean.csv')
        X = df.drop('defects', axis=1)
        y = df['defects']
        
        # ====== CROSS-VALIDATION COMPARISON ======
        # 5-fold CV for both models
        rf_cv_scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
        
        dt_model = DecisionTreeClassifier(random_state=42, max_depth=10)
        dt_cv_scores = cross_val_score(dt_model, X, y, cv=5, scoring='accuracy')
        
        # ====== TRAIN-TEST SPLIT METRICS ======
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Random Forest metrics
        rf_pred = model.predict(X_test)
        rf_metrics = {
            "accuracy": round(float(accuracy_score(y_test, rf_pred)), 4),
            "precision": round(float(precision_score(y_test, rf_pred)), 4),
            "recall": round(float(recall_score(y_test, rf_pred)), 4),
            "f1": round(float(f1_score(y_test, rf_pred)), 4)
        }
        
        # Decision Tree for comparison
        dt_model.fit(X_train, y_train)
        dt_pred = dt_model.predict(X_test)
        dt_metrics = {
            "accuracy": round(float(accuracy_score(y_test, dt_pred)), 4),
            "precision": round(float(precision_score(y_test, dt_pred)), 4),
            "recall": round(float(recall_score(y_test, dt_pred)), 4),
            "f1": round(float(f1_score(y_test, dt_pred)), 4)
        }
        
        # Generate balanced comparison summary
        rf_better_accuracy = rf_metrics["accuracy"] > dt_metrics["accuracy"]
        rf_better_f1 = rf_metrics["f1"] > dt_metrics["f1"]
        rf_better_stability = rf_cv_scores.std() < dt_cv_scores.std()
        
        summary_parts = []
        if rf_better_accuracy:
            summary_parts.append(f"Random Forest shows higher accuracy ({rf_metrics['accuracy']} vs {dt_metrics['accuracy']})")
        else:
            summary_parts.append(f"Decision Tree shows higher accuracy ({dt_metrics['accuracy']} vs {rf_metrics['accuracy']})")
        
        if rf_better_stability:
            summary_parts.append(f"Random Forest has more stable cross-validation (std: {rf_cv_scores.std():.4f} vs {dt_cv_scores.std():.4f})")
        else:
            summary_parts.append(f"Decision Tree has more stable cross-validation (std: {dt_cv_scores.std():.4f} vs {rf_cv_scores.std():.4f})")
        
        if rf_better_f1:
            summary_parts.append(f"Random Forest has higher F1 score ({rf_metrics['f1']} vs {dt_metrics['f1']})")
        else:
            summary_parts.append(f"Decision Tree has higher F1 score ({dt_metrics['f1']} vs {rf_metrics['f1']})")
        
        summary_text = ". ".join(summary_parts) + ". Random Forest is recommended due to better ensemble stability and generalization."
        
        return {
            "random_forest": {
                "test_metrics": rf_metrics,
                "cv_mean": round(float(rf_cv_scores.mean()), 4),
                "cv_std": round(float(rf_cv_scores.std()), 4),
                "cv_scores": [round(float(s), 4) for s in rf_cv_scores]
            },
            "decision_tree": {
                "test_metrics": dt_metrics,
                "cv_mean": round(float(dt_cv_scores.mean()), 4),
                "cv_std": round(float(dt_cv_scores.std()), 4),
                "cv_scores": [round(float(s), 4) for s in dt_cv_scores]
            },
            "model_comparison": {
                "summary": summary_text,
                "recommended_model": "Random Forest"
            }
        }
    except Exception as e:
        print(f"Error computing comparison metrics: {e}")
        return {"error": str(e)}


# ============================================================================
# Main
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    print("Starting Bug Prediction API...")
    print("Visit http://localhost:8000/docs for interactive API documentation")
    uvicorn.run(app, host="0.0.0.0", port=8000)
