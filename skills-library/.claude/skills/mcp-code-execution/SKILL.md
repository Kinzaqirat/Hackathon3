---
name: mcp-code-execution
description: Demonstrate MCP Code Execution pattern for token efficiency
version: 1.0.0
allowed-tools: [bash, python]
---

# MCP Code Execution Pattern

## When to Use
- Large data operations that would consume many tokens in context
- Repeated calls to MCP servers that can be processed locally
- When needing to achieve 80-98% token reduction vs direct MCP usage
- User asks: "Use MCP Code Execution pattern" or "Reduce token usage"

## Instructions
1. Run `python scripts/example_usage.py` to see token savings comparison
2. Use `scripts/mcp_client.py` as a generic wrapper for MCP calls
3. Process data locally, return minimal results to context
4. Verify output shows significant token reduction (80%+)

## Validation
- [ ] Token usage reduced by 80%+ vs direct MCP
- [ ] Example shows clear before/after comparison
- [ ] Generic client wrapper works for multiple MCP servers

## Outputs
- Token efficiency metrics
- Generic MCP client wrapper
- Before/after comparison

For detailed configuration options, see [REFERENCE.md](./REFERENCE.md).