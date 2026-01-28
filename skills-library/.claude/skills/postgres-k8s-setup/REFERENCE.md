# PostgreSQL on Kubernetes Setup Reference

## Overview

This skill deploys PostgreSQL on Kubernetes with automatic schema initialization for the LearnFlow application.

## Architecture

```
┌─────────────────────────────────────────────┐
│      PostgreSQL Pod (Primary)               │
│  ┌─────────────────────────────────────┐    │
│  │  PostgreSQL 15                      │    │
│  │  Port 5432                          │    │
│  │  Database: learnflow                │    │
│  └─────────────────────────────────────┘    │
│            │                                  │
│         Persistent Volume (20Gi)            │
└─────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│  LearnFlow Services              │
│  - Students                       │
│  - Exercises                      │
│  - Progress Tracking              │
└──────────────────────────────────┘
```

## LearnFlow Database Schema

### students
Stores student user information and enrollment details.

```sql
- id (PRIMARY KEY)
- user_id (UUID, unique)
- email (VARCHAR, unique)
- name (VARCHAR)
- grade_level (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### exercises
Contains coding exercises available in the platform.

```sql
- id (PRIMARY KEY)
- title (VARCHAR)
- description (TEXT)
- difficulty_level (VARCHAR)
- topic (VARCHAR)
- starter_code (TEXT)
- test_cases (JSON)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### exercise_submissions
Tracks student submissions for exercises.

```sql
- id (PRIMARY KEY)
- student_id (FK → students)
- exercise_id (FK → exercises)
- code (TEXT)
- status (VARCHAR: draft, submitted, passing, failing)
- score (INTEGER: 0-100)
- feedback (TEXT)
- submitted_at (TIMESTAMP)
- completed_at (TIMESTAMP)
```

### progress
Tracks student progress through exercises.

```sql
- id (PRIMARY KEY)
- student_id (FK → students)
- exercise_id (FK → exercises)
- status (VARCHAR: not_started, in_progress, completed, mastered)
- attempts (INTEGER)
- completed_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### chat_sessions
Stores chat sessions between students and AI agents.

```sql
- id (PRIMARY KEY)
- student_id (FK → students)
- topic (VARCHAR)
- created_at (TIMESTAMP)
- ended_at (TIMESTAMP)
```

### chat_messages
Stores individual messages within chat sessions.

```sql
- id (PRIMARY KEY)
- session_id (FK → chat_sessions)
- role (VARCHAR: user, assistant)
- content (TEXT)
- created_at (TIMESTAMP)
```

### code_execution_results
Stores results of code execution for submissions.

```sql
- id (PRIMARY KEY)
- submission_id (FK → exercise_submissions)
- execution_result (JSON)
- passed (BOOLEAN)
- duration_ms (INTEGER)
- created_at (TIMESTAMP)
```

### system_events
Tracks infrastructure and system-level events.

```sql
- id (PRIMARY KEY)
- event_type (VARCHAR)
- component (VARCHAR)
- details (JSON)
- created_at (TIMESTAMP)
```

## Indexes

Performance indexes are created on:
- students.email, students.user_id
- exercises.topic
- exercise_submissions.student_id, exercise_submissions.exercise_id
- progress.student_id
- chat_sessions.student_id
- chat_messages.session_id
- code_execution_results.submission_id
- system_events.event_type

## Connection Information

### Internal Connection (from within cluster)
```
Host: postgres.learnflow.svc.cluster.local
Port: 5432
Database: learnflow
User: postgres
Password: [auto-generated, stored in secret]
```

### Local Port-Forward
```bash
kubectl port-forward -n learnflow svc/postgres 5432:5432
psql -h localhost -U postgres -d learnflow
```

### Connection String (SQLAlchemy/Python)
```python
postgresql://postgres:password@postgres.learnflow.svc.cluster.local:5432/learnflow
```

## Helm Configuration

### Default Values
```yaml
auth:
  postgresPassword: [auto-generated]
