---
name: docusaurus-deploy
description: Generate and deploy documentation sites with Docusaurus
version: 1.0.0
allowed-tools: [bash, python]
---

# Docusaurus Deployment

## When to Use
- Generating documentation sites for repositories
- Publishing auto-generated API docs
- Creating user guides and tutorials
- User asks: "Deploy docs" or "Generate documentation"

## Instructions

### 1. Initialize Docusaurus
```bash
bash scripts/init_docusaurus.sh --output docs-site
```

### 2. Generate Documentation
```bash
python scripts/generate_docs.py --source-dir ./ --output docs-site
```

### 3. Build and Deploy
```bash
bash scripts/deploy.sh --build-dir docs-site
```

### 4. Verify Deployment
```bash
kubectl get svc -l app=docs
# Access via: http://docs.learnflow.local
```

## Validation
- [ ] Docusaurus site generates without errors
- [ ] All docs pages render correctly
- [ ] Search functionality works
- [ ] Navigation structure is correct
- [ ] Mobile responsive layout

## Outputs
- Static documentation site
- Docker image for documentation
- Kubernetes deployment
- Service and ingress

For configuration, see [REFERENCE.md](./REFERENCE.md).
