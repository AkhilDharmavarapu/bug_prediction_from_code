import React from 'react';
import './RiskBreakdown.css';

function RiskBreakdown({ metrics, riskScore, prediction, featureImportance }) {
  // ========================================================================
  // FEATURE IMPORTANCE MAPPING - Each feature gets one clear recommendation
  // ========================================================================
  
  const featureRecommendations = {
    'loc': {
      name: 'Lines of Code',
      recommendation: 'Break large files into smaller functions/modules to reduce complexity',
      emoji: '📄'
    },
    'v(g)': {
      name: 'Cyclomatic Complexity',
      recommendation: 'Reduce cyclomatic complexity by simplifying conditional logic and extracting methods',
      emoji: '🔄'
    },
    'v': {
      name: 'Code Volume',
      recommendation: 'Refactor repetitive code and reduce overall code size through better abstractions',
      emoji: '📊'
    },
    'd': {
      name: 'Implementation Difficulty',
      recommendation: 'Simplify implementation logic to improve code clarity and maintainability',
      emoji: '🔧'
    },
    'e': {
      name: 'Mental Effort',
      recommendation: 'Reduce cognitive load by simplifying complex code structures and adding documentation',
      emoji: '🧠'
    },
    'ev(g)': {
      name: 'Essential Complexity',
      recommendation: 'Review and optimize code structure to reduce essential complexity',
      emoji: '⚙️'
    },
    'iv(g)': {
      name: 'IV(g) Metric',
      recommendation: 'Improve code structure and design patterns to optimize this metric',
      emoji: '🏗️'
    },
    'n': {
      name: 'Number of Operators',
      recommendation: 'Optimize operator usage and consider refactoring complex expressions',
      emoji: '➕'
    }
  };

  // ========================================================================
  // METRIC DESCRIPTIONS - Why each metric contributes to bug risk
  // ========================================================================
  
  const metricDescriptions = {
    'loc': 'Larger codebases are harder to test and more prone to bugs.',
    'v': 'High code volume increases complexity and likelihood of defects.',
    'e': 'High mental effort increases cognitive load and risk of mistakes.',
    'd': 'Higher implementation difficulty increases chance of defects.',
    'n': 'More operators increase code complexity and error probability.',
    'v(g)': 'Higher cyclomatic complexity means more execution paths to test.',
    'ev(g)': 'Higher essential complexity indicates poor structural design.',
    'iv(g)': 'Higher integration complexity makes systems harder to maintain.'
  };

  // ========================================================================
  // GENERATE ACTION PLAN FROM FEATURE IMPORTANCE
  // ========================================================================
  
  const generateActionPlan = () => {
    if (!featureImportance || Object.keys(featureImportance).length === 0) {
      return [];
    }

    // Convert feature importance to array and sort by importance (descending)
    const sortedFeatures = Object.entries(featureImportance)
      .map(([feature, importance]) => ({
        feature,
        importance,
        ...featureRecommendations[feature] || {
          name: feature,
          recommendation: 'Review and optimize code structure for this metric',
          emoji: '📋'
        }
      }))
      .sort((a, b) => b.importance - a.importance);

    // Assign priorities: top 2 = P1, next 2 = P2, rest = P3
    return sortedFeatures.map((item, index) => {
      let priority, priorityLabel, priorityClass;
      
      if (index < 2) {
        priority = 1;
        priorityLabel = 'Priority 1';
        priorityClass = 'critical-action';
      } else if (index < 4) {
        priority = 2;
        priorityLabel = 'Priority 2';
        priorityClass = 'warning-action';
      } else {
        priority = 3;
        priorityLabel = 'Priority 3';
        priorityClass = 'safe-action';
      }
      
      return {
        ...item,
        priority,
        priorityLabel,
        priorityClass
      };
    });
  };

  const actionPlan = generateActionPlan();

  // ========================================================================
  // GENERATE TOP RISK DRIVERS FROM FEATURE IMPORTANCE
  // ========================================================================
  
  const getTopRiskDrivers = () => {
    if (!featureImportance || Object.keys(featureImportance).length === 0) {
      return [];
    }

    return Object.entries(featureImportance)
      .map(([feature, importance]) => ({
        feature,
        importance,
        name: featureRecommendations[feature]?.name || feature,
        description: metricDescriptions[feature] || 'This metric influences bug probability.'
      }))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 3);
  };

  const topRiskDrivers = getTopRiskDrivers();

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
  let normalizedMetrics;
  
  if (featureImportance && Object.keys(featureImportance).length > 0) {
    // Use feature importance from backend (already in percentage format)
    const featureImportanceArray = Object.entries(featureImportance)
      .map(([feature, importance]) => {
        // Find metricAnalysis - handle case-insensitive matching
        let metricAnalysis = metrics_analysis.find(m => 
          m.metric.toLowerCase() === feature.toLowerCase() || 
          m.name.toLowerCase().includes(feature.replace(/[()]/g, '').toLowerCase())
        );
        
        // If found, merge with new data; otherwise create a minimal entry
        if (metricAnalysis) {
          return {
            ...metricAnalysis,
            contribution: importance / 100,  // Convert percentage to proportion for display
            percentage: importance.toFixed(1)
          };
        } else {
          // Create minimal entry for backend feature
          return {
            metric: feature,
            name: feature,
            value: 'N/A',
            status: 'warning',
            severity: 'Medium',
            message: 'Feature from ML model',
            impact: 'Model identified as important factor',
            suggestion: 'Review code for this metric',
            contribution: importance / 100,
            percentage: importance.toFixed(1)
          };
        }
      })
      .filter(m => m);

    // CRITICAL FIX: Deduplicate by feature name - keep only the first (highest importance) occurrence
    const seenFeatures = new Set();
    const dedupedMetrics = featureImportanceArray.filter(m => {
      const featureKey = (m.metric || m.name).toLowerCase();
      if (seenFeatures.has(featureKey)) {
        return false; // Skip duplicate
      }
      seenFeatures.add(featureKey);
      return true;
    });

    normalizedMetrics = dedupedMetrics.sort((a, b) => b.contribution - a.contribution);
  } else {
    // Fall back to calculated contributions
    normalizedMetrics = metrics_analysis.map(m => ({
      ...m,
      percentage: totalContribution > 0 ? ((m.contribution / totalContribution) * 100).toFixed(1) : 0
    }));
  }

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

      {/* Top Risk Drivers */}
      {topRiskDrivers.length > 0 && (
        <div className="top-risk-drivers">
          <h3 className="drivers-title">🎯 Top Risk Drivers (Model-Based)</h3>
          <div className="drivers-list">
            {topRiskDrivers.map((driver, idx) => (
              <div key={driver.feature} className="driver-item">
                <div className="driver-header">
                  <span className="driver-rank">{idx + 1}.</span>
                  <span className="driver-name">{driver.name}</span>
                  <span className="driver-importance">{driver.importance.toFixed(1)}%</span>
                </div>
                <p className="driver-description">{driver.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Contributors Breakdown */}
      <div className="risk-analysis-layout">
        <div className="breakdown-chart">
          <h3 className="chart-title">Risk Contributors</h3>
          <p className="chart-subtitle">How each metric affects bug probability</p>
          
          <div className="risk-bars">
            {normalizedMetrics.map((metric) => (
              <div key={metric.metric} className="risk-bar-item">
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
            {normalizedMetrics.map((metric) => (
              <div key={metric.metric} className={`detail-card detail-${metric.status}`}>
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
        
        {actionPlan.length > 0 ? (
          <ol className="action-list">
            {actionPlan.map((item, idx) => (
              <li key={item.feature} className={`action-item ${item.priorityClass}`}>
                <span className="action-priority">{item.priorityLabel}:</span>
                <span className="action-emoji">{item.emoji}</span>
                <span className="action-feature"><strong>{item.name}</strong></span>
                <span className="action-importance">({item.importance.toFixed(1)}%)</span>
                <span className="action-text">{item.recommendation}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="action-empty">No action items available</p>
        )}
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
