import React, { useState } from 'react';
import './CodeInput.css';

function CodeInput({ onAnalyze }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputMode, setInputMode] = useState('paste'); // 'paste' or 'upload'
  const [showHelp, setShowHelp] = useState(false);

  const handleAnalyze = async () => {
    if (inputMode === 'paste') {
      if (!code.trim()) {
        alert('Please enter some code to analyze');
        return;
      }
      setLoading(true);
      await onAnalyze(code);
      setLoading(false);
    } else {
      if (!selectedFile) {
        alert('Please select a file to analyze');
        return;
      }
      setLoading(true);
      
      // Read file content and pass to parent's onAnalyze
      try {
        const fileContent = await selectedFile.text();
        await onAnalyze(fileContent);
      } catch (err) {
        alert('Error reading file: ' + err.message);
      }
      
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds 10MB limit');
        e.target.value = '';
        setSelectedFile(null);
        return;
      }
      
      // Validate file type
      const validExtensions = ['.py', '.js', '.ts', '.java', '.cpp', '.c', '.cs', '.go', '.rb', '.php', '.txt'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
      
      if (!validExtensions.includes(fileExtension.toLowerCase())) {
        alert(`Invalid file type. Supported: ${validExtensions.join(', ')}`);
        e.target.value = '';
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleClear = () => {
    setCode('');
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSampleCode = () => {
    const sampleCode = `def fibonacci(n):
    """Calculate the nth Fibonacci number"""
    if n <= 1:
        return n
    a, b = 0, 1
    for i in range(2, n + 1):
        a, b = b, a + b
    return b

def main():
    result = fibonacci(10)
    print(f"Result: {result}")

if __name__ == "__main__":
    main()`;
    setCode(sampleCode);
    setInputMode('paste');
    setSelectedFile(null);
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
    <div className="code-input-container">
      <div className="section-header">
        <h2>Code Analysis</h2>
        <div className="header-actions">
          <p className="input-hint">Analyze Python code and predict bug risk</p>
          <button className="btn-help" onClick={() => setShowHelp(!showHelp)} title="Learn about code analysis">
            ℹ️ Help
          </button>
        </div>
      </div>
      
      {/* Input Mode Toggle */}
      <div className="input-mode-tabs">
        <button 
          className={`mode-button ${inputMode === 'paste' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('paste');
            setSelectedFile(null);
          }}
          title="Paste code directly"
          disabled={loading}
        >
          📝 Paste Code
        </button>
        <button 
          className={`mode-button ${inputMode === 'upload' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('upload');
            setCode('');
          }}
          title="Upload a code file"
          disabled={loading}
        >
          📤 Upload File
        </button>
      </div>

      {/* Paste Mode */}
      {inputMode === 'paste' && (
        <div className="input-group">
          <textarea 
            className="code-textarea" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            placeholder="Paste your source code here. The analyzer will extract metrics and identify potential issues..." 
            rows={15}
            disabled={loading}
          />
          <div className="char-count">{code.length} characters</div>
        </div>
      )}

      {/* Upload Mode */}
      {inputMode === 'upload' && (
        <div className="file-upload-group">
          <div className="file-input-wrapper">
            <input
              type="file"
              accept=".py,.js,.ts,.java,.cpp,.c,.cs,.go,.rb,.php,.txt"
              onChange={handleFileSelect}
              className="file-input"
              id="code-file-input"
              disabled={loading}
            />
            <label htmlFor="code-file-input" className="file-input-label">
              <span className="file-icon">📁</span>
              <span className="file-text">
                {selectedFile ? `Selected: ${selectedFile.name}` : 'Click to select a file or drag & drop'}
              </span>
            </label>
          </div>
          {selectedFile && (
            <div className="file-info">
              📄 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>
      )}
      
      <div className="button-group">
        <button 
          className="btn btn-primary" 
          onClick={handleAnalyze} 
          disabled={loading || (inputMode === 'paste' ? !code.trim() : !selectedFile)}
        >
          {loading ? '⏳ Analyzing...' : '✓ Analyze'}
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={handleSampleCode}
          title="Load example Python code for demonstration"
          disabled={loading}
        >
          📋 Example Code
        </button>
        <button 
          className="btn btn-ghost" 
          onClick={handleClear}
          title="Clear the code editor"
          disabled={loading}
        >
          Clear
        </button>
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
    </div>
  );
}

export default CodeInput;
