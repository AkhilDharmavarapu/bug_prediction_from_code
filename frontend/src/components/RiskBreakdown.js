import React from 'react';
import './RiskBreakdown.css';

function RiskBreakdown({ metrics, riskScore, prediction }) {
  // Analyze which metrics are problematic
  const analyzeMetrics = () => {
    const analysis = [];
    
    // LOC Analysis
    if (metrics.loc > 200) {
      analysis.push({
        metric: 'LOC',
        name: 'Lines of Code',
        value: Math.round(metrics.loc),
        status: 'critical',
        severity: 'High',
        message: 'Code exceeds recommended length',
        impact: 'More lines = more complexity and harder to test',
        suggestion: 'Consider breaking into smaller functions/modules',
        contribution: Math.min((metrics.loc / 500) * 30, 30) // Max 30% contribution
      });
    } else if (metrics.loc > 100) {
      analysis.push({
        metric: 'LOC',
        name: 'Lines of Code',
        value: Math.round(metrics.loc),
        status: 'warning',
        severity: 'Medium',
        message: 'Code length is moderate',
        impact: 'Within acceptable range but monitor for growth',
        suggestion: 'Keep functions under 50 lines when possible',
        contribution: (metrics.loc / 200) * 15
      });
    } else {
      analysis.push({
        metric: 'LOC',
        name: 'Lines of Code',
        value: Math.round(metrics.loc),
        status: 'safe',
        severity: 'Low',
        message: 'Code length is optimal',
        impact: 'Well within recommended limits',
        suggestion: 'Maintain current practices',
        contribution: 5
      });
    }

    // Cyclomatic Complexity Analysis
    if (metrics.v_g > 10) {
      analysis.push({
        metric: 'v(g)',
        name: 'Cyclomatic Complexity',
        value: metrics.v_g.toFixed(2),
        status: 'critical',
        severity: 'High',
        message: 'Excessive code paths detected',
        impact: 'Difficult to test all scenarios, high bug probability',
        suggestion: 'Reduce if/else statements, extract complex logic',
        contribution: Math.min((metrics.v_g / 20) * 35, 35)
      });
    } else if (metrics.v_g > 5) {
      analysis.push({
        metric: 'v(g)',
        name: 'Cyclomatic Complexity',
        value: metrics.v_g.toFixed(2),
        status: 'warning',
        severity: 'Medium',
        message: 'Moderate complexity present',
        impact: 'Testing coverage becomes important',
        suggestion: 'Consider refactoring complex conditionals',
        contribution: (metrics.v_g / 10) * 20
      });
    } else {
      analysis.push({
        metric: 'v(g)',
        name: 'Cyclomatic Complexity',
        value: metrics.v_g.toFixed(2),
        status: 'safe',
        severity: 'Low',
        message: 'Code paths are manageable',
        impact: 'Easy to test and understand',
        suggestion: 'Good structure, maintain current patterns',
        contribution: 3
      });
    }

    // Difficulty Analysis
    if (metrics.d > 20) {
      analysis.push({
        metric: 'd',
        name: 'Implementation Difficulty',
        value: metrics.d.toFixed(2),
        status: 'critical',
        severity: 'High',
        message: 'Very difficult implementation',
        impact: 'High likelihood of bugs during implementation',
        suggestion: 'Simplify algorithm, improve code clarity',
        contribution: Math.min((metrics.d / 40) * 25, 25)
      });
    } else if (metrics.d > 10) {
      analysis.push({
        metric: 'd',
        name: 'Implementation Difficulty',
        value: metrics.d.toFixed(2),
        status: 'warning',
        severity: 'Medium',
        message: 'Moderate difficulty level',
        impact: 'Requires careful review and testing',
        suggestion: 'Add comments, improve variable naming',
        contribution: (metrics.d / 20) * 15
      });
    } else {
      analysis.push({
        metric: 'd',
        name: 'Implementation Difficulty',
        value: metrics.d.toFixed(2),
        status: 'safe',
        severity: 'Low',
        message: 'Straightforward implementation',
        impact: 'Easy to understand and maintain',
        suggestion: 'Good code clarity',
        contribution: 3
      });
    }

    // Effort Analysis
    if (metrics.e > 5000) {
      analysis.push({
        metric: 'e',
        name: 'Mental Effort Required',
        value: Math.round(metrics.e),
        status: 'critical',
        severity: 'High',
        message: 'Excessive mental effort needed',
        impact: 'Developers make mistakes due to cognitive load',
        suggestion: 'Break down into smaller, simpler units',
        contribution: Math.min((metrics.e / 10000) * 20, 20)
      });
    } else if (metrics.e > 2000) {
      analysis.push({
        metric: 'e',
        name: 'Mental Effort Required',
        value: Math.round(metrics.e),
        status: 'warning',
        severity: 'Medium',
        message: 'Considerable effort to understand',
        impact: 'Review and testing are critical',
        suggestion: 'Document complex logic with examples',
        contribution: (metrics.e / 4000) * 12
      });
    } else {
      analysis.push({
        metric: 'e',
        name: 'Mental Effort Required',
        value: Math.round(metrics.e),
        status: 'safe',
        severity: 'Low',
        message: 'Effort is reasonable',
        impact: 'Code is maintainable and understandable',
        suggestion: 'Continue with current approach',
        contribution: 2
      });
    }

    // Volume Analysis
    if (metrics.v > 500) {
      analysis.push({
        metric: 'v',
        name: 'Halstead Volume',
        value: Math.round(metrics.v),
        status: 'critical',
        severity: 'Medium',
        message: 'High code volume detected',
        impact: 'Increased potential for bugs',
        suggestion: 'Refactor repetitive code, extract functions',
        contribution: Math.min((metrics.v / 1000) * 15, 15)
      });
    } else if (metrics.v > 250) {
      analysis.push({
        metric: 'v',
        name: 'Halstead Volume',
        value: Math.round(metrics.v),
        status: 'warning',
        severity: 'Low',
        message: 'Volume is above average',
        impact: 'Monitor for code duplication',
        suggestion: 'Review for optimization opportunities',
        contribution: (metrics.v / 500) * 8
      });
    } else {
      analysis.push({
        metric: 'v',
        name: 'Halstead Volume',
        value: Math.round(metrics.v),
        status: 'safe',
        severity: 'Low',
        message: 'Efficient code volume',
        impact: 'Good size for maintainability',
        suggestion: 'Maintain current code discipline',
        contribution: 2
      });
    }

    return analysis.sort((a, b) => b.contribution - a.contribution);
  };

  const metrics_analysis = analyzeMetrics();
  const criticalMetrics = metrics_analysis.filter(m => m.status === 'critical');
  const totalContribution = metrics_analysis.reduce((sum, m) => sum + m.contribution, 0);

  // Normalize contributions to percentages
  const normalizedMetrics = metrics_analysis.map(m => ({
    ...m,
    percentage: totalContribution > 0 ? ((m.contribution / totalContribution) * 100).toFixed(1) : 0
  }));

  return (
    <div className="risk-breakdown">
      <h2 className="breakdown-title">📊 Risk Factor Analysis</h2>
      
      {/* Critical Issues Alert */}
      {criticalMetrics.length > 0 && (
        <div className="critical-alert">
          <div className="alert-header">
            <span className="alert-icon">⚠️</span>
            <span className="alert-text">
              {criticalMetrics.length} critical issue{criticalMetrics.length !== 1 ? 's' : ''} identified
            </span>
          </div>
          <ul className="critical-list">
            {criticalMetrics.map((m, idx) => (
              <li key={idx}>
                <strong>{m.name}:</strong> {m.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk Contributors Breakdown */}
      <div className="breakdown-container">
        <div className="breakdown-chart">
          <h3 className="chart-title">Risk Contributors</h3>
          <p className="chart-subtitle">How each metric affects bug probability</p>
          
          <div className="risk-bars">
            {normalizedMetrics.map((metric, idx) => (
              <div key={idx} className="risk-bar-item">
                <div className="bar-header">
                  <span className="bar-label">{metric.metric}</span>
                  <span className={`bar-badge badge-${metric.status}`}>
                    {metric.percentage}%
                  </span>
                </div>
                <div className="bar-container">
                  <div 
                    className={`bar-fill bar-${metric.status}`}
                    style={{ width: `${metric.percentage}%` }}
                    title={`${metric.percentage}% contribution to risk`}
                  />
                </div>
                <div className="bar-footer">
                  <span className="metric-value">Value: {metric.value}</span>
                  <span className={`severity-badge severity-${metric.status}`}>
                    {metric.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="details-section">
          <h3 className="details-title">Detailed Analysis</h3>
          
          <div className="metric-details">
            {normalizedMetrics.map((metric, idx) => (
              <div key={idx} className={`detail-card detail-${metric.status}`}>
                <div className="detail-header">
                  <span className="detail-metric">{metric.metric}</span>
                  <span className="detail-name">{metric.name}</span>
                  <span className={`detail-status status-${metric.status}`}>
                    {metric.status.toUpperCase()}
                  </span>
                </div>

                <div className="detail-body">
                  <div className="detail-row">
                    <span className="detail-label">Current Value:</span>
                    <span className="detail-value">{metric.value}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Assessment:</span>
                    <span className="detail-text">{metric.message}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Impact:</span>
                    <span className="detail-text">{metric.impact}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Risk Contribution:</span>
                    <span className="detail-contribution">{metric.percentage}% of total risk</span>
                  </div>
                </div>

                <div className="detail-action">
                  <span className="action-icon">💡</span>
                  <span className="action-text">{metric.suggestion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Plan */}
      <div className="action-plan">
        <h3 className="plan-title">🎯 Recommended Action Plan</h3>
        
        <ol className="action-list">
          {normalizedMetrics.filter(m => m.status === 'critical').map((m, idx) => (
            <li key={idx} className="action-item critical-action">
              <span className="action-priority">Priority 1:</span> Fix <strong>{m.name}</strong> - {m.suggestion}
            </li>
          ))}
          
          {normalizedMetrics.filter(m => m.status === 'warning').map((m, idx) => (
            <li key={idx} className="action-item warning-action">
              <span className="action-priority">Priority 2:</span> Address <strong>{m.name}</strong> - {m.suggestion}
            </li>
          ))}

          {normalizedMetrics.filter(m => m.status === 'safe').slice(0, 2).map((m, idx) => (
            <li key={idx} className="action-item safe-action">
              <span className="action-priority">Maintain:</span> Keep <strong>{m.name}</strong> quality
            </li>
          ))}
        </ol>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-box">
          <span className="stat-label">Total Risk Score</span>
          <span className="stat-value">{(riskScore * 100).toFixed(1)}%</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Critical Issues</span>
          <span className="stat-value">{criticalMetrics.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Issues to Address</span>
          <span className="stat-value">{metrics_analysis.filter(m => m.status !== 'safe').length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Risk Level</span>
          <span className={`stat-value risk-${prediction.toLowerCase().split(' ')[0]}`}>
            {prediction}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RiskBreakdown;
