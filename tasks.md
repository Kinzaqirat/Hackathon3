# tasks.md
# Actionable Task Breakdown - Hackathon III

This document provides granular, actionable tasks for AI agents (Claude Code and Goose) to execute. Each task is designed to be completed autonomously with minimal human intervention.

---

## Phase 1: Setup Tasks

### Repository Initialization

- [ ] T001 Create two repositories with the correct structure following the implementation plan
- [ ] T002 Initialize git repositories for both skills-library and learnflow-app
- [ ] T003 Create directory structure for skills-library with .claude/skills/ and docs/
- [ ] T004 Create directory structure for learnflow-app with frontend/, services/, infrastructure/, mcp-servers/, docs/, scripts/
- [ ] T005 Create README.md files for both repositories
- [ ] T006 Create symlink from learnflow-app/.claude/skills to skills-library/.claude/skills
- [ ] T007 Make initial commits for both repositories

---

## Phase 2: Foundational Tasks

### Environment Verification

- [ ] T008 Create a script that verifies the Kubernetes cluster is healthy following the implementation plan
- [ ] T009 Save the verification script as scripts/verify-k8s.sh and run it

---

## Phase 3: Foundation Skills Development (User Story Priority 1)

### TASK-101: Create agents-md-gen Skill

- [ ] T010 [P] [US1] Create .claude/skills/agents-md-gen/SKILL.md with instructions for AI agents
- [ ] T011 [P] [US1] Create .claude/skills/agents-md-gen/scripts/generate_agents_md.py with Python script
- [ ] T012 [P] [US1] Create .claude/skills/agents-md-gen/REFERENCE.md with documentation
- [ ] T013 [US1] Test the skill by generating AGENTS.md for the skills-library repository
- [ ] T014 [US1] Verify the skill generates valid, comprehensive AGENTS.md

### TASK-102: Create mcp-code-execution Skill

- [ ] T015 [P] [US1] Create .claude/skills/mcp-code-execution/SKILL.md explaining MCP Code Execution pattern
- [ ] T016 [P] [US1] Create .claude/skills/mcp-code-execution/scripts/mcp_client.py with generic MCP client wrapper
- [ ] T017 [P] [US1] Create .claude/skills/mcp-code-execution/scripts/example_usage.py with token savings comparison
- [ ] T018 [P] [US1] Create .claude/skills/mcp-code-execution/REFERENCE.md with best practices
- [ ] T019 [US1] Verify the example shows significant token savings (80%+)

### TASK-103: Test Cross-Agent Compatibility

- [ ] T020 [US1] Test the agents-md-gen skill using Goose
- [ ] T021 [US1] Test the mcp-code-execution skill using Goose
- [ ] T022 [US1] Create docs/cross-agent-testing.md with test results

---

## Phase 4: Infrastructure Skills Development (User Story Priority 2)

### TASK-201: Create kafka-k8s-setup Skill

- [ ] T023 [P] [US2] Create .claude/skills/kafka-k8s-setup/SKILL.md with instructions for deploying Kafka
- [ ] T024 [P] [US2] Create .claude/skills/kafka-k8s-setup/scripts/deploy.sh with Helm installation script
- [ ] T025 [P] [US2] Create .claude/skills/kafka-k8s-setup/scripts/verify.py with pod health verification
- [ ] T026 [P] [US2] Create .claude/skills/kafka-k8s-setup/scripts/create_topics.sh with topic creation for LearnFlow
- [ ] T027 [P] [US2] Create .claude/skills/kafka-k8s-setup/REFERENCE.md with Kafka configuration options
- [ ] T028 [US2] Test skill by deploying Kafka to Minikube cluster
- [ ] T029 [US2] Verify all pods are Running and all LearnFlow topics created

### TASK-202: Create postgres-k8s-setup Skill

- [ ] T030 [P] [US2] Create .claude/skills/postgres-k8s-setup/SKILL.md with instructions for deploying PostgreSQL
- [ ] T031 [P] [US2] Create .claude/skills/postgres-k8s-setup/scripts/deploy.sh with Helm installation with secrets
- [ ] T032 [P] [US2] Create .claude/skills/postgres-k8s-setup/scripts/migrate.py with schema and migration runner
- [ ] T033 [P] [US2] Create .claude/skills/postgres-k8s-setup/scripts/verify.py with connection verification
- [ ] T034 [P] [US2] Create .claude/skills/postgres-k8s-setup/scripts/schema.sql with LearnFlow database schema
- [ ] T035 [P] [US2] Create .claude/skills/postgres-k8s-setup/REFERENCE.md with PostgreSQL configuration and schema docs
- [ ] T036 [US2] Test skill by deploying PostgreSQL with LearnFlow schema
- [ ] T037 [US2] Verify PostgreSQL deployed successfully with schema applied and all tables created

