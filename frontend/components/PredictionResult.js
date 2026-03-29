import React from 'react';
import './PredictionResult.css';

function PredictionResult({ prediction }) {
  const { risk_score, prediction: risk_level, explanation, confidence, feature_importance } = prediction;

  // Determine risk level color
  const getRiskColor = (score) => {
    if (score < 0.3) return '#28a745'; // Green
    if (score < 0.7) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  // Determine risk icon
  const getRiskIcon = (score) => {
    if (score < 0.3) return '✅';
    if (score < 0.7) return '⚠️';
    return '🚨';
  };

  const riskColor = getRiskColor(risk_score);
  const riskIcon = getRiskIcon(risk_score);

  return (
    <div className="prediction-result">
      <h2>🎯 Prediction Result</h2>

      <div className="risk-card" style={{ borderLeftColor: riskColor }}>
        <div className="risk-score-container">
          <div className="risk-icon">{riskIcon}</div>
          <div className="risk-info">
            <h3 className="risk-level" style={{ color: riskColor }}>
              {risk_level}
            </h3>
            <div className="confidence">Confidence: {(confidence * 100).toFixed(1)}%</div>
          </div>
        </div>

        <div className="risk-score-display">
          <div className="score-number" style={{ color: riskColor }}>
            {(risk_score * 100).toFixed(1)}%
          </div>
          <p style={{ color: riskColor }}>Risk Score</p>
        </div>
      </div>

      {/* Risk Score Gauge */}
      <div className="gauge-container">
        <div className="gauge-background">
          <div
            className="gauge-fill"
            style={{
              width: `${risk_score * 100}%`,
              backgroundColor: riskColor
            }}
          />
        </div>
        <div className="gauge-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="explanation-box">
        <h3>📝 Explanation:</h3>
        <p>{explanation}</p>
      </div>

      {/* Feature Importance */}
      {feature_importance && Object.keys(feature_importance).length > 0 && (
        <div className="feature-importance-box">
          <h3>📊 Top Contributing Factors:</h3>
          <div className="feature-list">
            {Object.entries(feature_importance).map(([feature, importance], index) => (
              <div key={feature} className="feature-item">
                <span className="ranking">#{index + 1}</span>
                <span className="feature-name">{feature}</span>
                <div className="importance-bar">
                  <div
                    className="importance-fill"
                    style={{
                      width: `${(importance / Math.max(...Object.values(feature_importance))) * 100}%`
                    }}
                  />
                </div>
                <span className="importance-value">{importance.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Assessment */}
      <div className="risk-assessment">
        <h3>📌 Risk Assessment:</h3>
        <div className="assessment-items">
          {risk_score < 0.3 && (
            <div className="assessment-item good">
              <span className="icon">✓</span>
              <span className="text">Code is well-maintained and has low defect risk</span>
            </div>
          )}
          {risk_score >= 0.3 && risk_score < 0.7 && (
            <div className="assessment-item warning">
              <span className="icon">!</span>
              <span className="text">Code has moderate complexity. Consider refactoring</span>
            </div>
          )}
          {risk_score >= 0.7 && (
            <div className="assessment-item danger">
              <span className="icon">✕</span>
              <span className="text">Code has high defect risk. Immediate refactoring recommended</span>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations">
        <h3>💡 Recommendations:</h3>
        <ul>
          {risk_score >= 0.7 && (
            <>
              <li>Reduce code complexity by breaking functions into smaller units</li>
              <li>Increase test coverage for critical sections</li>
              <li>Consider code refactoring to improve maintainability</li>
            </>
          )}
          {risk_score >= 0.3 && risk_score < 0.7 && (
            <>
              <li>Review and optimize high-complexity sections</li>
              <li>Add unit tests for edge cases</li>
              <li>Document complex logic</li>
            </>
          )}
          {risk_score < 0.3 && (
            <>
              <li>Maintain current code quality practices</li>
              <li>Consider documenting existing patterns for team members</li>
              <li>Continue with regular code reviews</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default PredictionResult;
