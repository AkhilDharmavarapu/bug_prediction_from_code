"""
PHASE 3: Feature Extraction from Source Code - Multi-Language Support

This module extracts software metrics from code in multiple programming languages:
- Python (using radon)
- JavaScript/TypeScript
- Java
- C/C++
- C#/.NET
- Go
- Ruby
- PHP
- Key metrics: LOC, Cyclomatic Complexity, Halstead Metrics, etc.

Supports auto-detection and manual language specification.
"""

import re
from typing import Dict, Any, Tuple, Optional
import warnings
import math

# Try to import radon for Python analysis
try:
    from radon.complexity import cc_visit
    from radon.metrics import mi_visit, h_visit
    from radon.raw import analyze
    RADON_AVAILABLE = True
except ImportError:
    RADON_AVAILABLE = False
    print("Warning: radon library not installed. Install with: pip install radon")


# ============================================================================
# Language Detection
# ============================================================================

LANGUAGE_EXTENSIONS = {
    '.py': 'python',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.java': 'java',
    '.cpp': 'cpp',
    '.cc': 'cpp',
    '.cxx': 'cpp',
    '.c': 'c',
    '.h': 'cpp',
    '.hpp': 'cpp',
    '.cs': 'csharp',
    '.go': 'go',
    '.rb': 'ruby',
    '.php': 'php',
}