---

## Phase 5: Service Development Skills (User Story Priority 3)

### TASK-301: Create fastapi-dapr-agent Skill

- [ ] T038 [P] [US3] Create .claude/skills/fastapi-dapr-agent/SKILL.md with instructions for creating agent services
- [ ] T039 [P] [US3] Create .claude/skills/fastapi-dapr-agent/scripts/scaffold.py with project generator
- [ ] T040 [P] [US3] Create .claude/skills/fastapi-dapr-agent/scripts/dapr_config.py with Dapr component generator
- [ ] T041 [P] [US3] Create .claude/skills/fastapi-dapr-agent/templates/main.py.template with FastAPI app template
- [ ] T042 [P] [US3] Create .claude/skills/fastapi-dapr-agent/templates/agent.py.template with OpenAI Agent template
- [ ] T043 [P] [US3] Create .claude/skills/fastapi-dapr-agent/templates/Dockerfile.template with multi-stage Docker build
- [ ] T044 [P] [US3] Create .claude/skills/fastapi-dapr-agent/templates/k8s-deployment.yaml.template with K8s manifests
- [ ] T045 [P] [US3] Create .claude/skills/fastapi-dapr-agent/REFERENCE.md with Dapr patterns and best practices
- [ ] T046 [US3] Test skill by creating a sample Concepts agent service

### TASK-302: Generate All 6 LearnFlow Agent Services

- [ ] T047 [P] [US3] Use fastapi-dapr-agent skill to create triage-agent service
- [ ] T048 [P] [US3] Use fastapi-dapr-agent skill to create concepts-agent service
- [ ] T049 [P] [US3] Use fastapi-dapr-agent skill to create code-review-agent service
- [ ] T050 [P] [US3] Use fastapi-dapr-agent skill to create debug-agent service
- [ ] T051 [P] [US3] Use fastapi-dapr-agent skill to create exercise-agent service
- [ ] T052 [P] [US3] Use fastapi-dapr-agent skill to create progress-agent service
- [ ] T053 [US3] Customize agent.py with appropriate OpenAI prompts and tools for each service
- [ ] T054 [US3] Configure Dapr components for each service
- [ ] T055 [US3] Add service-specific endpoints to each service
- [ ] T056 [US3] Include health checks in each service
- [ ] T057 [US3] Generate Dockerfiles and K8s manifests for each service
- [ ] T058 [US3] Generate AGENTS.md for each service using agents-md-gen skill

---

## Phase 6: Frontend & Deployment Skills (User Story Priority 4)

### TASK-401: Create nextjs-k8s-deploy Skill

- [ ] T059 [P] [US4] Create .claude/skills/nextjs-k8s-deploy/SKILL.md with deployment instructions
- [ ] T060 [P] [US4] Create .claude/skills/nextjs-k8s-deploy/scripts/build_docker.sh with Docker build script
- [ ] T061 [P] [US4] Create .claude/skills/nextjs-k8s-deploy/scripts/k8s_manifest.py with manifest generator
- [ ] T062 [P] [US4] Create .claude/skills/nextjs-k8s-deploy/scripts/deploy.sh with deployment orchestrator
- [ ] T063 [P] [US4] Create .claude/skills/nextjs-k8s-deploy/templates/Dockerfile.template with optimized Next.js Dockerfile
- [ ] T064 [P] [US4] Create .claude/skills/nextjs-k8s-deploy/REFERENCE.md with Next.js optimization guide
- [ ] T065 [US4] Test skill by deploying a sample Next.js app to Minikube

### TASK-402: Create docusaurus-deploy Skill

- [ ] T066 [P] [US4] Create .claude/skills/docusaurus-deploy/SKILL.md with documentation generation instructions
- [ ] T067 [P] [US4] Create .claude/skills/docusaurus-deploy/scripts/init_docusaurus.sh with scaffold script
- [ ] T068 [P] [US4] Create .claude/skills/docusaurus-deploy/scripts/generate_docs.py with auto-generation script
- [ ] T069 [P] [US4] Create .claude/skills/docusaurus-deploy/scripts/deploy.sh with build and deploy script
- [ ] T070 [P] [US4] Create .claude/skills/docusaurus-deploy/REFERENCE.md with Docusaurus customization guide
- [ ] T071 [US4] Test skill by generating documentation for skills-library and learnflow-app

---

## Phase 7: LearnFlow Application Development (User Story Priority 5)

### TASK-501: Develop LearnFlow Frontend

