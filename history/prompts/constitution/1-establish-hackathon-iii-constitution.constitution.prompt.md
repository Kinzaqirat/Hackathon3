---
id: 1
title: Establish Hackathon III Constitution
stage: constitution
date: 2026-01-20
surface: agent
model: gemini
feature: none
branch: 001-json
user:
command: /sp.constitution
labels: [constitution, hackathon]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - 
---

## Prompt

/sp.constitution # sp.constitution.md
# Hackathon III: Reusable Intelligence and Cloud-Native Mastery

## Project Vision
Build an AI-powered learning platform (LearnFlow) using agentic development principles where Skills are the product. AI coding agents (Claude Code and Goose) will autonomously build the application by executing Skills with MCP Code Execution patterns.

## Core Principles

### 1. Skills-First Development
- **Skills are the primary deliverable**, not the application code
- Skills must work autonomously with both Claude Code and Goose
- Skills use MCP Code Execution pattern (scripts execute, not MCP tools in context)
- Token efficiency: SKILL.md (~100 tokens), scripts (0 tokens in context)

### 2. Agentic Autonomy
- AI agents build the application from single prompts
- Manual coding is failure; refine Skills until agents succeed
- Gold standard: prompt → agent loads skill → script executes → task complete
- Document all skill refinements in development process

### 3. Technology Stack Alignment
- **AI Agents**: Claude Code, Goose (with Claude Code Router for flexibility)
- **Frontend**: Next.js + Monaco Editor
- **Backend**: FastAPI + OpenAI Agents SDK
- **Service Mesh**: Dapr (state, pub/sub, invocation)
- **Messaging**: Kafka on Kubernetes
- **Database**: Neon PostgreSQL
- **Orchestration**: Kubernetes (Minikube locally)
- **API Gateway**: Kong on Kubernetes
- **CI/CD**: Argo CD + GitHub Actions
- **Documentation**: Docusaurus

### 4. Architecture Patterns
- **Microservices**: Event-driven, stateless, Dapr-enabled
- **Pub/Sub**: Kafka topics for async communication
- **AI Agents**: Specialized agents per domain (Triage, Concepts, Debug, etc.)
- **MCP Servers**: Provide real-time context, wrapped in Skills for efficiency
- **GitOps**: Argo CD watches repo, auto-deploys on commit

### 5. Quality Standards
- **Cross-compatibility**: Skills work on Claude Code AND Goose
- **Token efficiency**: 80-98% reduction vs direct MCP
- **Autonomy**: Single prompt deployments
- **Documentation**: Auto-generated via Docusaurus
- **Testing**: Agent-driven validation scripts

## Success Metrics

### Skills Library
- Minimum 7 Skills (agents-md-gen, kafka-k8s-setup, postgres-k8s-setup, fastapi-dapr-agent, mcp-code-execution, nextjs-k8s-deploy, docusaurus-deploy)
- Each skill includes: SKILL.md, scripts/, optional REFERENCE.md
- Skills demonstrate MCP Code Execution pattern
- Skills tested on both Claude Code and Goose

### LearnFlow Application
- Built entirely using Skills (commit history proves agentic workflow)
- All 6 AI agents implemented (Triage, Concepts, CodeReview, Debug, Exercise, Progress)
- Kafka topics: learning.*, code.*, exercise.*, struggle.*
- PostgreSQL schema with migrations
- Next.js frontend with Monaco editor
- Docusaurus documentation site
- Deployed on Kubernetes (Minikube or cloud)

### Evaluation Targets
- Skills Autonomy: 15% - Zero manual intervention
- Token Efficiency: 10% - Scripts execute, minimal context
- Cross-Agent Compatibility: 5% - Works on both agents
- Architecture: 20% - Correct Dapr, Kafka, microservice patterns
- MCP Integration: 10% - Rich context via MCP servers
- Documentation: 10% - Comprehensive Docusaurus site
- Spec-Kit Plus: 15% - High-level specs → agentic instructions
- LearnFlow Completion: 15% - Fully functional application

## Constraints

### Technical Constraints
- All development via AI agents (Claude Code, Goose)
- No direct MCP server connections (use Skills + Code Execution)
- Minikube minimum: 4 CPUs, 8GB RAM
- Code execution sandbox: 5s timeout, 50MB memory, no network
- Standard library only for Python (MVP scope)

### Process Constraints
- Windows users: WSL for all development
- Commit messages reflect agentic workflow
- Skills library and LearnFlow app in separate repositories
- AAIF standards compliance required


## Mandatory Deliverables
1. **skills-library** repository with 7+ Skills
2. **learnflow-app** repository built via Skills
3. Submission via form: https://forms.gle/Mrhf9XZsuXN4rWJf7
4. Working Kubernetes deployment
5. Docusaurus documentation site

## Response snapshot

Constitution updated to version 1.0.0, establishing the "Hackathon III" project-specific guidelines. The previous generic template was replaced entirely. No dependent templates were modified.

## Outcome

- ✅ Impact: Major. Established a new, detailed project constitution.
- 🧪 Tests: N/A
- 📁 Files: 1 modified (.specify/memory/constitution.md), 1 created (history/prompts/constitution/1-establish-hackathon-iii-constitution.constitution.prompt.md)
- 🔁 Next prompts: Follow-up tasks based on the new constitution.
- 🧠 Reflection: The script-based PHR creation failed, requiring a fallback to the manual agent-native file writing process. The process was successful.

## Evaluation notes (flywheel)

- Failure modes observed: The provided PowerShell script for PHR creation (`create-new-feature.ps1`) failed with a parameter binding exception.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Debug the `create-new-feature.ps1` script to understand the parameter issue.
