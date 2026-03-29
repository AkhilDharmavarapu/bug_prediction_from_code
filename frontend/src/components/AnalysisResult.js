import React from 'react';
import './AnalysisResult.css';

function AnalysisResult({ result, onPredict }) {
  const { metrics, message } = result;

  if (!metrics) {
    return (
      <div className="analysis-result error-state">
        <div className="error-header">⚠️ Analysis Failed</div>
        <p className="error-message">{message}</p>
      </div>
    );
  }

  const getMetricDescription = (name) => {
    const descriptions = {
      'loc': 'Lines of Code - Total lines in the source',
      'v_g': 'Cyclomatic Complexity - Code path diversity',
      'v': 'Halstead Volume - Code size and complexity',
      'd': 'Difficulty - Implementation complexity',
      'e': 'Effort - Time to understand the code',
      'maintainability_index': 'Maintainability Index - Code quality score'
    };
    return descriptions[name] || '';
  };

  return (
    <div className="analysis-result">
      <div className="analysis-header">
        <h2>Code Metrics Extracted</h2>
        <p className="analysis-message">{message}</p>
      </div>
      
      <div className="metrics-display">
        <h3 className="metrics-title">Software Metrics</h3>
        <div className="metrics-cards">
          <div className="metric-card" title={getMetricDescription('loc')}>
            <div className="metric-value">{metrics.loc.toFixed(0)}</div>
            <div className="metric-label">LOC</div>
            <div className="metric-hint">Lines of Code</div>
          </div>
          
          <div className="metric-card" title={getMetricDescription('v_g')}>
            <div className="metric-value">{metrics.v_g.toFixed(2)}</div>
            <div className="metric-label">v(g)</div>
            <div className="metric-hint">Complexity</div>
          </div>
          
          <div className="metric-card" title={getMetricDescription('v')}>
            <div className="metric-value">{metrics.v.toFixed(0)}</div>
            <div className="metric-label">Volume</div>
            <div className="metric-hint">Code Size</div>
          </div>
          
          <div className="metric-card" title={getMetricDescription('d')}>
            <div className="metric-value">{metrics.d.toFixed(2)}</div>
            <div className="metric-label">Difficulty</div>
            <div className="metric-hint">Implementation</div>
          </div>
          
          <div className="metric-card" title={getMetricDescription('e')}>
            <div className="metric-value">{metrics.e.toFixed(0)}</div>
            <div className="metric-label">Effort</div>
            <div className="metric-hint">Understandability</div>
          </div>
          
          <div className="metric-card" title={getMetricDescription('maintainability_index')}>
            <div className="metric-value">{metrics.maintainability_index.toFixed(1)}</div>
            <div className="metric-label">MI</div>
            <div className="metric-hint">Maintainability</div>
          </div>
        </div>
      </div>
      
      <div className="action-section">
        <button className="btn-predict" onClick={onPredict}>
          ✓ Analyze for Bug Risk
        </button>
      </div>
    </div>
  );
}

export default AnalysisResult;