- [ ] T072 [P] [US5] Initialize Next.js 14+ project with App Router in learnflow-app/frontend/
- [ ] T073 [P] [US5] Install required dependencies (@monaco-editor/react, better-auth, @tanstack/react-query, tailwindcss, recharts)
- [ ] T074 [P] [US5] Configure TypeScript, ESLint, Prettier for the frontend project
- [ ] T075 [P] [US5] Create authentication pages with Better Auth in src/app/(auth)/
- [ ] T076 [P] [US5] Create student dashboard page in src/app/student/page.tsx
- [ ] T077 [P] [US5] Create teacher dashboard page in src/app/teacher/page.tsx
- [ ] T078 [P] [US5] Create chat interface component in src/components/ChatInterface.tsx
- [ ] T079 [P] [US5] Create code editor component in src/components/CodeEditor.tsx
- [ ] T080 [P] [US5] Create quiz interface component in src/components/QuizInterface.tsx
- [ ] T081 [P] [US5] Create API client in src/lib/api.ts with JWT token injection
- [ ] T082 [P] [US5] Configure TailwindCSS with dark mode support
- [ ] T083 [P] [US5] Create .env.local for API URLs pointing to Kong Gateway
- [ ] T084 [US5] Use nextjs-k8s-deploy skill to containerize and deploy frontend to Kubernetes
- [ ] T085 [US5] Verify frontend deployed and accessible with all features functional

### TASK-502: Deploy Backend Infrastructure

- [ ] T086 [P] [US5] Use postgres-k8s-setup skill to deploy PostgreSQL with database name learnflow
- [ ] T087 [P] [US5] Apply schema from infrastructure/postgres/schema.sql to PostgreSQL
- [ ] T088 [P] [US5] Use kafka-k8s-setup skill to deploy Kafka with all LearnFlow topics
- [ ] T089 [P] [US5] Verify all PostgreSQL tables created and all Kafka topics available
- [ ] T090 [P] [US5] Create deployment verification script in scripts/verify-infrastructure.sh

### TASK-503: Deploy AI Agent Microservices

- [ ] T091 [P] [US5] Build Docker images for all 6 LearnFlow AI agent services
- [ ] T092 [P] [US5] Load Docker images to Minikube for all services
- [ ] T093 [P] [US5] Apply Dapr components for all services
- [ ] T094 [P] [US5] Deploy all services to Kubernetes with kubectl apply
- [ ] T095 [P] [US5] Verify all pods are Running with Dapr sidecar injected
- [ ] T096 [P] [US5] Verify health check endpoints responding for all services
- [ ] T097 [P] [US5] Verify Kafka connections established for all services
- [ ] T098 [P] [US5] Create deployment automation script in scripts/deploy-services.sh
- [ ] T099 [US5] Verify inter-service communication by testing triage agent and event flow

---

## Phase 8: Polish & Cross-Cutting Concerns

### TASK-504: Deploy Kong API Gateway

- [ ] T100 Create Kong API Gateway deployment following the implementation plan
- [ ] T101 Install Kong via Helm with database-less mode in learnflow namespace
- [ ] T102 Create Kong configuration with routes for all 6 agent services
- [ ] T103 Configure Kong Ingress Controller for traffic routing
- [ ] T104 Verify API Gateway routes traffic correctly to all services

### Documentation and Final Verification

- [ ] T105 Update README.md files in both repositories with complete setup instructions
- [ ] T106 Create comprehensive documentation for the LearnFlow application
- [ ] T107 Run end-to-end integration tests following the demo scenario
- [ ] T108 Verify all components are integrated and working together
- [ ] T109 Document the complete LearnFlow architecture and deployment process
- [ ] T110 Create a final verification script that tests the complete LearnFlow flow

---

## Dependencies

- US1 (Foundation Skills) must be completed before US2-US5
- US2 (Infrastructure Skills) must be completed before US5 (Application Development)
- US3 (Service Development Skills) must be completed before US5 (Application Development)
- US4 (Frontend & Deployment Skills) must be completed before US5 (Application Development)

## Parallel Execution Opportunities

- All template files for fastapi-dapr-agent skill (T041-T044) can be created in parallel
- All 6 LearnFlow agent services (T047-T052) can be created in parallel after scaffolding script is ready
- All frontend components (T075-T080) can be developed in parallel after project setup
- All backend deployment tasks (T086-T089) can run in parallel with frontend development

## Implementation Strategy

1. Start with foundational skills (US1) as they're required for all other work
2. Complete infrastructure skills (US2) to enable backend deployment
3. Build service development skills (US3) to enable microservice creation
4. Create deployment skills (US4) to enable frontend and documentation deployment
5. Complete application development (US5) using all previous components

The MVP scope includes US1 (Foundation Skills) and the ability to generate basic AGENTS.md files.