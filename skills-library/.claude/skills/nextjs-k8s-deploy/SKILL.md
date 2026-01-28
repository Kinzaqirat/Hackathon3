---
name: nextjs-k8s-deploy
description: Build and deploy Next.js applications to Kubernetes
version: 1.0.0
allowed-tools: [bash, python]
---

# Next.js Kubernetes Deployment

## When to Use
- Deploying Next.js frontend to Kubernetes
- Building optimized Next.js Docker images
- Deploying LearnFlow frontend
- User asks: "Deploy Next.js" or "Build frontend"

## Instructions

### 1. Build Docker Image
```bash
bash scripts/build_docker.sh --app-dir ./app-dir --output-tag my-app:latest
```

### 2. Generate Kubernetes Manifest
```bash
python scripts/k8s_manifest.py --app-name learnflow-frontend --image my-app:latest
```

### 3. Deploy to Kubernetes
```bash
bash scripts/deploy.sh --manifest k8s-manifest.yaml
```

### 4. Verify Deployment
```bash
kubectl get pods -l app=learnflow-frontend
kubectl logs -f deployment/learnflow-frontend
```

## Validation
- [ ] Docker image builds successfully
- [ ] Image runs locally without errors
- [ ] Kubernetes manifest is valid
- [ ] Pods are Running with readiness passing
- [ ] Frontend accessible via ingress

## Outputs
- Optimized Docker image for Next.js
- Kubernetes deployment manifest
- Service and ingress configuration
- Health check configuration

For configuration options, see [REFERENCE.md](./REFERENCE.md).
