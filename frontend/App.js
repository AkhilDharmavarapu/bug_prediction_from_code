import React, { useState } from 'react';
import './App.css';
import CodeInput from './components/CodeInput';
import MetricsInput from './components/MetricsInput';
import PredictionResult from './components/PredictionResult';
import AnalysisResult from './components/AnalysisResult';

function App() {
  const [activeTab, setActiveTab] = useState('code');
  const [prediction, setPrediction] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedMetrics, setExtractedMetrics] = useState(null);
  const [error, setError] = useState(null);

  const handleCodeAnalysis = async (code) => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the analyze-code endpoint
      const response = await fetch('http://localhost:8000/analyze-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAnalysisResult(data);
        setExtractedMetrics(data.metrics);
        setPrediction(null);
        setError(null);
      } else {
        setError(data.message);
        setAnalysisResult(null);
      }
    } catch (err) {
      setError(`Failed to connect to backend: ${err.message}`);
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrediction = async (metrics) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics)
      });
      
      const data = await response.json();
      setPrediction(data);
      setError(null);
    } catch (err) {
      setError(`Failed to get prediction: ${err.message}`);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExtractedMetricsPrediction = () => {
    if (extractedMetrics) {
      const metricsForPrediction = {
        loc: extractedMetrics.loc,
        v_g: extractedMetrics.v_g,
        ev_g: extractedMetrics.ev_g,
        iv_g: extractedMetrics.iv_g,
        n: extractedMetrics.n,
        v: extractedMetrics.v,
        d: extractedMetrics.d,
        e: extractedMetrics.e
      };
      handlePrediction(metricsForPrediction);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <h1>🐛 Software Bug Prediction System</h1>
          <p>Predict the probability of bugs in your code using machine learning</p>
        </div>
      </header>

      <nav className="tabs">
        <button 
          className={`tab ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          📝 Analyze Code
        </button>
        <button 
          className={`tab ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          📊 Manual Input
        </button>
      </nav>

      <main className="container">
        {error && (
          <div className="error-message">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing...</p>
          </div>
        )}

        <div className="content">
          {activeTab === 'code' ? (
            <div className="tab-content">
              <div className="input-section">
                <CodeInput onAnalyze={handleCodeAnalysis} />
              </div>
              
              {analysisResult && (
                <div className="analysis-section">
                  <AnalysisResult 
                    result={analysisResult} 
                    onPredict={handleExtractedMetricsPrediction}
                  />
                </div>
              )}

              {prediction && (
                <div className="prediction-section">
                  <PredictionResult prediction={prediction} />
                </div>
              )}
            </div>
          ) : (
            <div className="tab-content">
              <MetricsInput onPredict={handlePrediction} />
              
              {prediction && (
                <div className="prediction-section">
                  <PredictionResult prediction={prediction} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Made with ❤️ | Bug Prediction System v1.0</p>
      </footer>
    </div>
  );
}

export default App;
