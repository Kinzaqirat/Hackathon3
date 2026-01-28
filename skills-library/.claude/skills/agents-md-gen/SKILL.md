---
name: agents-md-gen
description: Generate AGENTS.md files for repositories
version: 1.0.0
allowed-tools: [bash, python]
---

# Generate AGENTS.md

## When to Use
- Creating AGENTS.md for a new repository
- User asks: "Generate AGENTS.md" or "Create repository guide"
- Need to document repository structure for AI agents

## Instructions
1. Run `python scripts/generate_agents_md.py`
2. Verify output shows success (✓ messages)
3. Check generated AGENTS.md file in repository root

## Validation
- [ ] AGENTS.md file created in repository root
- [ ] File contains appropriate project structure
- [ ] Template matches project type (skills-library, nextjs, fastapi, etc.)

## Outputs
- `AGENTS.md` file in repository root

For detailed configuration options, see [REFERENCE.md](./REFERENCE.md).