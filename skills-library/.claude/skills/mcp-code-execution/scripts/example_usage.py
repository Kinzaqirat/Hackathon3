#!/usr/bin/env python3
"""
Example usage demonstrating MCP Code Execution pattern for token efficiency.
Shows before/after comparison of direct MCP calls vs code execution pattern.
"""

import time
import random
import json
from typing import Dict, List
from mcp_client import MCPSession  # Import our generic client


def simulate_direct_mcp_approach():
    """
    Simulate the direct MCP approach where large data is returned to context.
    This consumes many tokens.
    """
    print("=== DIRECT MCP APPROACH (Token-Heavy) ===")

    # Simulate getting a large file content directly from MCP
    large_content = "Line " + "\\nLine ".join([str(i) for i in range(1, 1001)])  # 1000 lines
    token_count_before = len(large_content.split())  # Rough token estimation

    print(f"Direct MCP returns large content: ~{token_count_before} tokens")
    print(f"Content preview: {large_content[:100]}...")

    return token_count_before


def simulate_code_execution_pattern():
    """
    Simulate the MCP Code Execution pattern where processing happens locally.
    This minimizes token usage.
    """
    print("\\n=== MCP CODE EXECUTION PATTERN (Token-Efficient) ===")

    # Instead of returning large content, process it locally and return minimal results
    # This is what our MCPSession class does
    client = MCPSession()

    # Simulate processing that would happen in a real implementation
    result = {
        "file_analysis": {
            "total_lines": 1000,
            "keywords_found": ["function", "class", "import"],
            "summary": "Large file with 1000 lines of code",
            "recommendation": "Consider refactoring into smaller modules"
        },
        "processing_time": 0.25,
        "token_usage": 50  # Much smaller token footprint
    }

    print(f"MCP Code Execution returns processed result: ~{result['token_usage']} tokens")
    print(f"Analysis: {json.dumps(result['file_analysis'], indent=2)}")

    return result['token_usage']


def calculate_token_savings(direct_tokens: int, efficient_tokens: int) -> float:
    """Calculate percentage token savings."""
    if direct_tokens == 0:
        return 0.0
    return ((direct_tokens - efficient_tokens) / direct_tokens) * 100


def main():
    """Main function demonstrating token efficiency comparison."""
    print("MCP Code Execution Pattern - Token Efficiency Demonstration")
    print("=" * 60)

    # Simulate direct MCP approach
    direct_token_usage = simulate_direct_mcp_approach()

    # Simulate MCP Code Execution pattern
    efficient_token_usage = simulate_code_execution_pattern()

    # Calculate and display savings
    savings_percentage = calculate_token_savings(direct_token_usage, efficient_token_usage)

    print(f"\\n=== TOKEN EFFICIENCY RESULTS ===")
    print(f"Direct MCP Tokens: {direct_token_usage}")
    print(f"Code Execution Tokens: {efficient_token_usage}")
    print(f"Tokens Saved: {direct_token_usage - efficient_token_usage}")
    print(f"Savings Percentage: {savings_percentage:.1f}%")

    if savings_percentage >= 80:
        print("✅ SUCCESS: Achieved 80%+ token reduction as targeted!")
    else:
        print(f"⚠️  NOTE: Could improve further - target is 80%+ reduction")

    print("\\nKey Benefits of MCP Code Execution Pattern:")
    print("- Local processing of large data")
    print("- Minimal results returned to context")
    print("- Significant token savings")
    print("- Faster response times")
    print("- Better privacy (data stays local)")

    return 0


if __name__ == "__main__":
    exit(main())