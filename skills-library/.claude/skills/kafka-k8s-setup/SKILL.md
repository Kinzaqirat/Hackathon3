---
name: kafka-k8s-setup
description: Deploy Apache Kafka on Kubernetes with Helm
version: 1.0.0
allowed-tools: [bash, python]
---

# Kafka on Kubernetes Setup

## When to Use
- Deploying Kafka to a Kubernetes cluster
- Setting up event streaming infrastructure for LearnFlow
- User asks: "Deploy Kafka" or "Set up Kafka cluster"
- Need to create Kafka topics for event distribution

## Instructions

### 1. Deploy Kafka Cluster
```bash
bash scripts/deploy.sh
```

### 2. Verify Pod Health
```bash
python scripts/verify.py
```

### 3. Create LearnFlow Topics
```bash
bash scripts/create_topics.sh
```

### 4. Validate Topics Created
The verify.py script will confirm all topics are created and ready.

## Validation
- [ ] Kafka pods are Running (3 replicas by default)
- [ ] All LearnFlow topics created (student-events, exercise-submissions, etc.)
- [ ] Topics accessible via cluster DNS
- [ ] No pending or failed pods

## Outputs
- Running Kafka cluster in Kubernetes
- 6+ Kafka topics for LearnFlow services
- Health verification report

## Configuration
- **Namespace**: learnflow (or specified via NAMESPACE env var)
- **Replicas**: 3 (production) or 1 (development)
- **Retention**: 7 days (configurable)
- **Partitions**: 3 (configurable per topic)

For detailed configuration options, see [REFERENCE.md](./REFERENCE.md).
