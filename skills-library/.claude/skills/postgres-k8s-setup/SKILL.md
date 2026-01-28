---
name: postgres-k8s-setup
description: Deploy PostgreSQL on Kubernetes with LearnFlow schema
version: 1.0.0
allowed-tools: [bash, python]
---

# PostgreSQL on Kubernetes Setup

## When to Use
- Deploying PostgreSQL database to Kubernetes cluster
- Setting up LearnFlow database with schema
- User asks: "Deploy PostgreSQL" or "Set up database"
- Need to initialize learnflow database with all tables

## Instructions

### 1. Deploy PostgreSQL
```bash
bash scripts/deploy.sh
```

### 2. Run Database Migrations
```bash
python scripts/migrate.py
```

### 3. Verify Database Setup
```bash
python scripts/verify.py
```

### 4. Optional: Connect Locally
```bash
kubectl port-forward -n learnflow svc/postgres 5432:5432
psql -h localhost -U postgres
```

## Validation
- [ ] PostgreSQL pod is Running
- [ ] Database 'learnflow' created
- [ ] All required tables created (students, exercises, progress, etc.)
- [ ] Schema migrations applied successfully
- [ ] Health check passes

## Outputs
- Running PostgreSQL instance in Kubernetes
- Initialized learnflow database with schema
- Database connection string: `postgresql://postgres:password@postgres.learnflow.svc.cluster.local:5432/learnflow`

## Configuration
- **Database**: learnflow
- **Username**: postgres
- **Password**: Auto-generated (stored in Secret)
- **Port**: 5432
- **Storage**: 20Gi persistent volume

For detailed configuration and schema, see [REFERENCE.md](./REFERENCE.md).
