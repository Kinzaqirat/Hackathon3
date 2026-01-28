# Quick Start Guide - LearnFlow Skills

## Overview

This guide provides step-by-step instructions to use the LearnFlow skills for deployment, microservice creation, and documentation generation.

---

## Prerequisites

### System Requirements
- Kubernetes cluster (Minikube, EKS, GKE, or similar)
- kubectl configured and connected to cluster
- Helm 3+ installed
- Docker or container registry access
- Python 3.10+
- Bash shell

### Environment Setup
```bash
# Verify Kubernetes connection
kubectl cluster-info

# Verify Helm installation
helm version

# Verify Docker
docker --version

# Set namespace
kubectl create namespace learnflow
```

---

## Skill 1: agents-md-gen - Generate Repository Docs

### Purpose
Automatically generate AGENTS.md files for any repository to help AI agents understand project structure.

### Quick Start
```bash
cd skills-library/.claude/skills/agents-md-gen

# Generate AGENTS.md for skills-library
python scripts/generate_agents_md.py /path/to/skills-library

# Output: /path/to/skills-library/AGENTS.md
```

### When to Use
- When creating a new repository
- When you want AI agents to understand your project
- When documentation is needed for AI context

---

## Skill 2: mcp-code-execution - Token Efficiency Pattern

### Purpose
Demonstrate how to reduce token usage by 80-98% when using MCP servers.

### Quick Start
```bash
cd skills-library/.claude/skills/mcp-code-execution

# See token savings example
python scripts/example_usage.py
```

### Key Takeaway
Instead of returning large data to context:
```python
# ❌ BAD: 5,000+ tokens
large_content = mcp.read_file("huge_file.py")  # All content

# ✓ GOOD: 100 tokens
analysis = mcp.analyze_locally("file.py")  # Only summary
```

---

## Skill 3: kafka-k8s-setup - Deploy Event Streaming

### Purpose
Deploy Apache Kafka to Kubernetes cluster with LearnFlow topics pre-configured.

### Quick Start

#### Step 1: Deploy Kafka
```bash
cd skills-library/.claude/skills/kafka-k8s-setup

# Deploy Kafka cluster
bash scripts/deploy.sh

# Expected output:
# ✓ Kubernetes cluster is accessible
# ✓ Namespace ready
# ✓ Helm repository updated
# ✓ Kafka deployed successfully
```

#### Step 2: Create Topics
```bash
# Create 7 LearnFlow topics
bash scripts/create_topics.sh

# Topics created:
# - student-events
# - exercise-submissions
# - progress-updates
# - chat-messages
# - code-execution-results
# - agent-responses
# - system-events
```

#### Step 3: Verify
```bash
# Check deployment health
python scripts/verify.py

# Should show:
# Pod Status: success
#   Running pods: 3/3
#   ✓ kafka-0, kafka-1, kafka-2
# Kafka Connectivity: success
#   Bootstrap servers: kafka-0.kafka-headless.learnflow.svc...
# ✓ Kafka cluster is healthy!
```

### Configuration
```bash
# Custom replicas
REPLICAS=5 bash scripts/deploy.sh

# Custom namespace
NAMESPACE=production bash scripts/deploy.sh
```

---

## Skill 4: postgres-k8s-setup - Deploy Database

### Purpose
Deploy PostgreSQL with LearnFlow schema (8 tables, 9 indexes, pre-configured).

### Quick Start

#### Step 1: Deploy PostgreSQL
```bash
cd skills-library/.claude/skills/postgres-k8s-setup

# Deploy database
bash scripts/deploy.sh

# Outputs:
# Database Credentials
# Username: postgres
# Password: [auto-generated]
# Connection: postgresql://postgres:PASSWORD@postgres.learnflow.svc...
```

#### Step 2: Initialize Schema
```bash
# Create database and tables
python scripts/migrate.py

# Creates:
# - learnflow database
# - 8 tables
# - 9 performance indexes
# ✓ Schema migrations applied successfully
```

#### Step 3: Verify
```bash
# Check database health
python scripts/verify.py

# Should show:
# Pod Status: success
#   Pod: postgres-0
#   Phase: Running
# Storage Status: success
#   Phase: Bound
#   Storage: 20Gi
# ✓ PostgreSQL is healthy!
```

### Tables Created
```sql
- students              (student profiles)
- exercises             (exercise definitions)
- exercise_submissions  (submission tracking)
- progress              (student progress)
- chat_sessions         (chat management)
- chat_messages         (message history)
- code_execution_results (execution results)
- system_events         (system monitoring)
```

---

## Skill 5: fastapi-dapr-agent - Scaffold Microservices

### Purpose
Quickly generate production-ready FastAPI microservices with Dapr integration and OpenAI agent scaffolding.

### Quick Start

#### Step 1: Create Service
```bash
cd skills-library/.claude/skills/fastapi-dapr-agent

# Scaffold a new service
python scripts/scaffold.py \
  --name concepts-agent \
  --output ../../learnflow-app/services/concepts-agent

# Creates:
# - app/main.py          (FastAPI application)
# - app/agent.py         (OpenAI agent logic)
# - Dockerfile           (Multi-stage build)
# - k8s/deployment.yaml  (Kubernetes manifest)
# - dapr/components.yaml (Dapr configuration)
# - requirements.txt     (Python dependencies)
```

#### Step 2: Customize Agent
```python
# Edit app/agent.py
# 1. Add system prompt
SYSTEM_PROMPT = """
You are the Concepts Agent for LearnFlow.
Your role is to help students understand programming concepts.
"""

# 2. Define tools
TOOLS = [
    {
        "name": "get_exercise",
        "description": "Get an exercise by ID",
        ...
    }
]

# 3. Implement tool handlers
async def handle_tool_call(tool_name, params):
    if tool_name == "get_exercise":
        return await get_exercise(params["exercise_id"])
```

