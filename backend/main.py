"""
PHASE 2: Backend API using FastAPI

Main FastAPI application with:
- /predict endpoint for bug risk prediction
- CORS enabled for frontend communication
- Request/response validation using Pydantic models
"""

from fastapi import FastAPI
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


@app.post("/analyze-code", response_model=CodeAnalysisResponse)
async def analyze_code(request: CodeAnalysisRequest):
    """
    Analyze code and extract software metrics
    
    Supports multiple programming languages:
    Python, JavaScript, TypeScript, Java, C++, C, C#, Go, Ruby, PHP
    
    Parameters:
    -----------
    code : str
        Source code to analyze
    language : str, optional
        Programming language (auto-detected if not provided)
        Supported: python, javascript, typescript, java, cpp, c, csharp, go, ruby, php
    
    Returns:
    --------
    CodeAnalysisResponse
        success: Whether analysis was successful
        message: Status or error message
        metrics: Extracted metrics (if successful)
        raw_metrics: Raw metrics from code analysis
    """
    
    # Extract metrics from code with language support
    success, metrics_dict, message = CodeMetricsExtractor.extract_metrics(
        request.code,
        language=request.language
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
    # Determine Risk Level
    # ========================================================================
    
    if risk_score < 0.3:
        risk_level = "Low Risk"
        confidence = 1 - risk_score
    elif risk_score < 0.7:
        risk_level = "Medium Risk"
        confidence = abs(risk_score - 0.5) * 2
    else:
        risk_level = "High Risk"
        confidence = risk_score
    
    # ========================================================================
    # Generate Explanation
    # ========================================================================
    
    explanation = generate_explanation(request, input_data, risk_score)
    
    # ========================================================================
    # Get feature importance
    # ========================================================================
    
    feature_importance_dict = get_top_features(request)
    
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


def get_top_features(request: PredictionRequest) -> dict:
    """
    Get top 3 contributing features
    Based on model's feature importance and metric values
    """
    
    # Feature importance from trained model
    feature_importance_scores = {
        'v': 0.201,       # Halstead Volume
        'e': 0.177,       # Effort
        'loc': 0.161,     # Lines of Code
        'd': 0.159,       # Difficulty
        'n': 0.154,       # Operators
        'v(g)': 0.068,    # Cyclomatic Complexity
        'iv(g)': 0.052,   # IV(g)
        'ev(g)': 0.029    # Essential Complexity
    }
    
    # Map input values to feature importance
    feature_values = {
        'v': request.v,
        'e': request.e,
        'loc': request.loc,
        'd': request.d,
        'n': request.n,
        'v(g)': request.v_g,
        'iv(g)': request.iv_g,
        'ev(g)': request.ev_g
    }
    
    # Calculate combined importance (importance score × normalized metric value)
    combined_importance = {}
    for feature, importance in feature_importance_scores.items():
        value = feature_values[feature]
        normalized_value = min(value / 100, 1.0)  # Normalize to 0-1
        combined_importance[feature] = importance * (1 + normalized_value)
    
    # Get top 3
    top_3 = sorted(combined_importance.items(), key=lambda x: x[1], reverse=True)[:3]
    
    return {feature: round(score, 4) for feature, score in top_3}


# ============================================================================
# Main
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    print("Starting Bug Prediction API...")
    print("Visit http://localhost:8000/docs for interactive API documentation")
    uvicorn.run(app, host="0.0.0.0", port=8000)
