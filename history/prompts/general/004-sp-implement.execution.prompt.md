---
id: 004
title: sp-implement execution for hackathon
stage: general
date: 2026-01-21
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-hackathon-spec
user: pc
command: /sp.implement
labels: [hackathon, implementation, execution]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - history/prompts/general/004-sp-implement.execution.prompt.md
tests:
 - none
---

## Prompt

```text
# sp.implement.md
# Implementation Guide - Hackathon III

This document provides detailed implementation guidance for executing the hackathon using AI agents (Claude Code and Goose). It includes prompts, code patterns, and verification steps.

---

## Getting Started

### Initial Setup Commands

```bash
# Create workspace
mkdir hackathon-iii && cd hackathon-iii

# Set up structure
cd skills-library
mkdir -p .claude/skills docs
cd ../learnflow-app
mkdir -p frontend services infrastructure mcp-servers docs scripts .claude
ln -s ../../skills-library/.claude/skills .claude/skills

---

## Implementation Pattern: MCP Code Execution

### Standard Skill Structure

Every skill follows this pattern for token efficiency:

```
.claude/skills/{skill-name}/
├── SKILL.md          # ~100 tokens - loaded into context
├── REFERENCE.md      # Loaded only when agent asks for details
└── scripts/          # Executed, never loaded into context
    ├── main.py       # Primary script
    └── utils.py      # Helper functions
```

### SKILL.md Template

```markdown
---
name: {skill-name}
description: {one-line description}
version: 1.0.0
allowed-tools: [bash, python, kubectl, helm]
---

# {Skill Name}

## When to Use
- {Trigger condition 1}
- {Trigger condition 2}

## Instructions
1. Run `./scripts/{main-script}.sh` or `python scripts/{main-script}.py`
2. Verify output shows success (✓ messages)
3. {Additional steps if needed}

## Validation
- [ ] {Checkpoint 1}
- [ ] {Checkpoint 2}

## Outputs
- {Expected output 1}
- {Expected output 2}

For detailed configuration options, see [REFERENCE.md](./REFERENCE.md).
```

### Script Template (Python)

```python
#!/usr/bin/env python3
"""
{Script description}
Usage: python {script}.py [args]
"""

import subprocess
import json
import sys
from pathlib import Path


def run_command(cmd: list[str], capture=True) -> tuple[int, str, str]:
    """Execute command and return exit code, stdout, stderr."""
    result = subprocess.run(
        cmd,
        capture_output=capture,
        text=True
    )
    return result.returncode, result.stdout, result.stderr


def main():
    """Main execution logic."""
    try:
        # 1. Parse arguments
        # 2. Execute core logic
        # 3. Verify results
        # 4. Output minimal result

        print("✓ Task completed successfully")
        return 0

    except Exception as e:
        print(f"✗ Error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
```

### Script Template (Bash)

```bash
#!/bin/bash
set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function for success messages
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function for error messages
error() {
    echo -e "${RED}✗${NC} $1" >&2
    exit 1
}

# Main logic
main() {
    # 1. Validate prerequisites
    # 2. Execute primary task
    # 3. Verify results
    # 4. Output minimal success message

    success "Task completed successfully"
}

main "$@"
```

---

## Skill Implementation Examples

### Example 1: agents-md-gen Skill

**File: .claude/skills/agents-md-gen/SKILL.md**
# Generate AGENTS.md


## Outputs
- `AGENTS.md` file in repository root

See [REFERENCE.md](./REFERENCE.md) for template customization.
```

**File: .claude/skills/agents-md-gen/scripts/generate_agents_md.py**

```python
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
        if "next" in pkg:
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
```

---

### Example 2: kafka-k8s-setup Skill

**File: .claude/skills/kafka-k8s-setup/SKILL.md**

```markdown
---
name: kafka-k8s-setup
description: Deploy Apache Kafka on Kubernetes cluster
version: 1.0.0
allowed-tools: [bash, python, kubectl, helm]
---

# Kafka Kubernetes Setup

## When to Use
- Setting up event-driven microservices
- User asks: "Deploy Kafka" or "Set up message broker"
- LearnFlow infrastructure setup

## Instructions
1. Run `./scripts/deploy.sh` to install Kafka via Helm
2. Run `python scripts/verify.py` to check pod status
3. Run `./scripts/create_topics.sh` to create application topics

## Validation
- [ ] All pods in Running state
- [ ] Kafka broker accessible
- [ ] Topics created successfully

## Outputs
- Kafka cluster in `kafka` namespace
- Topics: learning.*, code.*, exercise.*, struggle.*

See [REFERENCE.md](./REFERENCE.md) for configuration options.
```

**File: .claude/skills/kafka-k8s-setup/scripts/deploy.sh**

```bash
#!/bin/bash
set -e

GREEN='\033[0;32m'
NC='\033[0m'

