import React, { useState } from 'react';
import './App.css';
import CodeInput from './components/CodeInput';
import MetricsInput from './components/MetricsInput';
import PredictionResult from './components/PredictionResult';
import AnalysisResult from './components/AnalysisResult';
import { API_BASE_URL } from './config';

function App() {
  const [activeTab, setActiveTab] = useState('code');
  const [prediction, setPrediction] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedMetrics, setExtractedMetrics] = useState(null);
  const [currentMetrics, setCurrentMetrics] = useState(null);
  const [error, setError] = useState(null);

  const handleCodeAnalysis = async (code) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/analyze-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      const data = await response.json();
      if (data.success) {
        setAnalysisResult(data);
        setExtractedMetrics(data.metrics);
        setPrediction(null);
      } else {
        setError(data.message);
        setAnalysisResult(null);
      }
    } catch (err) {
      setError(`Failed to connect to backend: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrediction = async (metrics) => {
    setLoading(true);
    setError(null);
    setCurrentMetrics(metrics);
    
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics)
      });
      
      setPrediction(await response.json());
    } catch (err) {
      setError(`Failed to get prediction: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExtractedMetricsPrediction = () => {
    if (extractedMetrics) {
      handlePrediction({
        loc: extractedMetrics.loc,
        v_g: extractedMetrics.v_g,
        ev_g: extractedMetrics.ev_g,
        iv_g: extractedMetrics.iv_g,
        n: extractedMetrics.n,
        v: extractedMetrics.v,
        d: extractedMetrics.d,
        e: extractedMetrics.e
      });
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>Code Quality Analyzer</h1>
            <p className="subtitle">Identify potential bugs before they reach production</p>
          </div>
        </div>
      </header>

      <nav className="navigation">
        <div className="nav-container">
          <button 
            className={`nav-button ${activeTab === 'code' ? 'active' : ''}`} 
            onClick={() => setActiveTab('code')}
          >
            <span className="nav-icon">💻</span>
            <span className="nav-label">Code Analysis</span>
          </button>
          <button 
            className={`nav-button ${activeTab === 'metrics' ? 'active' : ''}`} 
            onClick={() => setActiveTab('metrics')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-label">Manual Entry</span>
          </button>
        </div>
      </nav>

      <main className="main-container">
        <div className="content-wrapper">
          {error && (
            <div className="alert alert-error">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <strong>Unable to Process</strong>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p className="loading-text">Analyzing code quality...</p>
            </div>
          )}

          {activeTab === 'code' ? (
            <div className="tab-content">
              <div className="input-section">
                <CodeInput onAnalyze={handleCodeAnalysis} />
              </div>
              {analysisResult && (
                <div className="analysis-section">
                  <AnalysisResult result={analysisResult} onPredict={handleExtractedMetricsPrediction} />
                </div>
              )}
              {prediction && (
                <div className="prediction-section">
                  <PredictionResult prediction={prediction} metrics={currentMetrics} />
                </div>
              )}
            </div>
          ) : (
            <div className="tab-content">
              <MetricsInput onPredict={handlePrediction} />
              {prediction && (
                <div className="prediction-section">
                  <PredictionResult prediction={prediction} metrics={currentMetrics} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>Code Quality Analyzer • Powered by Machine Learning</p>
          <p className="footer-meta">v1.0 • Enterprise Edition</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
