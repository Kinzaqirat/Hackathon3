---
id: 001
title: sp-plan execution for hackathon
stage: plan
date: 2026-01-21
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-hackathon-spec
user: pc
command: /sp.plan
labels: [hackathon, planning, roadmap]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - sp.plan.md
 - history/prompts/general/001-sp-plan.general.prompt.md
tests:
 - none
---

## Prompt

```text
# sp.plan.md
# Development Roadmap - Hackathon III

## Overview
This plan follows a phased approach where each phase builds on the previous. Skills are developed first, then used to build LearnFlow. The plan is optimized for agentic execution by Claude Code and Goose.

---

## Phase 0: Environment Preparation (Day 1, 2-3 hours)

### Objectives
- Set up development environment
- Install all prerequisites
- Create repository structure
- Verify tooling

### Tasks
1. **Install Prerequisites**
   - Docker Desktop
   - Minikube with 4 CPUs, 8GB RAM
   - Helm package manager
   - Claude Code CLI
   - Goose CLI
   - kubectl CLI

2. **Initialize Repositories**
   ```bash
   # Create skills library
   mkdir skills-library && cd skills-library
   git init
   mkdir -p .claude/skills docs

   # Create LearnFlow app
   cd ..
   mkdir learnflow-app && cd learnflow-app
   git init
   mkdir -p frontend services infrastructure mcp-servers docs scripts
   ln -s ../skills-library/.claude/skills .claude/skills
   ```

3. **Start Kubernetes Cluster**
   ```bash
   minikube start --cpus=4 --memory=8192 --driver=docker
   kubectl cluster-info
   ```

4. **Verification Script**
   - Run comprehensive environment check
   - Verify: Docker, Minikube, Helm, Claude Code, Goose
   - Confirm: kubectl access, Helm repositories added

### Deliverables
- ✅ All tools installed and verified
- ✅ Repositories initialized with structure
- ✅ Minikube running and accessible
- ✅ Verification script passes all checks

### Success Criteria
- `kubectl get nodes` shows Ready node
- `claude --version` returns version number
- `goose --version` returns version number
- Both repos have initial commits

---

## Phase 1: Foundation Skills (Day 1-2, 6-8 hours)

### Objectives
- Build core Skills that enable all other development
- Establish MCP Code Execution pattern
- Test cross-agent compatibility

### Tasks

#### Task 1.1: agents-md-gen Skill
**Priority**: CRITICAL (needed for all subsequent work)

**Steps**:
1. Create `.claude/skills/agents-md-gen/` directory
2. Write `SKILL.md`:
   - Purpose: Generate AGENTS.md for any repository
   - Trigger: "Generate AGENTS.md" or "Create repository guide"
   - Instructions: Run scripts/generate_agents_md.py
3. Write `scripts/generate_agents_md.py`:
   - Analyze repository structure (directories, files)
   - Detect project type (FastAPI, Next.js, Skills library)
   - Generate templated AGENTS.md with conventions
4. Write `REFERENCE.md` with AGENTS.md templates
5. Test with Claude Code: `claude "Generate AGENTS.md for this repository"`
6. Test with Goose: `goose "Create repository guide"`

**Validation**:
- Agent generates valid AGENTS.md without errors
- File includes project structure, conventions, standards
- Works identically on Claude Code and Goose

#### Task 1.2: mcp-code-execution Skill
**Priority**: CRITICAL (establishes pattern for all skills)

**Steps**:
1. Create `.claude/skills/mcp-code-execution/` directory
2. Write `SKILL.md`:
   - Purpose: Demonstrate MCP Code Execution pattern
   - Pattern: Minimal SKILL.md, heavy scripts/, token optimization
3. Write `scripts/mcp_client.py`:
   - Generic MCP client wrapper
   - Example: Fetch data, process locally, return minimal result
4. Write `scripts/example_usage.py`:
   - Before/After token comparison
   - Direct MCP vs Code Execution pattern
5. Write `REFERENCE.md` with best practices

**Validation**:
- Token usage reduced by 80%+ vs direct MCP
- Clear documentation of pattern
- Reusable client wrapper for other skills

#### Task 1.3: k8s-foundation Skill (Bonus)
**Priority**: MEDIUM (helpful but not required)

**Steps**:
1. Create `.claude/skills/k8s-foundation/` directory
2. Write `SKILL.md` for basic K8s operations
3. Scripts: cluster health, namespace creation, basic troubleshooting

### Deliverables
- ✅ `agents-md-gen` skill complete and tested
- ✅ `mcp-code-execution` skill complete with examples
- ✅ Both skills work on Claude Code and Goose
- ✅ Token efficiency demonstrated and documented

### Success Criteria
- Agent generates AGENTS.md from single prompt
- MCP pattern clearly documented with metrics
- Commit history shows agentic development

---

## Phase 2: Infrastructure Skills (Day 2-3, 8-10 hours)

### Objectives
- Build Skills for deploying Kafka and PostgreSQL
- Enable stateful infrastructure automation
- Validate deployment health programmatically

### Tasks

#### Task 2.1: kafka-k8s-setup Skill
**Steps**:
1. Create `.claude/skills/kafka-k8s-setup/` directory
2. Write `SKILL.md`:
   - Trigger: "Deploy Kafka" or "Set up event streaming"
   - Instructions: Run deploy.sh, then verify.py
3. Write `scripts/deploy.sh`:
   ```bash
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm repo update
   kubectl create namespace kafka --dry-run=client -o yaml | kubectl apply -f -
   helm install kafka bitnami/kafka \
     --namespace kafka \
     --set replicaCount=1 \
     --set zookeeper.replicaCount=1
   echo "✓ Kafka deployed"
   ```
4. Write `scripts/verify.py`:
   - Check pod status via kubectl
   - Verify all pods Running
   - Create test topic
   - Return minimal status message
5. Write `scripts/create_topics.sh`:
   - Create LearnFlow topics: learning.*, code.*, exercise.*, struggle.*
6. Write `REFERENCE.md` with Kafka configuration options

**Validation**:
- Claude Code: `claude "Deploy Kafka to Kubernetes"`
- Goose: `goose "Set up Kafka cluster"`
- Verify: All pods Running, topics created

#### Task 2.2: postgres-k8s-setup Skill
**Steps**:
1. Create `.claude/skills/postgres-k8s-setup/` directory
2. Write `SKILL.md`:
   - Trigger: "Deploy PostgreSQL" or "Set up database"
   - Instructions: Run deploy.sh, migrate.py, verify.py
3. Write `scripts/deploy.sh`:
   - Install PostgreSQL via Helm Bitnami chart
   - Create secrets for credentials
   - Wait for pods to be Ready
4. Write `scripts/migrate.py`:
   - Connect to PostgreSQL
   - Apply schema.sql if provided
   - Run migration files from migrations/ directory
5. Write `scripts/verify.py`:
   - Test database connection
   - Verify tables created
   - Return connection string
6. Write `REFERENCE.md` with PostgreSQL configuration

**Validation**:
- Agent deploys PostgreSQL successfully
- Can connect and run queries
- Migration system works

### Deliverables
- ✅ `kafka-k8s-setup` skill complete
- ✅ `postgres-k8s-setup` skill complete
- ✅ Both deployed on Minikube
- ✅ Verification scripts pass

### Success Criteria
- `kubectl get pods -n kafka` shows all Running
- `kubectl get pods -n database` shows all Running
- Topics created in Kafka
- PostgreSQL accepts connections

---

## Phase 3: Service Development Skills (Day 3-4, 10-12 hours)

### Objectives
- Build Skills for creating FastAPI + Dapr microservices
- Enable AI agent scaffolding
- Standardize service patterns

### Tasks

#### Task 3.1: fastapi-dapr-agent Skill
**Steps**:
1. Create `.claude/skills/fastapi-dapr-agent/` directory
2. Write `SKILL.md`:
   - Trigger: "Create [AgentName] agent service"
   - Parameters: service_name, agent_type, dapr_components
   - Instructions: Run scaffold.py, then dapr_config.py
3. Write `scripts/scaffold.py`:
   - Generate FastAPI project structure
   - Create main.py with health check, agent endpoint
   - Add OpenAI Agents SDK integration
   - Create requirements.txt
   - Generate Dockerfile
4. Write `scripts/dapr_config.py`:
   - Generate Dapr component YAML (statestore, pubsub)
   - Create Dapr configuration for sidecar
5. Write `templates/` directory:
   - `main.py.template`: FastAPI app template
   - `agent.py.template`: OpenAI Agent template
   - `Dockerfile.template`: Multi-stage Docker build
   - `k8s-deployment.yaml.template`: K8s manifests
6. Write `REFERENCE.md` with Dapr patterns

**Validation**:
- Agent creates complete service from prompt
- Service structure matches LearnFlow requirements
- Dapr configuration valid

#### Task 3.2: Apply Skill to Create All 6 Agents
**Priority**: HIGH

Use `fastapi-dapr-agent` skill to create:
1. Triage Agent (`services/triage-agent/`)
2. Concepts Agent (`services/concepts-agent/`)
3. Code Review Agent (`services/code-review-agent/`)
4. Debug Agent (`services/debug-agent/`)
5. Exercise Agent (`services/exercise-agent/`)
6. Progress Agent (`services/progress-agent/`)

For each service:
- Generate with skill
- Customize agent logic (OpenAI prompts, tools)
- Connect to Kafka via Dapr pubsub
- Connect to PostgreSQL via Dapr statestore
- Add health checks

### Deliverables
- ✅ `fastapi-dapr-agent` skill complete
- ✅ All 6 LearnFlow agents scaffolded
- ✅ Agents have Dapr configuration
- ✅ Dockerfiles and K8s manifests generated

### Success Criteria
- Each service has FastAPI app, agent logic, Dapr config
- Services can be containerized
- Ready for Kubernetes deployment

---

## Phase 4: Frontend & Deployment Skills (Day 4-5, 8-10 hours)

### Objectives
- Build Skills for Next.js deployment
- Enable documentation generation
- Complete the Skills library

### Tasks

#### Task 4.1: nextjs-k8s-deploy Skill
**Steps**:
1. Create `.claude/skills/nextjs-k8s-deploy/` directory
2. Write `SKILL.md`:
   - Trigger: "Deploy Next.js app" or "Deploy frontend"
   - Instructions: Run build_docker.sh, k8s_manifest.py, deploy.sh
3. Write `scripts/build_docker.sh`:
   - Generate optimized Dockerfile (multi-stage)
   - Build Docker image
   - Load to Minikube or push to registry
4. Write `scripts/k8s_manifest.py`:
   - Generate Deployment YAML
   - Generate Service YAML (LoadBalancer or NodePort)
   - Generate Ingress YAML (optional)
5. Write `scripts/deploy.sh`:
   - Apply K8s manifests
   - Wait for pods Ready
   - Return service URL
6. Write `REFERENCE.md` with Next.js optimization tips

**Validation**:
- Agent builds and deploys Next.js app
- App accessible via service URL
- Deployment successful

#### Task 4.2: docusaurus-deploy Skill
**Steps**:
1. Create `.claude/skills/docusaurus-deploy/` directory
2. Write `SKILL.md`:
   - Trigger: "Generate documentation" or "Deploy docs site"
   - Instructions: Run init_docusaurus.sh, generate_docs.py, deploy.sh
3. Write `scripts/init_docusaurus.sh`:
   - Scaffold Docusaurus project if not exists
   - Configure docusaurus.config.js
4. Write `scripts/generate_docs.py`:
   - Parse README files from project
   - Extract docstrings from Python/TypeScript
   - Generate markdown files for docs/
   - Create sidebar configuration
5. Write `scripts/deploy.sh`:
   - Build static site
   - Deploy to K8s or static hosting
6. Write `REFERENCE.md` with Docusaurus customization

**Validation**:
- Documentation site generated from code
- Site deployed and accessible
- Navigation and search working

### Deliverables
- ✅ `nextjs-k8s-deploy` skill complete
- ✅ `docusaurus-deploy` skill complete
- ✅ Skills library has 7+ skills
- ✅ All skills tested on both agents

### Success Criteria
- Skills library repository complete
- All skills work autonomously
- Documentation generated for skills

---

## Phase 5: LearnFlow Integration (Day 5-6, 12-15 hours)

### Objectives
- Use Skills to build complete LearnFlow application
- Integrate all components
- Deploy full stack to Kubernetes

### Tasks

#### Task 5.1: Frontend Development
**Prompt for Agent**:
```
Using nextjs-k8s-deploy skill, create the LearnFlow frontend:
- Student dashboard with progress visualization
- Teacher dashboard with analytics
- Chat interface for AI tutors
- Monaco code editor integration
- Quiz interface
- Better Auth authentication
- API client for backend services
```

**Agent Actions**:
1. Scaffold Next.js project with App Router
2. Install dependencies (Monaco, Better Auth, etc.)
3. Create components (Dashboard, Chat, CodeEditor, Quiz)
4. Set up API routes and client
5. Configure TailwindCSS
6. Build and deploy using nextjs-k8s-deploy skill

#### Task 5.2: Backend Services Deployment
**Prompt for Agent**:
```
Deploy all 6 LearnFlow AI agents to Kubernetes:
1. Use postgres-k8s-setup to deploy database
2. Apply schema from infrastructure/postgres/schema.sql
3. Use kafka-k8s-setup to deploy Kafka
4. Create topics: learning.*, code.*, exercise.*, struggle.*
5. For each agent service, containerize and deploy to K8s
6. Configure Dapr components for state and pubsub
```

**Agent Actions**:
1. Deploy PostgreSQL and apply migrations
2. Deploy Kafka and create topics
3. Build Docker images for all 6 services
4. Apply K8s manifests with Dapr annotations
5. Verify all services running and healthy

#### Task 5.3: API Gateway Setup
**Manual Task** (or create kong-setup skill):
1. Install Kong via Helm
2. Configure routes to backend services
3. Set up JWT authentication
4. Configure rate limiting

#### Task 5.4: MCP Servers
**Prompt for Agent**:
```
Create two MCP servers:
1. learning-context: Provides student progress to AI agents
2. code-execution: Sandboxed Python code runner

