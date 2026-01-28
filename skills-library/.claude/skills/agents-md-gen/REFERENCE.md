# AGENTS.md Generator Reference

## Overview
The AGENTS.md generator is a skill that creates comprehensive documentation files for repositories, helping AI agents understand project structure and development patterns.

## Templates

### Skills Library Template
Used for repositories containing AI skills. Includes:
- Skill structure standards
- Token efficiency patterns
- Cross-agent compatibility guidelines
- File naming conventions

### Next.js Template
Used for Next.js applications. Includes:
- Project structure
- Tech stack information
- Development commands
- File naming conventions

### FastAPI Template
Used for FastAPI services. Includes:
- Project structure
- Tech stack information
- Development commands
- API standards

## Project Type Detection
The script automatically detects project type based on:
- `package.json` presence (Next.js, Node.js)
- `requirements.txt` or `pyproject.toml` (Python/FastAPI)
- `.claude/skills` directory (Skills library)

## Customization
The script analyzes the repository structure and incorporates:
- Directory listings
- Key files
- Technology stack inference

## Usage Examples

### Basic Usage
```bash
python scripts/generate_agents_md.py
```

### With Specific Path
```bash
python scripts/generate_agents_md.py /path/to/repository
```

## Error Handling
- Validates repository path exists
- Handles missing files gracefully
- Provides clear error messages

## Output
- Creates `AGENTS.md` in the target repository root
- Reports statistics about analysis
- Shows success/failure status