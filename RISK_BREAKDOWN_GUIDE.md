# 📊 Risk Breakdown Feature - User Guide

## Overview
You now have a comprehensive **Risk Breakdown Board** that shows exactly which metrics are causing your code's bug risk. This feature provides detailed, actionable insights into each metric's contribution to the overall prediction.

## What's New

### New Component: Risk Breakdown Board
The system now displays a detailed analysis below the main prediction that shows:

1. **Critical Issues Alert** - Highlights any metrics at critical risk levels
2. **Risk Contributors Chart** - Visual breakdown of how much each metric contributes to overall bug probability
3. **Detailed Analysis Cards** - Per-metric breakdown with:
   - Current value
   - Risk assessment (Safe/Warning/Critical)
   - Impact explanation
   - Specific improvement suggestion
   - Percentage contribution to total risk

4. **Actionable Recommendations** - Prioritized action plan based on metric criticality
5. **Summary Statistics** - Overall risk score, issue count, risk level

## How to Use It

### Step 1: Analyze Your Code
1. Go to the **Code Analysis** tab
2. Paste your code
3. Click "Analyze Code"

### Step 2: Get Prediction
1. After metrics are extracted, click "Get Risk Prediction"
2. View the assessment and **NEW:** the Risk Breakdown Board

### Alternative: Manual Entry
1. Go to the **Manual Entry** tab
2. Either:
   - Use "Quick Extract" to paste and auto-extract metrics
   - Apply a preset scenario (Low/Medium/High risk)
   - Manually enter metric values
3. Click "Analyze Risk"

## Risk Breakdown Board Sections

### 1. Critical Issues Alert (When Applicable)
```
⚠️ X critical issue(s) identified
- Cyclomatic Complexity: Excessive code paths detected
- Implementation Difficulty: Very difficult implementation
```

### 2. Risk Contributors Chart
Shows percentage contribution of each metric:
- **LOC** (Lines of Code): 0-30%
- **v(g)** (Complexity): 0-35%
- **d** (Difficulty): 0-25%
- **e** (Effort): 0-20%
- **v** (Volume): 0-15%
- **ev_g, iv_g, n**: 0-10%

### 3. Detailed Analysis For Each Metric

#### LOC (Lines of Code)
| Status | Range | Impact |
|--------|-------|--------|
| 🟢 Safe | ≤100 | Well within recommended limits |
| 🟡 Warning | 100-200 | Monitor for growth |
| 🔴 Critical | >200 | Code exceeds recommended length |

**What to do if Critical:**
- Break into smaller functions/modules
- Extract helper methods
- Reduce function complexity

#### v(g) - Cyclomatic Complexity
| Status | Range | Impact |
|--------|-------|--------|
| 🟢 Safe | ≤5 | Easy to test all scenarios |
| 🟡 Warning | 5-10 | Consider refactoring complex conditionals |
| 🔴 Critical | >10 | Difficult to test all scenarios |

**What to do if Critical:**
- Reduce if/else statements
- Use polymorphism or strategies
- Extract complex logic

#### d - Implementation Difficulty
| Status | Range | Impact |
|--------|-------|--------|
| 🟢 Safe | ≤10 | Straightforward implementation |
| 🟡 Warning | 10-20 | Add comments, improve naming |
| 🔴 Critical | >20 | Simplify algorithm, improve clarity |

#### e - Mental Effort
| Status | Range | Impact |
|--------|-------|--------|
| 🟢 Safe | ≤2000 | Maintainable and understandable |
| 🟡 Warning | 2000-5000 | Review and testing critical |
| 🔴 Critical | >5000 | Developers make mistakes due to cognitive load |

#### v - Halstead Volume
| Status | Range | Impact |
|--------|-------|--------|
| 🟢 Safe | ≤250 | Efficient code size |
| 🟡 Warning | 250-500 | Monitor for duplication |
| 🔴 Critical | >500 | Refactor repetitive code |

