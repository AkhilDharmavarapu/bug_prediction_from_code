import React, { useState } from 'react';
import './CodeInput.css';

function CodeInput({ onAnalyze }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      alert('Please enter some code to analyze');
      return;
    }
    setLoading(true);
    await onAnalyze(code);
    setLoading(false);
  };

  const handleClear = () => {
    setCode('');
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
  };

  return (
    <div className="code-input-container">
      <div className="section-header">
        <h2>Paste Your Code</h2>
        <p className="input-hint">Supports Python, JavaScript, Java, C++, C#, Go, Ruby, and PHP</p>
      </div>
      
      <div className="input-group">
        <textarea 
          className="code-textarea" 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          placeholder="Paste your source code here. The analyzer will extract metrics and identify potential issues..." 
          rows={15}
        />
        <div className="char-count">{code.length} characters</div>
      </div>
      
      <div className="button-group">
        <button 
          className="btn btn-primary" 
          onClick={handleAnalyze} 
          disabled={loading || !code.trim()}
        >
          {loading ? '⏳ Analyzing...' : '✓ Analyze Code'}
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={handleSampleCode}
          title="Load example Python code for demonstration"
        >
          📋 Example Code
        </button>
        <button 
          className="btn btn-ghost" 
          onClick={handleClear}
          title="Clear the code editor"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default CodeInput;
