import React from 'react';
import './PredictionResult.css';
import RiskBreakdown from './RiskBreakdown';

function PredictionResult({ prediction, metrics }) {
  const { risk_score, prediction: risk_level, explanation, confidence } = prediction;

  const getRiskColor = (score) => {
    if (score < 0.3) return { bg: '#ecfdf5', border: '#059669', text: '#047857', level: 'Low' };
    if (score < 0.7) return { bg: '#fffbeb', border: '#d97706', text: '#b45309', level: 'Medium' };
    return { bg: '#fef2f2', border: '#dc2626', text: '#b91c1c', level: 'High' };
  };

  const riskInfo = getRiskColor(risk_score);

  const getRiskDescription = (score) => {
    if (score < 0.3) return 'Your code quality metrics indicate low bug probability. Continue with current practices.';
    if (score < 0.7) return 'Your code shows moderate complexity. Review and optimize high-risk sections.';
    return 'Your code exhibits high complexity. Consider refactoring and comprehensive testing.';
  };

  return (
    <div className="prediction-result">
      <h2 className="result-title">Quality Assessment</h2>
      
      <div className="risk-card" style={{ borderLeftColor: riskInfo.border, backgroundColor: riskInfo.bg }}>
        <div className="risk-content">
          <div className="risk-level">
            <span className="risk-badge" style={{ backgroundColor: riskInfo.border }}>{riskInfo.level} Risk</span>
            <p className="risk-score-large">{(risk_score * 100).toFixed(1)}%</p>
          </div>
          <div className="risk-meta">
            <div className="meta-item">
              <span className="meta-label">Confidence:</span>
              <span className="meta-value">{(confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Assessment:</span>
              <span className="meta-value">{getRiskDescription(risk_score)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="gauge-container">
        <div className="gauge-label">
          <span className="gauge-min">Low Risk</span>
          <span className="gauge-max">High Risk</span>
        </div>
        <div className="gauge-background">
          <div 
            className="gauge-fill" 
            style={{ 
              width: `${risk_score * 100}%`, 
              background: `linear-gradient(90deg, #059669 0%, #d97706 50%, #dc2626 100%)`
            }} 
          />
        </div>
      </div>

      <div className="insights-section">
        <h3 className="section-subtitle">Key Insights</h3>
        <div className="insight-card">
          <div className="insight-icon">📊</div>
          <div className="insight-content">
            <p className="insight-title">Code Metrics Analysis</p>
            <p className="insight-text">{explanation}</p>
          </div>
        </div>
      </div>

      <div className="recommendations">
        <h3 className="section-subtitle">Recommended Actions</h3>
        <ul className="recommendations-list">
          {risk_score >= 0.7 ? (
            <>
              <li>🔴 High Priority: Reduce cyclomatic complexity by breaking down complex functions</li>
              <li>🔴 High Priority: Increase unit test coverage for critical code paths</li>
              <li>🟡 Medium Priority: Consider code refactoring to improve module coupling</li>
              <li>🟡 Medium Priority: Review error handling and edge cases</li>
            </>
          ) : risk_score >= 0.3 ? (
            <>
              <li>🟡 Medium Priority: Review functions with high complexity</li>
              <li>🟡 Medium Priority: Improve test coverage for edge cases</li>
              <li>🟢 Low Priority: Consider code style improvements</li>
            </>
          ) : (
            <>
              <li>🟢 Excellent: Maintain current code quality standards</li>
              <li>🟢 Good: Continue regular code reviews and testing practices</li>
              <li>🟢 Good: Document complex algorithms for team knowledge sharing</li>
            </>
          )}
        </ul>
      </div>

      {metrics && (
        <RiskBreakdown 
          metrics={metrics} 
          riskScore={risk_score} 
          prediction={risk_level}
        />
      )}
    </div>
  );
}

export default PredictionResult;