Deploy both as K8s services.
```

#### Task 5.5: Integration Testing
**Prompt for Agent**:
```
Test the complete LearnFlow flow:
1. Student Maya logs in
2. Asks: "How do for loops work?"
3. Concepts agent responds
4. Maya writes code in Monaco editor
5. Code executes via code-execution MCP server
6. Progress agent updates mastery score
7. Teacher sees student progress
```

### Deliverables
- ✅ Frontend deployed and accessible
- ✅ All 6 backend services running
- ✅ Kafka topics receiving events
- ✅ PostgreSQL storing data
- ✅ MCP servers providing context
- ✅ API Gateway routing traffic
- ✅ End-to-end flow working

### Success Criteria
- Demo scenario completes successfully
- All components integrated
- Commit history shows agentic workflow
- `kubectl get pods -n learnflow` shows all Running

---

### Tasks

#### Task 6.1: Documentation Generation
**Prompt for Agent**:
```
Using docusaurus-deploy skill, generate documentation for:
- Skills library (each skill with usage examples)
- LearnFlow application (architecture, API reference, deployment guide)
- Development process (how skills were used)
Deploy to Kubernetes as docs.learnflow.local
```

#### Task 6.2: README Files
**Prompt for Agent**:
```
Using agents-md-gen skill, create comprehensive READMEs:
- skills-library/README.md: Overview, skill list, usage guide
- learnflow-app/README.md: Application overview, setup, deployment
Both should include badges, screenshots, architecture diagrams
```


### Success Criteria
- Documentation covers all components

---

## Phase 7: Cloud Deployment (Optional, Day 7-8)

### Objectives
- Deploy to production cloud (Azure/Google/Oracle)
- Set up managed services
- Configure Argo CD for GitOps


---

## Phase 8: Continuous Improvement (Ongoing)

### Objectives
- Refine skills based on usage
- Add new skills as patterns emerge
- Improve token efficiency

### Potential New Skills to Develop
1. **prometheus-grafana-setup**: Monitoring stack deployment
2. **argocd-app-deployment**: GitOps application configuration
3. **kafka-stream-processor**: Kafka Streams applications
4. **pg-data-backup-restore**: Database backup automation
5. **nextjs-perf-optimize**: Performance optimization patterns
6. **agent-testing-framework**: Automated agent testing

### Continuous Tasks
- Monitor skill usage patterns
- Measure token efficiency improvements
- Document lessons learned
- Contribute skills to community

---

## Risk Management

### Technical Risks
| Risk | Mitigation |
|------|------------|
| Minikube resource constraints | Monitor with `kubectl top`, scale down replicas |
| Skill execution failures | Add robust error handling, validation scripts |
| Agent generates incorrect code | Iterative refinement, add examples to SKILL.md |
| Token limit exceeded | Optimize SKILL.md, use REFERENCE.md for details |
| Cross-agent incompatibility | Test on both Claude Code and Goose early |

### Process Risks
| Risk | Mitigation |
|------|------------|
| Manual coding temptation | Commit to agentic workflow, document all prompts |
| Scope creep | Follow phases strictly, MVP first |
| Time constraints | Prioritize critical skills, skip optional features |
| Documentation lag | Generate docs as you build, not at end |

---

## Daily Milestones

**Day 1**: Environment + Foundation Skills (agents-md-gen, mcp-code-execution)
**Day 2**: Infrastructure Skills (kafka-k8s-setup, postgres-k8s-setup)
**Day 3**: Service Skills (fastapi-dapr-agent, scaffold all 6 agents)
**Day 4**: Deployment Skills (nextjs-k8s-deploy, docusaurus-deploy)
**Day 5**: LearnFlow Integration (frontend + backend deployed)
**Day 6**: Documentation & Polish (docs site, READMEs, demo)


---

## Success Metrics Tracking

Track these throughout development:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Skills created | 7+ | Count in .claude/skills/ |
| Token efficiency | 80-98% reduction | Compare direct MCP vs scripts |
| Autonomy | Single prompt deployment | Test each skill standalone |
| Cross-compatibility | Works on both agents | Test on Claude Code + Goose |
| LearnFlow completion | All features working | Run demo scenario |
| Documentation coverage | 100% of components | Check Docusaurus pages |
| Deployment success | All pods Running | `kubectl get pods` |

---

## Final Checklist Before Submission

- [ ] skills-library repository complete with 7+ skills
- [ ] learnflow-app repository built via skills
- [ ] All skills tested on Claude Code AND Goose
- [ ] Token efficiency demonstrated (80%+ reduction)

- [ ] LearnFlow deployed to Kubernetes
- [ ] All 6 AI agents functional
- [ ] Kafka events flowing correctly
- [ ] PostgreSQL schema applied
- [ ] Frontend accessible with Monaco editor
- [ ] Docusaurus documentation deployed
```

