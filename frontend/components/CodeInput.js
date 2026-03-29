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
    """Calculate Fibonacci number"""
    if n <= 1:
        return n
    else:
        a, b = 0, 1
        for i in range(2, n + 1):
            a, b = b, a + b
        return b

def calculate_sum(numbers):
    total = 0
    for num in numbers:
        if num > 0:
            total += num
    return total

def main():
    result = fibonacci(10)
    numbers = [1, 2, 3, 4, 5]
    total = calculate_sum(numbers)
    print(f"Result: {result}, Sum: {total}")

if __name__ == "__main__":
    main()`;
    setCode(sampleCode);
  };

  return (
    <div className="code-input-container">
      <h2>🔍 Paste Your Python Code</h2>
      <p className="description">
        Enter your Python code below to extract metrics and predict bug risk
      </p>

      <div className="input-group">
        <textarea
          className="code-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your Python code here..."
          rows={15}
        />
      </div>

      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : '🚀 Analyze Code'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleSampleCode}
        >
          📋 Load Sample Code
        </button>
        <button
          className="btn btn-clear"
          onClick={handleClear}
        >
          🗑️ Clear
        </button>
      </div>

      <div className="info-box">
        <h3>💡 Supported Metrics:</h3>
        <ul>
          <li><strong>LOC:</strong> Lines of Code</li>
          <li><strong>v(g):</strong> Cyclomatic Complexity</li>
          <li><strong>ev(g):</strong> Essential Complexity</li>
          <li><strong>Halstead Metrics:</strong> Volume, Difficulty, Effort</li>
          <li><strong>Maintainability Index:</strong> Code quality indicator</li>
        </ul>
      </div>
    </div>
  );
}

export default CodeInput;
