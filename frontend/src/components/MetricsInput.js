import React, { useState } from 'react';
import './MetricsInput.css';
import { API_BASE_URL } from '../config';

function MetricsInput({ onPredict }) {
  const [metrics, setMetrics] = useState({
    loc: 25, v_g: 5, ev_g: 3, iv_g: 5, n: 50, v: 200, d: 10, e: 2000
  });
  
  const [showHelp, setShowHelp] = useState(false);
  const [extractCode, setExtractCode] = useState('');
  const [extracting, setExtracting] = useState(false);

  const handleInputChange = (field, value) => {
    setMetrics({...metrics, [field]: parseFloat(value) || 0});
  };

  const handlePredict = () => {
    onPredict(metrics);
  };

  // Auto-extract metrics from code
  const handleExtractMetrics = async () => {
    if (!extractCode.trim()) {
      alert('Paste some code to extract metrics');
      return;
    }
    
    setExtracting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/analyze-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: extractCode })
      });
      
      const data = await response.json();
      if (data.success && data.metrics) {
        setMetrics({
          loc: data.metrics.loc,
          v_g: data.metrics.v_g,
          ev_g: data.metrics.ev_g,
          iv_g: data.metrics.iv_g,
          n: data.metrics.n,
          v: data.metrics.v,
          d: data.metrics.d,
          e: data.metrics.e
        });
        setExtractCode('');
        alert('✓ Metrics extracted successfully!');
      } else {
        alert('Failed to extract metrics: ' + data.message);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setExtracting(false);
    }
  };

  // Apply preset scenarios
  const applyPreset = (preset) => {
    const presets = {
      low: {
        loc: 30,
        v_g: 2,
        ev_g: 1.5,
        iv_g: 2,
        n: 20,
        v: 80,
        d: 4,
        e: 320
      },
      medium: {
        loc: 150,
        v_g: 8,
        ev_g: 5,
        iv_g: 8,
        n: 120,
        v: 450,
        d: 12,
        e: 5400
      },
      high: {
        loc: 350,
        v_g: 15,
        ev_g: 10,
        iv_g: 15,
        n: 280,
        v: 950,
        d: 25,
        e: 23750
      }
    };
    
    setMetrics(presets[preset]);
  };

  const metricDefinitions = [
    {
      key: 'loc',
      label: 'LOC',
      title: 'Lines of Code',
      description: 'Total number of lines in the source code',
      example: 'e.g., 100',
      explanation: 'More lines generally mean more complexity and potential bugs'
    },
    {
      key: 'v_g',
      label: 'v(g)',
      title: 'Cyclomatic Complexity',
      description: 'Number of linearly independent code paths',
      example: 'e.g., 5',
      explanation: 'Higher values indicate more complex control flow (if/else, loops)'
    },
    {
      key: 'ev_g',
      label: 'ev(g)',
      title: 'Essential Complexity',
      description: 'Minimal complexity required by the language',
      example: 'e.g., 3',
      explanation: 'Measures core structural complexity'
    },
    {
      key: 'iv_g',
      label: 'iv(g)',
      title: 'Integration Complexity',
      description: 'Complexity introduced by structure and nesting',
      example: 'e.g., 5',
      explanation: 'Shows how code organization affects complexity'
    },
    {
      key: 'n',
      label: 'n',
      title: 'Operators Count',
      description: 'Total number of operators in the code',
      example: 'e.g., 50',
      explanation: 'Includes arithmetic, logical, and other operators'
    },
    {
      key: 'v',
      label: 'Volume',
      title: 'Halstead Volume',
      description: 'Overall code size and complexity metric',
      example: 'e.g., 200',
      explanation: 'Combines operators and operands for a comprehensive measure'
    },
    {
      key: 'd',
      label: 'Difficulty',
      title: 'Implementation Difficulty',
      description: 'How hard is it to write this code correctly',
      example: 'e.g., 10',
      explanation: 'Higher values mean more likely to introduce bugs'
    },
    {
      key: 'e',
      label: 'Effort',
      title: 'Mental Effort Required',
      description: 'Effort required to understand and maintain the code',
      example: 'e.g., 2000',
      explanation: 'High effort = higher defect probability'
    }
  ];

  return (
    <div className="metrics-input-container">
      <div className="section-header">
        <h2>Metrics Analysis</h2>
        <div className="header-actions">
          <p className="input-hint">For any programming language</p>
          <button className="btn-help" onClick={() => setShowHelp(!showHelp)} title="Learn about metrics">
            ℹ️ Help
          </button>
        </div>
      </div>

      {/* Code Extraction Section */}
      <div className="extraction-section">
        <h3 className="subsection-title">Quick Extract</h3>
        <p className="subsection-desc">Don't know the metrics? Paste code to auto-extract them</p>
        
        <textarea 
          className="extract-textarea"
          placeholder="Paste your code here (any language)..."
          value={extractCode}
          onChange={(e) => setExtractCode(e.target.value)}
          rows={8}
        />
        
        <button 
          className="btn btn-extract" 
          onClick={handleExtractMetrics}
          disabled={extracting || !extractCode.trim()}
        >
          {extracting ? '⏳ Extracting...' : '↓ Auto-Extract Metrics'}
        </button>
      </div>

      {/* Preset Scenarios */}
      <div className="preset-section">
        <h3 className="subsection-title">Or Use Presets</h3>
        <p className="subsection-desc">Quick-load example scenarios to see how predictions change</p>
        
        <div className="preset-buttons">
          <button 
            className="preset-btn preset-low"
            onClick={() => applyPreset('low')}
            title="Simple, well-written code"
          >
            <span className="preset-icon">🟢</span>
            <span>Low Risk</span>
            <span className="preset-hint">Clean code</span>
          </button>
          
          <button 
            className="preset-btn preset-medium"
            onClick={() => applyPreset('medium')}
            title="Moderate complexity"
          >
            <span className="preset-icon">🟡</span>
            <span>Medium Risk</span>
            <span className="preset-hint">Average complexity</span>
          </button>
          
          <button 
            className="preset-btn preset-high"
            onClick={() => applyPreset('high')}
            title="Complex, hard to maintain"
          >
            <span className="preset-icon">🔴</span>
            <span>High Risk</span>
            <span className="preset-hint">Complex code</span>
          </button>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="help-modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowHelp(false)}>✕</button>
            <h3>Understanding Code Metrics</h3>
            
            <div className="help-content">
              <div className="help-section">
                <h4>What are these metrics?</h4>
                <p>Software metrics are quantitative measurements of code properties that help predict bug probability. Each metric captures a different aspect of code quality.</p>
              </div>

              <div className="help-section">
                <h4>How to get these values?</h4>
                <ul className="help-list">
                  <li><strong>Option 1 (Recommended):</strong> Use "Quick Extract" - paste your code and let the analyzer extract metrics automatically</li>
                  <li><strong>Option 2:</strong> Use presets - click a preset to see how different complexity levels affect predictions</li>
                  <li><strong>Option 3:</strong> Manual entry - enter values based on your code analysis tools</li>
                </ul>
              </div>

              <div className="help-section">
                <h4>Individual Metrics Explained</h4>
                <div className="metrics-reference">
                  {metricDefinitions.map(({ label, title, explanation, example }) => (
                    <div key={label} className="metric-reference-item">
                      <span className="metric-ref-label">{label}</span>
                      <div>
                        <strong>{title}</strong>
                        <p>{explanation}</p>
                        <small>{example}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="help-section">
                <h4>Typical Ranges</h4>
                <table className="ranges-table">
                  <tbody>
                    <tr>
                      <td><strong>LOC:</strong></td>
                      <td>Low Risk: 10-50 | Medium: 50-200 | High: 200+</td>
                    </tr>
                    <tr>
                      <td><strong>Complexity:</strong></td>
                      <td>Low: 1-3 | Medium: 4-10 | High: 10+</td>
                    </tr>
                    <tr>
                      <td><strong>Effort:</strong></td>
                      <td>Low: &lt;500 | Medium: 500-5000 | High: 5000+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Input Section */}
      <div className="input-section">
        <h3 className="subsection-title">Manual Entry</h3>
        <p className="subsection-desc">Or adjust values manually to test different scenarios</p>
        
        <div className="metrics-grid">
          {metricDefinitions.map(({ key, label, title, description, example }) => (
            <div key={key} className="metric-field">
              <label htmlFor={key}>
                <span className="label-text">{label}</span>
                <span className="label-title">{title}</span>
              </label>
              <input 
                id={key}
                type="number" 
                value={metrics[key]} 
                onChange={(e) => handleInputChange(key, e.target.value)} 
                min="0"
                placeholder={example}
                title={description}
              />
              <span className="field-hint">{description}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Section */}
      <div className="action-section">
        <button className="btn btn-primary" onClick={handlePredict}>
          ✓ Calculate Risk Assessment
        </button>
      </div>
    </div>
  );
}

export default MetricsInput;
