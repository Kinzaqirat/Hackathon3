#!/usr/bin/env python3
"""
Generate AGENTS.md file for a repository.
Analyzes structure and creates comprehensive guide for AI agents.
"""

import os
import sys
from pathlib import Path
from typing import Dict, List


def detect_project_type(repo_path: Path) -> str:
    """Detect project type based on files present."""
    if (repo_path / "package.json").exists():
        pkg = (repo_path / "package.json").read_text()
        if "next" in pkg.lower():
            return "nextjs"
        return "nodejs"
    elif (repo_path / "requirements.txt").exists() or (repo_path / "pyproject.toml").exists():
        if (repo_path / "main.py").exists():
            return "fastapi"
        return "python"
    elif (repo_path / ".claude" / "skills").exists():
        return "skills-library"
    return "generic"


def analyze_structure(repo_path: Path) -> Dict:
    """Analyze repository structure."""
    structure = {
        "directories": [],
        "key_files": [],
        "tech_stack": []
    }

    for item in repo_path.iterdir():
        if item.is_dir() and not item.name.startswith('.'):
            structure["directories"].append(item.name)

    key_files = ["README.md", "package.json", "requirements.txt", "Dockerfile", "docker-compose.yml"]
    for file in key_files:
        if (repo_path / file).exists():
            structure["key_files"].append(file)

    return structure


def generate_agents_md(repo_path: Path, project_type: str, structure: Dict) -> str:
    """Generate AGENTS.md content."""

    templates = {
        "skills-library": """# AGENTS.md - Skills Library

## Project Overview
This repository contains reusable Skills for AI coding agents (Claude Code, Goose, Codex).
Skills use the MCP Code Execution pattern for token efficiency.

## Repository Structure
```
.claude/skills/          # Skills directory
  ├── {skill-name}/
  │   ├── SKILL.md       # Skill instructions (~100 tokens)
  │   ├── REFERENCE.md   # Detailed docs (loaded on-demand)
  │   └── scripts/       # Executable scripts (0 tokens in context)
docs/                    # Documentation
```

## Development Standards

### Skill Structure
Every skill MUST follow this structure:
- SKILL.md: Minimal instructions, triggers, validation
- scripts/: Executable code (Python, Bash, etc.)
- REFERENCE.md: Detailed configuration options

### Token Efficiency
- SKILL.md: ~100 tokens maximum
- Scripts execute outside context (0 tokens)
- Only final output enters context (~10-50 tokens)
- Target: 80-98% token reduction vs direct MCP

### Cross-Agent Compatibility
- Skills must work on Claude Code AND Goose
- Use standard YAML frontmatter
- Avoid agent-specific syntax

## File Naming Conventions
- Skills: kebab-case (e.g., kafka-k8s-setup)
- Scripts: snake_case (e.g., generate_agents_md.py)
- Shell scripts: .sh extension
- Python scripts: .py extension, executable

## Tech Stack
- Languages: Python 3.11+, Bash
- Tools: kubectl, helm, docker
- Standards: MCP, AAIF

## Development Workflow
1. Create skill directory in .claude/skills/
2. Write SKILL.md with minimal instructions
3. Implement scripts/ for execution
4. Add REFERENCE.md for deep docs
5. Test on Claude Code and Goose
6. Document in docs/

## Testing Skills
```bash
# Test with Claude Code
claude "Use {skill-name} to {task}"

# Test with Goose
goose "Use {skill-name} to {task}"
```

## Contributing
New skills should:
- Solve a reusable problem
- Follow MCP Code Execution pattern
- Include comprehensive REFERENCE.md
- Work on both Claude Code and Goose
""",

        "nextjs": """# AGENTS.md - Next.js Application

## Project Overview
Next.js application using App Router with TypeScript.

## Directory Structure
```
src/
  ├── app/              # App Router pages
  ├── components/       # React components
  ├── lib/              # Utility functions
  └── styles/           # Global styles
public/                 # Static assets
```

## Tech Stack
- Framework: Next.js 14+
- Language: TypeScript
- Styling: TailwindCSS
- State: React Context / Zustand

## Development Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## File Naming Conventions
- Components: PascalCase (e.g., UserDashboard.tsx)
- Utils: camelCase (e.g., formatDate.ts)
- Pages: lowercase (e.g., page.tsx, layout.tsx)

## Code Patterns
- Use Server Components by default
- Add 'use client' only when needed
- Colocate components with their pages
- Keep components small and focused

## Environment Variables
Create `.env.local` with:
```
NEXT_PUBLIC_API_URL=
```
""",

        "fastapi": """# AGENTS.md - FastAPI Service

## Project Overview
FastAPI microservice with async support.

## Directory Structure
```
app/
  ├── main.py           # FastAPI app initialization
  ├── models/           # Pydantic models
  ├── routes/           # API endpoints
  ├── services/         # Business logic
  └── utils/            # Helper functions
```

## Tech Stack
- Framework: FastAPI
- Language: Python 3.11+
- Async: asyncio, httpx
- Database: SQLAlchemy (if applicable)

## Development Commands
```bash
uvicorn app.main:app --reload    # Start dev server
pytest                           # Run tests
black .                          # Format code
mypy .                           # Type checking
```

## File Naming Conventions
- Modules: snake_case
- Classes: PascalCase
- Functions: snake_case

## Code Patterns
- Use async/await for I/O operations
- Type hints required for all functions
- Pydantic models for request/response validation
- Dependency injection for shared resources

## API Standards
- RESTful endpoints
- JSON responses
- HTTP status codes
- Error handling middleware
"""
    }

    template = templates.get(project_type, templates["skills-library"])

    # Customize with actual structure
    dirs = "\n".join(f"  - {d}/" for d in sorted(structure["directories"]))
    template = template.replace("{directories}", dirs)

    return template


def main():
    if len(sys.argv) < 2:
        repo_path = Path.cwd()
    else:
        repo_path = Path(sys.argv[1])

    if not repo_path.exists():
        print(f"✗ Error: Path {repo_path} does not exist", file=sys.stderr)
        return 1

    # Detect project type
    project_type = detect_project_type(repo_path)

    # Analyze structure
    structure = analyze_structure(repo_path)

    # Generate content
    content = generate_agents_md(repo_path, project_type, structure)

    # Write file
    agents_md_path = repo_path / "AGENTS.md"
    agents_md_path.write_text(content)

    print(f"✓ Generated AGENTS.md for {project_type} project")
    print(f"  Path: {agents_md_path}")
    print(f"  Directories analyzed: {len(structure['directories'])}")

    return 0


if __name__ == "__main__":
    sys.exit(main())