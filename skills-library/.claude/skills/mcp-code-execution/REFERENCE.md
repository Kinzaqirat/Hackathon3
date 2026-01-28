# MCP Code Execution Pattern Reference

## Overview

The MCP Code Execution pattern is a technique for maximizing token efficiency when working with large datasets or repeated MCP server calls. Instead of returning large amounts of data to the agent context, this pattern processes data locally and returns only minimal, relevant results.

## Token Efficiency Gains

The pattern can achieve **80-98% token reduction** compared to direct MCP approaches:

- **Direct MCP Approach**: Large file content returned to context (5,000+ tokens)
- **Code Execution Pattern**: Local processing, minimal results returned (100-200 tokens)
- **Savings**: ~96% token reduction

## Architecture

```
┌─────────────────────────────────────────────┐
│         AI Agent (Limited Context)          │
│  - Call script with minimal parameters      │
│  - Receive processed results (small)        │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│    Code Execution Environment                │
│  - MCP Client wrapper (mcp_client.py)       │
│  - Local data processing                     │
│  - Heavy lifting happens here                │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│      MCP Servers / External Systems         │
│  - File system access                        │
│  - Code analysis tools                       │
│  - Database queries                          │
└─────────────────────────────────────────────┘
```

## Generic MCP Client Wrapper

The `MCPSession` class provides a reusable wrapper that:

1. **Handles multiple tool types**: read_file, list_files, execute_command, etc.
2. **Processes data locally**: Analyzes content before returning to context
3. **Returns minimal results**: Only essential information formatted for agent use
4. **Caches results**: Stores processed data to avoid repeated computations

### Key Methods

```python
async def call_tool(tool_name: str, params: Dict[str, Any]) -> Dict[str, Any]:
    """Call MCP tool with local processing"""
    
async def _handle_read_file(params: Dict[str, Any]) -> Dict[str, Any]:
    """Read file and return analysis, not full content"""
    
async def _handle_list_files(params: Dict[str, Any]) -> Dict[str, Any]:
    """List files and return structured metadata"""
    
async def _handle_execute_command(params: Dict[str, Any]) -> Dict[str, Any]:
    """Execute command and return summary of results"""
```

## Use Cases

### 1. Large File Analysis
**Problem**: File has 10,000 lines, returning all to context costs 5,000 tokens
**Solution**: Analyze locally, return:
```json
{
  "file_analysis": {
    "total_lines": 10000,
    "keywords_found": ["function", "class"],
    "summary": "Large file with utilities module",
    "recommendation": "Consider splitting into smaller files"
  }
}
```
**Token Cost**: 50-100 tokens instead of 5,000 tokens

### 2. Repository Search
**Problem**: Searching repository for pattern matches across 1,000 files
**Solution**: Process locally, return:
```json
{
  "search_results": {
    "total_files_searched": 1000,
    "matches_found": 42,
    "top_matches": [
      {"file": "src/handler.ts", "line": 42},
      {"file": "src/utils.ts", "line": 18}
    ],
    "summary": "Found pattern in 42 files across codebase"
  }
}
```

### 3. Database Query Results
**Problem**: Query returns 10,000 records, each formatted returns 50,000+ tokens
**Solution**: Process locally, return:
```json
{
  "query_results": {
    "total_records": 10000,
    "top_records": [...],  // Only top 5-10
    "statistics": {"avg": 42, "max": 100},
    "summary": "10,000 records processed, top results returned"
  }
}
```

## Best Practices

### 1. Always Return Minimal Information
- Total counts instead of full lists
- Summary statistics instead of individual records
- Key recommendations instead of raw data

### 2. Use Caching Strategically
- Cache large file reads for repeated access
- Don't cache frequently updated data
- Use cache TTL for accuracy

### 3. Structure Results Clearly
```python
{
    "status": "success",              # Operation success
    "summary": "...",                 # Human-readable summary
    "key_data": [...],                # Only essential information
    "processing_time": 0.25,          # Performance metric
    "token_estimate": "50-100 tokens" # Estimated token cost to context
}
```

### 4. Validate Before Returning
- Check data integrity locally
- Provide error details instead of raw stack traces
- Return actionable results only

## Token Estimation

Use these rough guidelines for token counting:

- **Per word**: ~1.3 tokens
- **Per line of code**: ~4-6 tokens
- **Per JSON object**: Varies, typically 2-3 tokens overhead

### Example Savings Calculation

```
Large File (1000 lines):
- Direct approach: 1000 lines × 5 tokens/line = 5,000 tokens
- Code execution: Analysis results (50-100 tokens) = ~98% savings

Repository Search (1000 files):
- Direct approach: Full results = 10,000+ tokens
- Code execution: Summary + top 10 = 200-300 tokens = ~97% savings

Database Query (10,000 records):
- Direct approach: All records = 50,000+ tokens
- Code execution: Summary + top 20 = 500-800 tokens = ~98% savings
```

## Example Implementation Pattern

```python
async def analyze_large_file(file_path: str):
    """
    Demonstrates the code execution pattern:
    1. Read full file (expensive)
    2. Process locally (fast, no token cost)
    3. Return minimal results (cheap, minimal tokens)
    """
    
    # Step 1: Get full content from MCP (happens locally)
    content = await mcp.read_file(file_path)
    
    # Step 2: Process locally (no token cost)
    lines = content.split('\n')
    keywords = extract_keywords(lines)
    structure = analyze_structure(lines)
    
    # Step 3: Return minimal results (cheap to add to context)
    return {
        "file": file_path,
        "total_lines": len(lines),
        "keywords": keywords[:5],  # Top 5 only
        "structure": {
            "classes": len(structure['classes']),
            "functions": len(structure['functions'])
        },
        "recommendations": generate_recommendations(structure)
    }
```

## Common Patterns by Tool

### Pattern: Code Analysis
```python
# Read code → Find patterns locally → Return findings
results = {
    "code_quality": "high",
    "issues_found": 3,
    "top_issues": ["unused import on line 42", ...],
    "overall_score": 8.5
}
```

### Pattern: File Search
```python
# Search files → Aggregate results locally → Return summary
results = {
    "files_searched": 1000,
    "matches_found": 42,
    "file_summary": {"src/": 30, "tests/": 12},
    "top_match": "src/handler.ts:42"
}
```

### Pattern: Data Processing
```python
# Fetch data → Process locally → Return statistics
results = {
    "total_records": 50000,
    "processed": 50000,
    "statistics": {"mean": 42.5, "median": 40, "std": 8.2},
    "top_outliers": [...]
}
```

## Troubleshooting

### Token Count Still High?
- Check that you're not returning full lists/arrays
- Verify caching is working
- Consider sampling data instead of all results

### Processing Takes Too Long?
- Add timeout limits
- Use sampling for large datasets
- Consider streaming results

### Results Seem Incomplete?
- Increase the top-N results returned
- Add more statistics/summaries
- Include recommended next steps

## References

- [MCP Code Execution Pattern Skill](./SKILL.md)
- [Example Usage](./scripts/example_usage.py)
- [Generic MCP Client](./scripts/mcp_client.py)
