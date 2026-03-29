import React, { useState } from 'react';
import './MetricsInput.css';

function MetricsInput({ onPredict }) {
  const [metrics, setMetrics] = useState({
    loc: 25,
    v_g: 5,
    ev_g: 3,
    iv_g: 5,
    n: 50,
    v: 200,
    d: 10,
    e: 2000
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setMetrics({
      ...metrics,
      [field]: parseFloat(value) || 0
    });
  };

  const handlePredict = async () => {
    setLoading(true);
    await onPredict(metrics);
    setLoading(false);
  };

  const handleReset = () => {
    setMetrics({
      loc: 25,
      v_g: 5,
      ev_g: 3,
      iv_g: 5,
      n: 50,
      v: 200,
      d: 10,
      e: 2000
    });
  };

  return (
    <div className="metrics-input-container">
      <h2>📊 Enter Software Metrics</h2>
      <p className="description">
        Manually input software metrics to get a bug risk prediction
      </p>

      <div className="metrics-grid">
        <div className="metric-field">
          <label htmlFor="loc">
            <strong>LOC</strong>
            <span className="metric-hint">Lines of Code</span>
          </label>
          <input
            id="loc"
            type="number"
            value={metrics.loc}
            onChange={(e) => handleInputChange('loc', e.target.value)}
            min="0"
            step="1"
          />
        </div>

        <div className="metric-field">
          <label htmlFor="v_g">
            <strong>v(g)</strong>
            <span className="metric-hint">Cyclomatic Complexity</span>
          </label>
          <input
            id="v_g"
            type="number"
            value={metrics.v_g}
            onChange={(e) => handleInputChange('v_g', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>

        <div className="metric-field">
          <label htmlFor="ev_g">
            <strong>ev(g)</strong>
            <span className="metric-hint">Essential Complexity</span>
          </label>
          <input
            id="ev_g"
            type="number"
            value={metrics.ev_g}
            onChange={(e) => handleInputChange('ev_g', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>

        <div className="metric-field">
          <label htmlFor="iv_g">
            <strong>iv(g)</strong>
            <span className="metric-hint">IV(g) Metric</span>
          </label>
          <input
            id="iv_g"
            type="number"
            value={metrics.iv_g}
            onChange={(e) => handleInputChange('iv_g', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>

        <div className="metric-field">
          <label htmlFor="n">
            <strong>n</strong>
            <span className="metric-hint">Operators Count</span>
          </label>
          <input
            id="n"
            type="number"
            value={metrics.n}
            onChange={(e) => handleInputChange('n', e.target.value)}
            min="0"
            step="1"
          />
        </div>

        <div className="metric-field">
          <label htmlFor="v">
            <strong>v</strong>
            <span className="metric-hint">Halstead Volume</span>
          </label>
          <input
            id="v"
            type="number"
            value={metrics.v}
            onChange={(e) => handleInputChange('v', e.target.value)}
            min="0"
            step="1"
          />
        </div>

        <div className="metric-field">
          <label htmlFor="d">
            <strong>d</strong>
            <span className="metric-hint">Difficulty</span>
          </label>
          <input
            id="d"
            type="number"
            value={metrics.d}
            onChange={(e) => handleInputChange('d', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>

        <div className="metric-field">
          <label htmlFor="e">
            <strong>e</strong>
            <span className="metric-hint">Effort</span>
          </label>
          <input
            id="e"
            type="number"
            value={metrics.e}
            onChange={(e) => handleInputChange('e', e.target.value)}
            min="0"
            step="1"
          />
        </div>
      </div>

      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={handlePredict}
          disabled={loading}
        >
          {loading ? 'Processing...' : '🚀 Predict Bug Risk'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleReset}
        >
          🔄 Reset to Defaults
        </button>
      </div>

      <div className="info-box">
        <h3>💡 Tips:</h3>
        <ul>
          <li>Higher LOC generally increases bug risk</li>
          <li>Complexity metrics (v, d, e) significantly impact predictions</li>
          <li>Use metrics extracted from your actual code for better accuracy</li>
        </ul>
      </div>
    </div>
  );
}

export default MetricsInput;
