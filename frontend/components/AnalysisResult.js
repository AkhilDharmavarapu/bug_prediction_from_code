import React from 'react';
import './AnalysisResult.css';

function AnalysisResult({ result, onPredict }) {
  const { metrics, raw_metrics, message } = result;

  if (!metrics) {
    return (
      <div className="analysis-result error">
        <h3>⚠️ Analysis Error</h3>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="analysis-result">
      <h2>✅ Code Analysis Results</h2>
      <p className="message">{message}</p>

      {/* Extracted Metrics */}
      <div className="metrics-display">
        <h3>📊 Extracted Metrics</h3>
        <div className="metrics-cards">
          <div className="metric-card">
            <div className="metric-label">LOC</div>
            <div className="metric-value">{metrics.loc.toFixed(0)}</div>
            <div className="metric-desc">Lines of Code</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">v(g)</div>
            <div className="metric-value">{metrics.v_g.toFixed(2)}</div>
            <div className="metric-desc">Cyclomatic</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">ev(g)</div>
            <div className="metric-value">{metrics.ev_g.toFixed(2)}</div>
            <div className="metric-desc">Essential</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">v</div>
            <div className="metric-value">{metrics.v.toFixed(0)}</div>
            <div className="metric-desc">Volume</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">d</div>
            <div className="metric-value">{metrics.d.toFixed(2)}</div>
            <div className="metric-desc">Difficulty</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">e</div>
            <div className="metric-value">{metrics.e.toFixed(0)}</div>
            <div className="metric-desc">Effort</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">MI</div>
            <div className="metric-value">{metrics.maintainability_index.toFixed(1)}</div>
            <div className="metric-desc">Maintainability</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">n</div>
            <div className="metric-value">{metrics.n.toFixed(0)}</div>
            <div className="metric-desc">Operators</div>
          </div>
        </div>
      </div>

      {/* Raw Metrics */}
      {raw_metrics && Object.keys(raw_metrics).length > 0 && (
        <div className="raw-metrics">
          <h3>📈 Raw Code Metrics</h3>
          <div className="metrics-table">
            <div className="table-row header">
              <div className="table-cell">Metric</div>
              <div className="table-cell value">Value</div>
            </div>
            {Object.entries(raw_metrics).map(([key, value]) => (
              <div key={key} className="table-row">
                <div className="table-cell">{key.replace(/_/g, ' ').toUpperCase()}</div>
                <div className="table-cell value">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Interpretation */}
      <div className="metrics-interpretation">
        <h3>🔍 Metrics Interpretation</h3>
        <div className="interpretation-items">
          <div className="interpretation-item">
            <strong>LOC (Lines of Code):</strong>
            <p>
              {metrics.loc < 50
                ? "✅ Small file size - easier to maintain and test"
                : metrics.loc < 100
                ? "⚠️ Moderate file size - consider breaking into smaller functions"
                : "🚨 Large file size - likely needs refactoring"}
            </p>
          </div>
          <div className="interpretation-item">
            <strong>Cyclomatic Complexity (v(g)):</strong>
            <p>
              {metrics.v_g < 5
                ? "✅ Simple control flow"
                : metrics.v_g < 10
                ? "⚠️ Moderate complexity - watch for edge cases"
                : "🚨 High complexity - needs refactoring"}
            </p>
          </div>
          <div className="interpretation-item">
            <strong>Halstead Volume (v):</strong>
            <p>
              {metrics.v < 500
                ? "✅ Good - implementation is straightforward"
                : "🚨 High volume indicates complexity"}
            </p>
          </div>
          <div className="interpretation-item">
            <strong>Difficulty (d):</strong>
            <p>
              {metrics.d < 10
                ? "✅ Low difficulty - easy to understand"
                : metrics.d < 20
                ? "⚠️ Moderate difficulty"
                : "🚨 High difficulty - code is hard to understand"}
            </p>
          </div>
          <div className="interpretation-item">
            <strong>Maintainability Index (MI):</strong>
            <p>
              {metrics.maintainability_index > 85
                ? "✅ High maintainability"
                : metrics.maintainability_index > 70
                ? "⚠️ Medium maintainability"
                : "🚨 Low maintainability"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="action-section">
        <button className="btn-predict" onClick={onPredict}>
          🎯 Get Bug Risk Prediction
        </button>
      </div>
    </div>
  );
}

export default AnalysisResult;