class LanguageAnalyzer:
    """Base class for language-specific analyzers"""
    
    @staticmethod
    def detect_language(code: str, filename: Optional[str] = None) -> str:
        """Detect programming language from code or filename"""
        
        # If filename provided, use extension
        if filename:
            for ext, lang in LANGUAGE_EXTENSIONS.items():
                if filename.lower().endswith(ext):
                    return lang
        
        # Auto-detect from code characteristics
        code_lower = code.lower()
        
        # Python
        if any(kw in code_lower for kw in ['import ', 'from ', 'def ', 'class ', '@decorator', 'self.']):
            if 'import' in code_lower and ':' in code and 'class' in code_lower:
                return 'python'
        
        # JavaScript/TypeScript
        if any(kw in code for kw in ['function ', 'const ', 'let ', '=>', 'require(', 'export']):
            return 'typescript' if '.ts' in code_lower or 'interface' in code_lower else 'javascript'
        
        # Java
        if any(kw in code for kw in ['public class', 'import java', 'public static void main']):
            return 'java'
        
        # C++
        if any(kw in code for kw in ['#include', 'std::', 'template', 'namespace']):
            return 'cpp'
        
        # C#
        if any(kw in code for kw in ['using System', 'public class', 'namespace']):
            return 'csharp'
        
        # Go
        if any(kw in code for kw in ['package main', 'func ', 'go run']):
            return 'go'
        
        # Ruby
        if any(kw in code for kw in ['def ', 'end', '@', ':', 'module']):
            if 'def ' in code and 'end' in code:
                return 'ruby'
        
        # PHP
        if any(kw in code for kw in ['<?php', 'function ', '$', '->']):
            return 'php'
        
        # Default to python
        return 'python'
    
    @staticmethod
    def estimate_halstead(code: str, lang: str = 'generic') -> Dict[str, float]:
        """Estimate Halstead metrics (simplified version)"""
        
        # Remove comments based on language
        if lang == 'python':
            code_no_comments = re.sub(r'#.*', '', code)
        elif lang in ['javascript', 'typescript', 'java', 'cpp', 'c', 'csharp', 'go']:
            code_no_comments = re.sub(r'//.*|/\*.*?\*/', '', code, flags=re.DOTALL)
        elif lang == 'ruby':
            code_no_comments = re.sub(r'#.*', '', code)
        elif lang == 'php':
            code_no_comments = re.sub(r'//.*|#.*|/\*.*?\*/', '', code, flags=re.DOTALL)
        else:
            code_no_comments = code
        
        # Extract operators and operands
        operators = set(re.findall(r'[\+\-\*/\%\=\<\>\!&\|^]+', code_no_comments))
        operands = set(re.findall(r'[a-zA-Z_][a-zA-Z0-9_]*', code_no_comments))
        
        n1 = len(operators) or 1
        n2 = len(operands) or 1
        
        vocabulary = n1 + n2
        total_n = len(re.findall(r'[\+\-\*/\%\=\<\>\!&\|^a-zA-Z0-9_]+', code_no_comments))
        total_n = max(total_n, 1)
        
        volume = total_n * math.log2(vocabulary) if vocabulary > 0 else 0
        difficulty = (n1 / 2) * (total_n / n2) if n2 > 0 else 0
        effort = difficulty * volume
        
        return {
            'volume': max(volume, 1),
            'difficulty': max(difficulty, 1),
            'effort': max(effort, 1)
        }
    
    @staticmethod
    def count_complexity(code: str, lang: str) -> Tuple[float, float]:
        """Count cyclomatic and halstead complexity for language"""
        
        # Remove strings and comments
        if lang == 'python':
            code_clean = re.sub(r'#.*|["\'].*?["\']', '', code, flags=re.DOTALL)
        elif lang in ['javascript', 'typescript', 'java', 'cpp', 'c', 'csharp', 'go', 'php']:
            code_clean = re.sub(r'//.*|/\*.*?\*/|["\'].*?["\']|`.*?`', '', code, flags=re.DOTALL)
        elif lang == 'ruby':
            code_clean = re.sub(r'#.*|["\'].*?["\']', '', code)
        else:
            code_clean = code
        
        # Count complexity keywords
        complexity_keywords = {
            'if': 1, 'else': 0, 'elif': 0, 'elseif': 0,
            'for': 1, 'foreach': 1, 'while': 1, 'do': 0,
            'switch': 1, 'case': 1,
            'catch': 1, 'try': 0,
            '?': 1, '&&': 1, '||': 1,  # Ternary and logical operators
            'and': 1, 'or': 1,  # Python/Ruby logical
        }
        
        complexity = 1  # Base complexity
        for keyword, increment in complexity_keywords.items():
            regex = r'\b' + keyword + r'\b' if keyword.isalpha() else re.escape(keyword)
            complexity += len(re.findall(regex, code_clean, re.IGNORECASE)) * (increment if increment > 0 else 1)
        
        # Simplified essential complexity
        essential_complexity = max(1, complexity // 2)
        
        return complexity, essential_complexity


class PythonAnalyzer(LanguageAnalyzer):
    """Python code analyzer using radon"""
    
    @staticmethod
    def analyze(code: str) -> Tuple[bool, Dict[str, Any], str]:
        if not RADON_AVAILABLE:
            return False, {}, "radon library not available. Install with: pip install radon"
        
        if not code or len(code.strip()) == 0:
            return False, {}, "Code is empty"
        
        try:
            raw_metrics = analyze(code)
            loc = raw_metrics.loc
            
            complexity_results = cc_visit(code)
            if complexity_results:
                avg_complexity = sum(func.complexity for func in complexity_results) / len(complexity_results)
                max_complexity = max(func.complexity for func in complexity_results)
            else:
                avg_complexity = 1
                max_complexity = 1
            
            try:
                mi_result = mi_visit(code, multi=True)
                maintainability_index = mi_result.mi
            except:
                maintainability_index = 0
            
            halstead_metrics = LanguageAnalyzer.estimate_halstead(code, 'python')
            
            metrics = {
                'loc': loc,
                'v(g)': max_complexity,
                'ev(g)': avg_complexity,
                'iv(g)': max_complexity,
                'n': raw_metrics.lloc,
                'v': halstead_metrics['volume'],
                'd': halstead_metrics['difficulty'],
                'e': halstead_metrics['effort'],
                'maintainability_index': maintainability_index,
                'raw_metrics': {
                    'loc': loc,
                    'lloc': raw_metrics.lloc,
                    'sloc': raw_metrics.sloc,
                    'comments': raw_metrics.comments,
                    'multi': raw_metrics.multi,
                    'single_line': raw_metrics.single_comments,
                    'blank': raw_metrics.blank
                }
            }
            
            return True, metrics, "Metrics extracted successfully"
        
        except SyntaxError as e:
            return False, {}, f"Syntax error in code: {str(e)}"
        except Exception as e:
            return False, {}, f"Error extracting metrics: {str(e)}"


class GenericLanguageAnalyzer(LanguageAnalyzer):
    """Generic analyzer for any language"""
    
    @staticmethod
    def analyze(code: str, lang: str) -> Tuple[bool, Dict[str, Any], str]:
        if not code or len(code.strip()) == 0:
            return False, {}, "Code is empty"
        
        try:
            # Count lines
            lines = code.split('\n')
            loc = len(lines)
            blank_lines = len([l for l in lines if l.strip() == ''])
            comment_lines = GenericLanguageAnalyzer._count_comments(code, lang)
            sloc = loc - blank_lines - comment_lines
            lloc = sloc
            
            # Count complexity
            max_complexity, avg_complexity = LanguageAnalyzer.count_complexity(code, lang)
            
            # Halstead metrics
            halstead_metrics = LanguageAnalyzer.estimate_halstead(code, lang)
            
            metrics = {
                'loc': loc,
                'v(g)': max_complexity,
                'ev(g)': avg_complexity,
                'iv(g)': max(1, max_complexity // 2),
                'n': lloc,
                'v': halstead_metrics['volume'],
                'd': halstead_metrics['difficulty'],
                'e': halstead_metrics['effort'],
                'language': lang,
                'raw_metrics': {
                    'loc': loc,
                    'lloc': lloc,
                    'sloc': sloc,
                    'comments': comment_lines,
                    'blank': blank_lines
                }
            }
            
            return True, metrics, f"Metrics extracted successfully ({lang})"
        
        except Exception as e:
            return False, {}, f"Error extracting metrics: {str(e)}"
    
    @staticmethod
    def _count_comments(code: str, lang: str) -> int:
        """Count comment lines based on language"""
        
        if lang == 'python':
            comment_pattern = r'^\s*#'
        elif lang in ['javascript', 'typescript', 'java', 'cpp', 'c', 'csharp', 'go']:
            # Count lines starting with // or inside /* */
            comment_pattern = r'^\s*//|^\s*\*'
        elif lang == 'ruby':
            comment_pattern = r'^\s*#'
        elif lang == 'php':
            comment_pattern = r'^\s*(#|//|/\*|\*)'
        else:
            comment_pattern = r'^\s*#'
        
        lines = code.split('\n')
        count = 0
        in_multiline = False
        
        for line in lines:
            stripped = line.strip()
            if '/*' in line or '/**' in line:
                in_multiline = True
            if in_multiline:
                count += 1
            if '*/' in line:
                in_multiline = False
                continue
            
            if re.match(comment_pattern, line):
                count += 1
        
        return count


class CodeMetricsExtractor:
    """
    Extract software metrics from code in multiple programming languages
    """
    
    @staticmethod
    def extract_metrics(code: str, language: Optional[str] = None, filename: Optional[str] = None) -> Tuple[bool, Dict[str, Any], str]:
        """
        Extract metrics from code in multiple programming languages
        
        Parameters:
        -----------
        code : str
            Source code to analyze
        language : str, optional
            Programming language (auto-detected if not provided)
            Supported: python, javascript, typescript, java, cpp, c, csharp, go, ruby, php
        filename : str, optional
            Filename for language detection via extension
        
        Returns:
        --------
        Tuple[success, metrics_dict, message]
        """
        
        # Detect language if not provided
        if not language:
            language = LanguageAnalyzer.detect_language(code, filename)
        else:
            language = language.lower()
        
        # Use appropriate analyzer
        if language == 'python':
            return PythonAnalyzer.analyze(code)
        else:
            return GenericLanguageAnalyzer.analyze(code, language)
    
    @staticmethod
    def get_supported_languages() -> Dict[str, str]:
        """Get list of supported languages"""
        return {
            'python': 'Python',
            'javascript': 'JavaScript',
            'typescript': 'TypeScript',
            'java': 'Java',
            'cpp': 'C++',
            'c': 'C',
            'csharp': 'C#/.NET',
            'go': 'Go',
            'ruby': 'Ruby',
            'php': 'PHP'
        }


# ============================================================================
# Example usage
# ============================================================================

if __name__ == "__main__":
    # Sample code to analyze
    sample_code = """
def calculate_fibonacci(n):
    '''Calculate fibonacci number'''
    if n <= 1:
        return n
    else:
        a, b = 0, 1
        for i in range(2, n + 1):
            a, b = b, a + b
        return b

def main():
    result = calculate_fibonacci(10)
    print(f'Fibonacci(10) = {result}')

if __name__ == '__main__':
    main()
"""
    
    success, metrics, message = CodeMetricsExtractor.extract_metrics(sample_code)
    
    if success:
        print("✓ Metrics extracted successfully!\n")
        print("Metrics:")
        for key, value in metrics.items():
            if key != 'raw_metrics':
                print(f"  {key}: {value}")
        print("\nRaw Metrics:")
        for key, value in metrics['raw_metrics'].items():
            print(f"  {key}: {value}")
    else:
        print(f"✗ Error: {message}")