## Response snapshot

I've created a PHR (Prompt History Record) to document the execution of the sp.plan command for the hackathon project. This PHR captures the complete development roadmap for Hackathon III, which focuses on building a Skills library to enable agentic development of the LearnFlow educational platform.

The plan outlines 8 phases:
1. Environment Preparation - Setting up tools and repositories
2. Foundation Skills - Building core skills like agents-md-gen and mcp-code-execution
3. Infrastructure Skills - Creating skills for Kafka and PostgreSQL deployment
4. Service Development Skills - Building FastAPI + Dapr microservice scaffolding
5. Frontend & Deployment Skills - Next.js and documentation deployment skills
6. LearnFlow Integration - Complete system integration and deployment
7. Cloud Deployment - Production deployment (optional)
8. Continuous Improvement - Ongoing refinement

The PHR is stored at history/prompts/general/001-sp-plan.general.prompt.md and follows the required template format with all necessary metadata fields filled in. This completes the PHR creation task for the sp.plan command execution.

## Outcome

- ✅ Impact: Created PHR documenting the complete hackathon roadmap
- 🧪 Tests: none
- 📁 Files: Created history/prompts/general/001-sp-plan.general.prompt.md
- 🔁 Next prompts: Ready to begin implementing the phases outlined in the plan
- 🧠 Reflection: The plan provides a comprehensive roadmap for building a skills-based development approach

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): Not applicable
- Next experiment (smallest change to try): Begin implementation of Phase 0 - Environment Preparation