### 4. Recommended Action Plan
The system provides a prioritized action plan:

```
🎯 Recommended Action Plan

Priority 1: Fix [critical metric name]
- Specific suggestion for this metric

Priority 2: Address [warning metric name]
- Specific suggestion for this metric

Maintain: Keep [safe metric name] quality
- Continue current best practices
```

### 5. Summary Statistics
Displays at the bottom:
- **Total Risk Score**: Overall bug probability percentage
- **Critical Issues**: Count of metrics at critical level
- **Issues to Address**: Total metrics not at safe level
- **Risk Level**: Overall assessment (Low/Medium/High)

## Example Scenarios

### Scenario 1: Low Risk Code
```
✓ Summary: Total Risk Score 15.3%
  - All metrics: 🟢 Safe
  - Action: Maintain current practices
  - Risk Factor Analysis: Shows green progress bars
```

### Scenario 2: Medium Risk Code
```
⚠ Summary: Total Risk Score 52.6%
  - Some metrics: 🟡 Warning
  - Action: Address highlighted issues
  - Risk Factor Analysis: Mix of green, yellow, red
```

### Scenario 3: High Risk Code
```
🔴 Summary: Total Risk Score 78.9%
  - Multiple metrics: 🟴 Critical
  - Critical Alert: Shows which metrics need help
  - Risk Factor Analysis: Mostly red and yellow
  - Action Plan: Prioritized fixes for critical metrics
```

## Key Features

### ✅ Per-Metric Analysis
Each metric is analyzed individually, not just lumped together

### ✅ Contextual Thresholds
Thresholds are based on industry standards for safe/acceptable/dangerous ranges

### ✅ Visual Clarity
- Progress bars show contribution percentage
- Color coding (green/yellow/red) for quick scanning
- Clear status badges for each metric

### ✅ Actionable Insights
Not just "this is bad" but "here's why and what to do about it"

### ✅ Mobile Responsive
Full functionality on desktop, tablet, and mobile devices

## Testing the Feature

### Test Case 1: Simple Low-Risk Code
**Code:**
```python
def add(x, y):
    return x + y
```
**Expected Risk Score:** ~10-15% (Low Risk)
**Expected Board:** All metrics green, suggestions to maintain quality

### Test Case 2: Complex High-Risk Code
**Code:**
```python
def complex_function(a, b, c, d, e):
    if a > 0:
        if b > 0:
            if c > 0:
                if d > 0:
                    if e > 0:
                        return a+b+c+d+e
                    else:
                        return a+b+c+d
                else:
                    return a+b+c
            else:
                return a+b
        else:
            return a
    else:
        return 0
```
**Expected Risk Score:** ~50-70% (Medium-High Risk)
**Expected Board:** 
- v(g) at warning/critical level
- Multiple issues highlighted
- Action plan focusing on reducing complexity

## Tips for Better Code

1. **Keep Functions Small**: Keep LOC < 50 lines per function
2. **Reduce Nesting**: Aim for v(g) < 5
3. **Write Clear Code**: Use meaningful variable names, add comments
4. **Test Thoroughly**: High effort code needs more testing
5. **Refactor Regularly**: Don't let metrics gradually increase

## Technical Notes

- The Risk Breakdown Board is only shown after a prediction is made
- Requires metrics data to be available (from code analysis or manual entry)
- All calculations are done client-side for performance
- Thresholds are based on industry best practices

## Questions or Issues?

The system is designed to help you understand exactly where your code risks lie. Each metric tells you something important:

- **LOC** → How much code to maintain and test
- **v(g)** → How many different execution paths to test
- **d** → How difficult the implementation approach is
- **e** → How much mental effort is required to understand
- **v** → How much code vocabulary (operators + operands)
- **ev_g** → Essential/structural complexity
- **iv_g** → Integration complexity
- **n** → Count of operators and operands

Use these insights to make targeted improvements to your code quality!
