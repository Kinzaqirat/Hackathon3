# Next.js Kubernetes Deployment Reference

## Optimized Docker Build for Next.js

### Multi-Stage Build Strategy
```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Runtime
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json ./
CMD ["npm", "start"]
```

### Image Size Optimization
- **No build tools**: Alpine Linux base image (40MB)
- **No dev dependencies**: Production dependencies only
- **No source code**: Only compiled output
- **Final size**: ~200MB vs ~500MB+ with dev dependencies

## Kubernetes Deployment Configuration

### Deployment Manifest Example
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: learnflow-frontend
  namespace: learnflow
spec:
  replicas: 2
  selector:
    matchLabels:
      app: learnflow-frontend
  template:
    metadata:
      labels:
        app: learnflow-frontend
    spec:
      containers:
      - name: frontend
        image: learnflow/frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "http://api.learnflow.local"
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service and Ingress
```yaml
apiVersion: v1
kind: Service
metadata:
  name: learnflow-frontend
  namespace: learnflow
spec:
  selector:
    app: learnflow-frontend
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: learnflow-frontend
  namespace: learnflow
spec:
  rules:
  - host: learnflow.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: learnflow-frontend
            port:
              number: 80
```

## Performance Optimization

### 1. Build Optimization
- Use `npm ci` instead of `npm install` for reproducible builds
- Enable Next.js cache in CI/CD
- Use `.dockerignore` to exclude unnecessary files

### 2. Runtime Optimization
- Use Node Alpine image instead of full Node
- Enable gzip compression
- Configure appropriate cache headers
- Use CDN for static assets

### 3. Kubernetes Optimization
- Set resource requests/limits appropriately
- Use readiness/liveness probes
- Enable horizontal pod autoscaling
- Use init containers for migrations

## Environment Variables

### Next.js Environment Variables

```bash
# Public (accessible in browser)
NEXT_PUBLIC_API_URL=http://api.learnflow.local
NEXT_PUBLIC_APP_NAME=LearnFlow

# Private (server-side only)
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

### Kubernetes Secrets
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: frontend-secrets
  namespace: learnflow
type: Opaque
stringData:
  JWT_SECRET: "your-secret-key"
  API_KEY: "your-api-key"
```

## Deployment Strategies

### Blue-Green Deployment
```bash
# Create new deployment (green)
kubectl apply -f frontend-green-deploy.yaml

# Test green deployment
kubectl port-forward svc/frontend-green 3000:80

# Switch traffic to green
kubectl set service frontend selector='version=green'

# Keep blue as rollback
```

### Canary Deployment
```yaml
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: learnflow-frontend
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: learnflow-frontend
  service:
    port: 80
  analysis:
    interval: 1m
    threshold: 5
    maxWeight: 50
    stepWeight: 5
    metrics:
    - name: request-success-rate
      thresholdRange:
        min: 99
      interval: 1m
```

## Monitoring

### Health Checks
```bash
# Manual health check
curl -I http://learnflow.local/

# Check deployment status
kubectl rollout status deployment/learnflow-frontend

# Check pod status
kubectl get pods -l app=learnflow-frontend
```

### Logs and Debugging
```bash
# View deployment logs
kubectl logs -f deployment/learnflow-frontend

# Describe deployment
kubectl describe deployment learnflow-frontend

# Get events
kubectl get events -n learnflow --sort-by='.lastTimestamp'
```

### Metrics
```bash
# View resource usage
kubectl top pods -l app=learnflow-frontend

# Get metrics for deployment
kubectl top deployment learnflow-frontend
```

## Troubleshooting

### Deployment Won't Start
1. Check image exists: `docker images | grep learnflow/frontend`
2. Check pod events: `kubectl describe pod <pod-name>`
3. Check logs: `kubectl logs <pod-name>`

### Health Check Failing
1. Manually test: `curl http://localhost:3000`
2. Check health check configuration
3. Verify port is correct

### High Memory Usage
1. Check for memory leaks
2. Adjust Node.js memory limit
3. Review Next.js configuration

## Security Best Practices

1. **Use Secrets for Sensitive Data**
   - Store in Kubernetes secrets, not ConfigMaps
   - Use sealed-secrets or similar

2. **Network Policies**
   - Restrict ingress/egress traffic
   - Only allow necessary ports

3. **Resource Limits**
   - Prevent resource exhaustion
   - Set appropriate limits

4. **Regular Updates**
   - Keep Next.js updated
   - Keep Node.js updated
   - Update dependencies regularly

## References

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment/docker)
- [Next.js on Kubernetes](https://nextjs.org/docs/deployment/kubernetes)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