primary:
  persistence:
    enabled: true
    size: 20Gi
  resources:
    requests:
      memory: 512Mi
      cpu: 250m
    limits:
      memory: 1Gi
      cpu: 500m
```

### Customization
```bash
# Set custom password
helm install postgres bitnami/postgresql \
  --set auth.postgresPassword=mypassword

# Set storage size
helm install postgres bitnami/postgresql \
  --set primary.persistence.size=50Gi

# Set resource limits
helm install postgres bitnami/postgresql \
  --set primary.resources.requests.memory=1Gi \
  --set primary.resources.limits.memory=2Gi
```

## Monitoring

### Database Size
```bash
kubectl exec -n learnflow postgres-0 -- \
  psql -U postgres -d learnflow -c \
  "SELECT pg_size_pretty(pg_database_size('learnflow'));"
```

### Connection Count
```bash
kubectl exec -n learnflow postgres-0 -- \
  psql -U postgres -d learnflow -c \
  "SELECT count(*) FROM pg_stat_activity;"
```

### Table Sizes
```bash
kubectl exec -n learnflow postgres-0 -- \
  psql -U postgres -d learnflow -c \
  "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

### Query Performance
```bash
kubectl exec -n learnflow postgres-0 -- \
  psql -U postgres -d learnflow -c \
  "SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

## Backup and Recovery

### Manual Backup
```bash
kubectl exec -n learnflow postgres-0 -- \
  pg_dump -U postgres learnflow > learnflow-backup.sql
```

### Restore from Backup
```bash
kubectl exec -n learnflow postgres-0 -- \
  psql -U postgres -d learnflow < learnflow-backup.sql
```

### Automated Backups with pg_dump
Create a CronJob for regular backups:
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: learnflow
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: postgres-backup
            image: postgres:15
            command:
            - /bin/sh
            - -c
            - pg_dump -h postgres -U postgres learnflow | gzip > /backup/learnflow-$(date +%Y%m%d).sql.gz
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: postgres-backup
          restartPolicy: OnFailure
```

## Scaling

### Vertical Scaling
```bash
# Increase memory limit
helm upgrade postgres bitnami/postgresql \
  --set primary.resources.limits.memory=4Gi \
  --set primary.resources.requests.memory=2Gi
```

### Replication (Production)
For high availability, deploy PostgreSQL with replicas:
```bash
helm install postgres bitnami/postgresql \
  --set architecture=replication \
  --set replica.replicaCount=2
```

## Troubleshooting

### Pod Not Starting
1. Check events: `kubectl describe pod postgres-0 -n learnflow`
2. Check logs: `kubectl logs postgres-0 -n learnflow`
3. Verify PVC: `kubectl get pvc -n learnflow`

### Connection Refused
1. Verify pod is running: `kubectl get pods -n learnflow`
2. Check pod logs for startup errors
3. Verify service exists: `kubectl get svc -n learnflow`

### Disk Full
1. Check disk usage: `kubectl exec postgres-0 -n learnflow -- df -h`
2. Increase PVC size: Edit the PVC and increase storage

### Performance Issues
1. Check active connections: `SELECT * FROM pg_stat_activity;`
2. Identify slow queries: Enable query logging
3. Analyze query plans: `EXPLAIN ANALYZE SELECT ...;`

## Production Considerations

1. **Enable SSL**: Configure TLS certificates
2. **Set Passwords**: Use strong, unique passwords
3. **Enable Backups**: Implement automated backup strategy
4. **Monitor**: Set up Prometheus exporters and alerting
5. **Connection Pooling**: Use PgBouncer for connection management
6. **Vacuum/Analyze**: Schedule regular maintenance jobs
7. **Replication**: Deploy with replicas for HA
8. **Secrets Management**: Store credentials in sealed secrets

## References

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Bitnami PostgreSQL Helm Chart](https://github.com/bitnami/charts/tree/main/bitnami/postgresql)
- [PostgreSQL on Kubernetes](https://kubernetes.io/blog/2018/05/running-stateful-applications-in-kubernetes/)
