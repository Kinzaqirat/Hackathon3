# Kafka on Kubernetes Setup Reference

## Overview

This skill deploys Apache Kafka on Kubernetes using Helm, with support for the LearnFlow event streaming architecture.

## Architecture

```
┌─────────────────────────────────────────────┐
│         Kafka Cluster (3 replicas)          │
│  ┌───────────┐  ┌───────────┐  ┌─────────┐ │
│  │ kafka-0   │  │ kafka-1   │  │kafka-2  │ │
│  │ 9092      │  │ 9092      │  │ 9092    │ │
│  └─────┬─────┘  └─────┬─────┘  └────┬────┘ │
│        └───────────────┼─────────────┘      │
└────────────────────────┼──────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌─────▼──────┐  ┌───▼───────┐
    │Zookeeper│    │LearnFlow   │  │ External  │
    │ Cluster │    │ Services   │  │ Consumers │
    └─────────┘    └────────────┘  └───────────┘
```

## LearnFlow Topics

### 1. student-events
- **Purpose**: Student learning activities (login, exercise start, etc.)
- **Partitions**: 3
- **Replication**: 1 (dev) / 3 (prod)
- **Retention**: 7 days
- **Key schema**: `student_id`
- **Value schema**: Event object

### 2. exercise-submissions
- **Purpose**: Code exercise submissions from students
- **Partitions**: 3
- **Replication**: 1 (dev) / 3 (prod)
- **Retention**: 30 days
- **Key schema**: `exercise_id`
- **Value schema**: Submission object

### 3. progress-updates
- **Purpose**: Student progress tracking events
- **Partitions**: 3
- **Replication**: 1 (dev) / 3 (prod)
- **Retention**: 90 days
- **Key schema**: `student_id`
- **Value schema**: Progress object

### 4. chat-messages
- **Purpose**: Chat messages between students and agents
- **Partitions**: 3
- **Replication**: 1 (dev) / 3 (prod)
- **Retention**: 30 days
- **Key schema**: `session_id`
- **Value schema**: Message object

### 5. code-execution-results
- **Purpose**: Results from code execution requests
- **Partitions**: 3
- **Replication**: 1 (dev) / 3 (prod)
- **Retention**: 14 days
- **Key schema**: `execution_id`
- **Value schema**: Result object

### 6. agent-responses
- **Purpose**: Agent service responses to queries
- **Partitions**: 3
- **Replication**: 1 (dev) / 3 (prod)
- **Retention**: 7 days
- **Key schema**: `request_id`
- **Value schema**: Response object

### 7. system-events
- **Purpose**: Infrastructure and system-level events
- **Partitions**: 3
- **Replication**: 1 (dev) / 3 (prod)
- **Retention**: 30 days
- **Key schema**: `component`
- **Value schema**: System event object

## Helm Configuration

### Default Values
```yaml
replicaCount: 3              # Kafka broker replicas
persistence:
  enabled: true
  size: 10Gi
auth:
  enabled: false             # No SASL auth for simplicity
zookeeper:
  enabled: true
  replicaCount: 3
  persistence:
    enabled: true
    size: 5Gi
```

### Customization
```bash
# Override default replicas
REPLICAS=5 bash scripts/deploy.sh

# Custom chart version
CHART=bitnami/kafka:20.0.0 bash scripts/deploy.sh

# Custom release name
RELEASE_NAME=kafka-prod bash scripts/deploy.sh
```

## Services

### Kafka Headless Service
- **Name**: kafka-headless.learnflow.svc.cluster.local
- **Port**: 9092 (plaintext)
- **Used by**: Internal clients (Kubernetes pods)

### Kafka ClusterIP Service
- **Name**: kafka.learnflow.svc.cluster.local
- **Port**: 9092
- **Used by**: Load balancing between replicas

## Monitoring

### Check Kafka Status
```bash
kubectl get pods -n learnflow -l app.kubernetes.io/name=kafka
kubectl get svc -n learnflow -l app.kubernetes.io/name=kafka
```

### View Kafka Logs
```bash
kubectl logs -n learnflow kafka-0
```

### Check Topic Status
```bash
kubectl exec -n learnflow kafka-0 -- \
  kafka-topics.sh --list --bootstrap-server localhost:9092
```

### Consumer Group Status
```bash
kubectl exec -n learnflow kafka-0 -- \
  kafka-consumer-groups.sh --list --bootstrap-server localhost:9092
```

## Troubleshooting

### Pods Not Starting
1. Check events: `kubectl describe pod kafka-0 -n learnflow`
2. Check PVC status: `kubectl get pvc -n learnflow`
3. Check storage availability

### Topic Creation Fails
1. Verify Kafka is running: `kubectl get pods -n learnflow`
2. Check broker connectivity: `kubectl logs kafka-0 -n learnflow`
3. Verify replication factor doesn't exceed broker count

### Performance Issues
1. Check disk usage: `kubectl exec kafka-0 -n learnflow -- df -h`
2. Check memory: `kubectl top pods -n learnflow`
3. Review broker logs for GC pauses

## Capacity Planning

### Storage Requirements
- Per broker: `(avg_message_size × retention_days × incoming_rate) / (num_brokers × compression_ratio)`
- Example: 1KB messages × 7 days × 1000 msg/sec ÷ 3 brokers ÷ 2× compression = ~70GB per broker

### CPU/Memory
- **CPU**: 500m-1 core per broker (light to moderate load)
- **Memory**: 2-4Gi per broker (for heap and OS cache)

### Network
- Internal cluster bandwidth is typically abundant
- Consider external exposure bandwidth

## Production Considerations

1. **Enable TLS**: Set `auth.enabled=true` with TLS certificates
2. **Enable SASL**: Use SASL_PLAINTEXT or SASL_SSL for authentication
3. **Set Quotas**: Limit producer/consumer rates per client
4. **Enable Monitoring**: Install Prometheus exporters
5. **Set Retention**: Configure topic-level retention policies
6. **Backup**: Regular snapshots of Zookeeper data
7. **Upgrade Strategy**: Rolling upgrades with canary deployments

## Cleaning Up

### Delete All Topics
```bash
kubectl exec -n learnflow kafka-0 -- \
  kafka-topics.sh --delete \
  --bootstrap-server localhost:9092 \
  --topic '.*'
```

### Uninstall Kafka
```bash
helm uninstall kafka -n learnflow
```

### Delete Persistent Volumes
```bash
kubectl delete pvc -n learnflow -l app.kubernetes.io/name=kafka
```

## References

- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Bitnami Kafka Helm Chart](https://github.com/bitnami/charts/tree/main/bitnami/kafka)
- [Kafka on Kubernetes Best Practices](https://www.confluent.io/blog/kafka-on-kubernetes/)