#### Step 3: Build and Deploy
```bash
cd ../../learnflow-app/services/concepts-agent

# Build Docker image
docker build -t learnflow/concepts-agent:1.0 .

# Push to registry (if needed)
docker push learnflow/concepts-agent:1.0

# Deploy to Kubernetes
kubectl apply -f k8s/deployment.yaml

# Verify
kubectl get pods -l app=concepts-agent

# Expected: concepts-agent pod is Running
```

#### Step 4: Test Service
```bash
# Port-forward for testing
kubectl port-forward svc/concepts-agent 8000:8000

# In another terminal:
curl http://localhost:8000/health
# Response: {"status": "healthy", "service": "concepts-agent"}

# Test chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user1", "message": "What is a loop?"}'
```

### Generate All 6 Services
```bash
# Repeat scaffolding for each agent
python scripts/scaffold.py --name triage-agent ...
python scripts/scaffold.py --name code-review-agent ...
python scripts/scaffold.py --name debug-agent ...
python scripts/scaffold.py --name exercise-agent ...
python scripts/scaffold.py --name progress-agent ...
```

---

## Skill 6: nextjs-k8s-deploy - Deploy Frontend

### Purpose
Build optimized Next.js Docker images and deploy to Kubernetes.

### Quick Start

```bash
cd skills-library/.claude/skills/nextjs-k8s-deploy

# Build Docker image (from Next.js project)
bash scripts/build_docker.sh \
  --app-dir /path/to/learnflow/frontend \
  --output-tag learnflow/frontend:1.0

# Generate Kubernetes manifest
python scripts/k8s_manifest.py \
  --app-name learnflow-frontend \
  --image learnflow/frontend:1.0 \
  --output k8s-manifest.yaml

# Deploy
bash scripts/deploy.sh --manifest k8s-manifest.yaml

# Access frontend
# http://learnflow.local (if ingress configured)
# or
kubectl port-forward svc/learnflow-frontend 3000:80
# http://localhost:3000
```

---

## Skill 7: docusaurus-deploy - Generate Docs

### Purpose
Automatically generate and deploy documentation sites with Docusaurus.

### Quick Start

```bash
cd skills-library/.claude/skills/docusaurus-deploy

# Initialize Docusaurus site
bash scripts/init_docusaurus.sh --output docs-site

# Generate documentation from source
python scripts/generate_docs.py \
  --source-dir /path/to/learnflow \
  --output docs-site

# Build and deploy
bash scripts/deploy.sh --build-dir docs-site

# Access documentation
# http://docs.learnflow.local
```

---

## Complete Deployment Example

### Deploy Entire LearnFlow Stack

```bash
# 1. Deploy Infrastructure
echo "1. Deploying Kafka..."
cd skills-library/.claude/skills/kafka-k8s-setup
bash scripts/deploy.sh && bash scripts/create_topics.sh

echo "2. Deploying PostgreSQL..."
cd ../postgres-k8s-setup
bash scripts/deploy.sh && python scripts/migrate.py

# 2. Create Microservices
echo "3. Creating microservices..."
cd ../fastapi-dapr-agent

for service in triage concepts code-review debug exercise progress; do
  echo "  Creating ${service}-agent..."
  python scripts/scaffold.py \
    --name "${service}-agent" \
    --output ../../learnflow-app/services/${service}-agent
done

# 3. Build and deploy services
echo "4. Building and deploying services..."
for service_dir in ../../learnflow-app/services/*-agent; do
  service_name=$(basename $service_dir)
  echo "  Deploying $service_name..."
  cd $service_dir
  docker build -t "learnflow/$service_name:1.0" .
  kubectl apply -f k8s/deployment.yaml
done

# 4. Deploy frontend
echo "5. Deploying frontend..."
cd ../../frontend
docker build -t learnflow/frontend:1.0 .
kubectl apply -f k8s/deployment.yaml

echo "✓ LearnFlow stack deployed successfully!"

# Verify
echo ""
echo "Deployment Status:"
kubectl get pods -n learnflow
kubectl get svc -n learnflow
```

---

## Troubleshooting

### Skill Not Working?

1. **Check Python path**
   ```bash
   which python
   python --version
   ```

2. **Verify dependencies**
   ```bash
   pip install pyyaml httpx
   ```

3. **Check cluster access**
   ```bash
   kubectl cluster-info
   kubectl get nodes
   ```

### Deployment Issues

1. **Pod won't start**
   ```bash
   kubectl describe pod <pod-name> -n learnflow
   kubectl logs <pod-name> -n learnflow
   ```

2. **Connection errors**
   ```bash
   # Verify service is running
   kubectl get svc -n learnflow
   
   # Check DNS
   kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup kafka.learnflow
   ```

3. **Resource issues**
   ```bash
   kubectl top nodes
   kubectl top pods -n learnflow
   ```

---

## Next Steps

### After Basic Deployment
1. Customize agent prompts and tools
2. Implement business logic in services
3. Configure Kong API Gateway
4. Set up monitoring and logging
5. Run end-to-end tests

### Resources
- [Skills Library README](../skills-library/README.md)
- [Implementation Summary](../IMPLEMENTATION_SUMMARY.md)
- [Task Completion Report](../TASK_COMPLETION_REPORT.md)
- [Individual Skill REFERENCE.md files](../skills-library/.claude/skills)

---

**Last Updated**: January 21, 2026  
**Skills Version**: 1.0.0  
**Status**: Production Ready ✓