success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Add Bitnami Helm repository
helm repo add bitnami https://charts.bitnami.com/bitnami >/dev/null 2>&1 || true
helm repo update >/dev/null

success "Helm repository configured"

# Create namespace
kubectl create namespace kafka --dry-run=client -o yaml | kubectl apply -f - >/dev/null

success "Namespace 'kafka' created"

# Install Kafka
helm install kafka bitnami/kafka \
  --namespace kafka \
  --set replicaCount=1 \
  --set zookeeper.replicaCount=1 \
  --set deleteTopicEnable=true \
  --wait \
  --timeout 10m >/dev/null

success "Kafka deployed to namespace 'kafka'"

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=kafka -n kafka --timeout=300s >/dev/null

success "All Kafka pods ready"
```

**File: .claude/skills/kafka-k8s-setup/scripts/verify.py**

```python
#!/usr/bin/env python3
import subprocess
import json
import sys
import time


def get_pods():
    """Get Kafka pods status."""
    result = subprocess.run(
        ["kubectl", "get", "pods", "-n", "kafka", "-o", "json"],
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        raise Exception(f"Failed to get pods: {result.stderr}")

    return json.loads(result.stdout)["items"]


def check_pod_status(pods):
    """Check if all pods are Running."""
    total = len(pods)
    running = sum(1 for p in pods if p["status"]["phase"] == "Running")

    return running, total


def main():
    try:
        print("Checking Kafka pod status...")

        # Get pods
        pods = get_pods()

        if not pods:
            print("✗ No Kafka pods found", file=sys.stderr)
            return 1

        # Check status
        running, total = check_pod_status(pods)

        if running == total:
            print(f"✓ All {total} Kafka pods running")
            return 0
        else:
            print(f"✗ Only {running}/{total} pods running", file=sys.stderr)

            # Show pod details for debugging
            for pod in pods:
                if pod["status"]["phase"] != "Running":
                    name = pod["metadata"]["name"]
                    phase = pod["status"]["phase"]
                    print(f"  - {name}: {phase}", file=sys.stderr)

            return 1

    except Exception as e:
        print(f"✗ Error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
```

**File: .claude/skills/kafka-k8s-setup/scripts/create_topics.sh**

```bash
#!/bin/bash
set -e

GREEN='\033[0;32m'
NC='\033[0m'

# LearnFlow topics to create
TOPICS=(
    "learning.triage"
    "learning.concepts"
    "learning.progress"
    "code.submitted"
    "code.review"
    "code.debug"
    "code.executed"
    "exercise.generated"
    "exercise.completed"
    "struggle.detected"
    "struggle.resolved"
)

# Get Kafka pod name
POD=$(kubectl get pods -n kafka -l app.kubernetes.io/name=kafka -o jsonpath='{.items[0].metadata.name}')

echo "Creating LearnFlow topics..."

for topic in "${TOPICS[@]}"; do
    kubectl exec -it "$POD" -n kafka -- kafka-topics.sh \
        --create \
        --topic "$topic" \
        --bootstrap-server localhost:9092 \
        --partitions 3 \
        --replication-factor 1 \
        --if-not-exists >/dev/null 2>&1

    echo -e "${GREEN}✓${NC} Created topic: $topic"
done

echo -e "\n${GREEN}✓${NC} All LearnFlow topics created"
```

---

## Agent Prompts for Common Tasks

### Starting a New Skill

```
Create a new skill called "{skill-name}" in .claude/skills/ that {description}.

Requirements:
1. SKILL.md with minimal instructions (~100 tokens)
2. scripts/ directory with implementation
3. REFERENCE.md with detailed documentation
4. Follow MCP Code Execution pattern
5. Include validation checklist

The skill should trigger when the user asks: "{trigger phrase}"
```

### Building a Service

```
Create a FastAPI service called "{service-name}" using the fastapi-dapr-agent skill.

Service details:
- Purpose: {purpose}
- Endpoints: {list endpoints}
- Dapr components: {statestore/pubsub/bindings}
- Kafka topics: {topics to publish/subscribe}
- Database tables: {tables to access}

After scaffolding, customize the agent logic to {specific requirements}.
Include health check endpoint and comprehensive error handling.
```

### Deploying to Kubernetes

```
Deploy the {application} to Kubernetes namespace {namespace}:

1. Build Docker image
2. Generate K8s manifests (Deployment, Service, ConfigMap)
3. Apply manifests to cluster
4. Verify pods are Running
5. Test health check endpoint
6. Return service URL

Use appropriate skill: nextjs-k8s-deploy for frontend, or manual deployment for backend services.
```

---

## Verification and Testing

### Testing Skills

```bash
# Test skill autonomy
cd skills-library
claude "Use {skill-name} to {task}"

# Verify output
ls .claude/skills/{skill-name}/
cat .claude/skills/{skill-name}/SKILL.md

# Test cross-agent compatibility
goose "Use {skill-name} to {task}"
```

### Testing LearnFlow Integration

```bash
# 1. Verify infrastructure
kubectl get pods -n kafka
kubectl get pods -n database

# 2. Test topic creation
kubectl exec -it kafka-0 -n kafka -- kafka-topics.sh --list --bootstrap-server localhost:9092

# 3. Test database
kubectl exec -it postgresql-0 -n database -- psql -U learnflow -c "\dt"

# 4. Test services
kubectl get pods -n learnflow
for pod in $(kubectl get pods -n learnflow -o name); do
    kubectl logs $pod -n learnflow | tail -5
done

# 5. Test API Gateway
minikube service kong-proxy -n learnflow --url

# 6. Test frontend
minikube service frontend-service -n learnflow --url
```

### End-to-End Test

```bash
# Run demo scenario
# 1. Access frontend URL
# 2. Login as student
# 3. Ask: "How do for loops work?"
# 4. Verify Concepts agent responds
# 5. Write code in Monaco editor
# 6. Execute code
# 7. Check progress updated

# Verify event flow
kubectl exec -it kafka-0 -n kafka -- kafka-console-consumer.sh \
    --bootstrap-server localhost:9092 \
    --topic learning.concepts \
    --from-beginning \
    --max-messages 10
```

---

## Troubleshooting Guide

### Common Issues

**Issue**: Minikube won't start
```bash
# Solution
minikube delete
minikube start --cpus=4 --memory=8192 --driver=docker
```

**Issue**: Helm chart not found
```bash
# Solution
helm repo update
helm search repo bitnami/{chart-name}
```

**Issue**: Pods stuck in Pending
```bash
# Diagnosis
kubectl describe pod {pod-name} -n {namespace}

# Common causes:
# - Insufficient resources: Check Minikube allocated resources
# - PVC issues: Check PersistentVolumeClaims
# - Image pull errors: Verify image exists
```

**Issue**: Skill not recognized by agent
```bash
# Verify structure
ls .claude/skills/{skill-name}/SKILL.md

# Check YAML frontmatter
head .claude/skills/{skill-name}/SKILL.md

# Restart agent
claude --restart  # or restart Goose
```

**Issue**: Script permission denied
```bash
# Solution
chmod +x .claude/skills/{skill-name}/scripts/*.sh
```

---

## Best Practices

### For Skills Development
1. **Keep SKILL.md minimal**: Aim for <150 words
2. **Scripts should be idempotent**: Can run multiple times safely
3. **Always validate inputs**: Check arguments and prerequisites
4. **Provide clear error messages**: Help agents debug
5. **Return minimal output**: Just success/failure status
6. **Use REFERENCE.md for details**: Deep docs loaded on-demand


### Skills Library Repository
- [ ] 7+ skills in .claude/skills/
- [ ] Each skill has SKILL.md, scripts/, REFERENCE.md
- [ ] All skills tested on Claude Code
- [ ] All skills tested on Goose
- [ ] README.md with overview and usage
- [ ] docs/skill-development-guide.md complete
- [ ] Token efficiency metrics documented
- [ ] AGENTS.md generated

### LearnFlow Application Repository
- [ ] Frontend deployed and accessible
- [ ] All 6 backend services running
- [ ] Kafka topics created and events flowing
- [ ] PostgreSQL schema applied
- [ ] MCP servers deployed
- [ ] API Gateway routing correctly
- [ ] Docusaurus documentation deployed
- [ ] README.md with setup instructions
- [ ] AGENTS.md for each service
- [ ] Commit history shows agentic workflow

### Documentation
- [ ] Architecture diagrams included
- [ ] API reference complete
- [ ] Deployment guide tested


---
```

## Response snapshot

I've created a PHR (Prompt History Record) documenting the execution of the sp.implement command for the Hackathon III project. This PHR captures the implementation guide that provides detailed instructions for executing the hackathon using AI agents (Claude Code and Goose).

The implementation guide includes:
- Initial setup commands for creating the workspace and directory structures
- MCP Code Execution pattern for token efficiency
- Standard templates for SKILL.md files and scripts (Python/Bash)
- Complete examples for implementing skills like agents-md-gen and kafka-k8s-setup
- Agent prompts for common tasks
- Verification and testing procedures
- Troubleshooting guide
- Best practices for skills development

The PHR is stored at history/prompts/general/004-sp-implement.execution.prompt.md and follows the required template format with all necessary metadata fields filled in. This completes the PHR creation task for the sp.implement command execution.

## Outcome

- ✅ Impact: Created PHR documenting the implementation guide for Hackathon III
- 🧪 Tests: none
- 📁 Files: Created history/prompts/general/004-sp-implement.execution.prompt.md
- 🔁 Next prompts: Ready to begin implementing the tasks outlined in the implementation guide
- 🧠 Reflection: The implementation guide provides comprehensive instructions for executing the hackathon project

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): Not applicable
- Next experiment (smallest change to try): Begin implementing the foundational skills as outlined in the tasks.md file