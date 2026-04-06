import React from 'react';
import './PredictionResult.css';
import RiskBreakdown from './RiskBreakdown';

function PredictionResult({ prediction, metrics }) {
  const { risk_score, prediction: risk_level, explanation, confidence, feature_importance } = prediction;

  const getRiskColor = (score) => {
    if (score < 0.3) return { bg: '#ecfdf5', border: '#059669', text: '#047857', level: 'Low' };
    if (score < 0.7) return { bg: '#fffbeb', border: '#d97706', text: '#b45309', level: 'Medium' };
    return { bg: '#fef2f2', border: '#dc2626', text: '#b91c1c', level: 'High' };
  };

  const riskInfo = getRiskColor(risk_score);

  const getRiskDescription = (score) => {
    if (score < 0.3) return 'Code is within safe thresholds. Continue current modular design and testing practices.';
    if (score < 0.7) return 'Your code shows moderate complexity. Review and optimize high-risk sections.';
    return 'Your code exhibits high complexity. Consider refactoring and comprehensive testing.';
  };

  const getRecommendations = () => {
    if (risk_score >= 0.7) {
      return [
        '[Priority 1] Reduce cyclomatic complexity by breaking down complex functions',
        '[Priority 1] Increase unit test coverage for critical code paths',
        '[Priority 2] Consider code refactoring to improve module coupling',
        '[Priority 2] Review error handling and edge cases'
      ];
    } else if (risk_score >= 0.3) {
      return [
        '[Priority 2] Review functions with high complexity',
        '[Priority 2] Improve test coverage for edge cases',
        '[Priority 3] Consider code style improvements'
      ];
    } else {
      return [
        '[Priority 3] Maintain current code quality standards',
        '[Priority 3] Continue regular code reviews and testing practices',
        '[Priority 3] Document complex algorithms for team knowledge sharing'
      ];
    }
  };

  const generateReport = () => {
    // Collect all report data
    const timestamp = new Date().toLocaleString();
    const recommendations = getRecommendations();
    
    // Get top risk drivers from feature importance
    const topDrivers = feature_importance 
      ? Object.entries(feature_importance)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
      : [];

    // Format metric names with explanations
    const metricDescriptions = {
      'loc': 'Lines of Code',
      'v(g)': 'Cyclomatic Complexity',
      'ev(g)': 'Essential Cyclomatic Complexity',
      'iv(g)': 'Design Complexity',
      'n': 'Unique Operators',
      'v': 'Volume (Halstead Volume)',
      'd': 'Difficulty',
      'e': 'Effort'
    };

    const metricExplanations = {
      'loc': 'Higher lines of code increase complexity and bug risk',
      'v(g)': 'High cyclomatic complexity indicates difficult control flow',
      'ev(g)': 'Essential complexity that cannot be reduced further',
      'iv(g)': 'Design complexity affecting code maintainability',
      'n': 'Number of unique operators in code',
      'v': 'Halstead metric measuring program volume and complexity',
      'd': 'Higher difficulty indicates harder maintenance',
      'e': 'Total effort required to write and understand code'
    };

    // Build report text
    let reportText = `SOFTWARE BUG ANALYSIS REPORT
Generated: ${timestamp}
================================================================================

EXECUTIVE SUMMARY
================================================================================
Risk Level: ${riskInfo.level.toUpperCase()}
Bug Risk Score: ${(risk_score * 100).toFixed(1)}%
Prediction Confidence: ${(confidence * 100).toFixed(0)}%

Assessment: ${getRiskDescription(risk_score)}

================================================================================
METRICS ANALYSIS
================================================================================\n`;

    // Add metrics if available
    if (metrics) {
      reportText += `Lines of Code (LOC)............: ${metrics.loc || 'N/A'}
Cyclomatic Complexity v(g)...: ${metrics.v_g || 'N/A'}
Essential Complexity ev(g)...: ${metrics.ev_g || 'N/A'}
Design Complexity iv(g)......: ${metrics.iv_g || 'N/A'}
Unique Operators (n).........: ${metrics.n || 'N/A'}
Volume (Halstead Volume) v...: ${metrics.v || 'N/A'}
Difficulty d..................: ${metrics.d || 'N/A'}
Effort e......................: ${metrics.e || 'N/A'}
Maintainability Index.........: ${metrics.maintainability_index || 'N/A'}\n`;
    } else {
      reportText += 'No metric data available.\n';
    }

    // Add detailed insights
    reportText += `\n================================================================================
DETAILED CODE ANALYSIS
================================================================================
${explanation}\n`;

    // Add top risk drivers
    if (topDrivers.length > 0) {
      reportText += `\n================================================================================
TOP RISK DRIVERS
================================================================================\n`;
      topDrivers.forEach((driver, index) => {
        const metricKey = driver[0].includes('(') ? driver[0] : driver[0];
        const percentage = driver[1];
        const metricName = metricDescriptions[driver[0]] || driver[0];
        const explanation = metricExplanations[driver[0]] || 'Key factor affecting bug probability';
        reportText += `${index + 1}. ${metricName} (${percentage.toFixed(1)}%)
   ${explanation}\n\n`;
      });
    }

    // Add recommendations
    reportText += `\n================================================================================
RECOMMENDED ACTIONS
================================================================================\n`;
    recommendations.forEach((rec) => {
      reportText += `• ${rec}\n`;
    });

    // Add technical guidance and dynamic next steps
    reportText += `\n================================================================================
TECHNICAL GUIDANCE
================================================================================\n`;
    
    if (risk_score < 0.3) {
      reportText += `Code Quality Status: EXCELLENT
Your code demonstrates strong quality metrics with low bug probability.

Continuation Recommendations:
- Maintain current modular design and testing practices
- Continue regular code reviews with the team
- Document complex algorithms for future team reference
- Monitor code complexity as new features are added

================================================================================
NEXT STEPS
================================================================================
1. Upload new code changes for continuous monitoring
2. Maintain current code quality practices
3. Continue implementing regular unit and integration tests
4. Share code quality metrics with team for visibility
5. Re-run analysis after significant code changes
`;
    } else if (risk_score < 0.7) {
      reportText += `Code Quality Status: MODERATE
Your code shows moderate complexity with actionable improvements possible.

Improvement Areas:
- Review functions with elevated complexity levels
- Improve test coverage for edge cases and error paths
- Consider refactoring large code blocks
- Implement design patterns to reduce coupling

================================================================================
NEXT STEPS
================================================================================
1. Address Priority 2 recommendations in planned refactoring sprints
2. Increase unit test coverage for critical functions
3. Schedule code review to identify refactoring opportunities
4. Implement automated testing for regression prevention
5. Monitor progress as improvements are made
6. Re-run analysis after optimizations are complete
`;
    } else {
      reportText += `Code Quality Status: HIGH RISK
Your code exhibits elevated complexity requiring focused improvement.

Urgent Actions Required:
- URGENT: Reduce cyclomatic complexity through function decomposition
- URGENT: Increase unit test coverage to >80%
- Implement comprehensive error handling and validation
- Consider using static analysis tools for continuous monitoring
- Schedule code review with senior developers

================================================================================
NEXT STEPS
================================================================================
1. Address ALL Priority 1 recommendations immediately
2. Create tickets for identified refactoring work
3. Schedule urgent code review meeting with team leads
4. Plan focused refactoring sprints for high-complexity functions
5. Implement automated testing suite to prevent regressions
6. Re-run analysis weekly during improvement phase
7. Consider pair programming for complex code changes
`;
    }

    reportText += `\n================================================================================
END OF REPORT
================================================================================
Generated by Code Quality Analyzer • Version 1.0
This report is confidential and intended for development team use only.`;

    return reportText;
  };

  const handleDownloadReport = () => {
    try {
      const reportText = generateReport();
      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `bug-analysis-report-${new Date().getTime()}.txt`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      alert('Report downloaded successfully!');
    } catch (error) {
      alert('Error downloading report: ' + error.message);
    }
  };

  return (
    <div className="prediction-result">
      <h2 className="result-title">Quality Assessment</h2>
      
      <div className="result-header-controls">
        <button 
          className="btn-download-report"
          onClick={handleDownloadReport}
          title="Download analysis report as text file"
        >
          📥 Download Report
        </button>
      </div>
      
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
          featureImportance={prediction.feature_importance}
        />
      )}
    </div>
  );
}

export default PredictionResult;
