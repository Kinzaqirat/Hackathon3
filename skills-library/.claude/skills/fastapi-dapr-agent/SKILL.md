---
name: fastapi-dapr-agent
description: Scaffold FastAPI microservices with Dapr and OpenAI Agents
version: 1.0.0
allowed-tools: [bash, python]
---

# FastAPI Dapr Agent Skill

## When to Use
- Creating new FastAPI microservices for LearnFlow
- Building AI agent services with Dapr integration
- User asks: "Create agent service" or "Scaffold FastAPI microservice"
- Need to quickly generate service templates

## Instructions

### 1. Create New Agent Service
```bash
python scripts/scaffold.py --name concepts-agent --output ../concepts-agent
```

### 2. Customize Agent Logic
- Edit `services/{service-name}/agent.py` to add OpenAI prompts and tools
- Edit `services/{service-name}/main.py` to add service-specific endpoints

### 3. Configure Dapr Components
```bash
python scripts/dapr_config.py --service concepts-agent
```

### 4. Build and Deploy
```bash
docker build -t learnflow/concepts-agent:latest .
kubectl apply -f k8s-deployment.yaml
```

## Validation
- [ ] Service scaffolded with all required files
- [ ] Dapr components configured (state store, pub/sub)
- [ ] Dockerfile builds successfully
- [ ] K8s manifest valid and deployable
- [ ] Service responds to health checks

## Outputs
- Complete FastAPI service structure
- Dockerfile for containerization
- Kubernetes deployment manifest
- Dapr configuration files

## Includes
- FastAPI 0.95+
- OpenAI Agents SDK integration
- Dapr state management and pub/sub
- Health check endpoints
- Request/response logging

For detailed patterns and best practices, see [REFERENCE.md](./REFERENCE.md).
