"""
Backend utility functions and helpers
"""

import json
from typing import Dict, Any


def format_prediction(prediction: Dict[str, Any]) -> str:
    """Format prediction result for display"""
    return json.dumps(prediction, indent=2)


def validate_metrics(loc, v_g, ev_g, iv_g, n, v, d, e) -> tuple[bool, str]:
    """
    Validate input metrics
    
    Returns:
        Tuple[success: bool, message: str]
    """
    
    # Check for negative values
    metrics = {'loc': loc, 'v(g)': v_g, 'ev(g)': ev_g, 'iv(g)': iv_g, 
               'n': n, 'v': v, 'd': d, 'e': e}
    
    for name, value in metrics.items():
        if value < 0:
            return False, f"Metric {name} cannot be negative: {value}"
    
    # Check for unreasonable values
    if loc > 10000:
        return False, "LOC seems too high (>10000)"
    
    if e > 1000000:
        return False, "Effort seems too high (>1000000)"
    
    return True, "Validation passed"
