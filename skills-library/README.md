# Skills Library

This repository contains reusable Skills for AI coding agents (Claude Code, Goose, etc.). Skills use the MCP Code Execution pattern for token efficiency.

## Overview

The Skills Library provides a collection of reusable development tasks that can be executed by AI agents. Each skill follows the MCP Code Execution pattern to maximize token efficiency while maintaining full functionality.

## Skills Available

### Foundation Skills (Phase 1) ✓
- `agents-md-gen`: Generate AGENTS.md files for repositories
- `mcp-code-execution`: Demonstrate MCP Code Execution pattern for token efficiency

### Infrastructure Skills (Phase 2)
- `kafka-k8s-setup`: Deploy Apache Kafka on Kubernetes with LearnFlow topics
- `postgres-k8s-setup`: Deploy PostgreSQL on Kubernetes with LearnFlow schema

### Service Skills (Phase 3)
- `fastapi-dapr-agent`: Scaffold FastAPI microservices with Dapr and OpenAI Agents SDK

### Deployment Skills (Phase 4)
- `nextjs-k8s-deploy`: Build and deploy Next.js applications to Kubernetes
- `docusaurus-deploy`: Generate and deploy documentation sites with Docusaurus

## Structure

```
.claude/skills/          # Skills directory
  ├── {skill-name}/
  │   ├── SKILL.md       # Skill instructions (~100 tokens)
  │   ├── REFERENCE.md   # Detailed docs (loaded on-demand)
  │   └── scripts/       # Executable scripts (0 tokens in context)
docs/                    # Documentation
```

## Usage

AI agents can use these skills by referencing the skill name and following the instructions in the SKILL.md file.