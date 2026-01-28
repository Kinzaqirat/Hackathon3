#!/bin/bash
# Deploy PostgreSQL to Kubernetes using Helm

set -e

# Configuration
NAMESPACE=${NAMESPACE:-learnflow}
RELEASE_NAME=${RELEASE_NAME:-postgres}
CHART=${CHART:-bitnami/postgresql}

echo "================================"
echo "Deploying PostgreSQL to Kubernetes"
echo "================================"
echo "Namespace: $NAMESPACE"
echo "Release: $RELEASE_NAME"
echo ""

# Check if Helm is installed
if ! command -v helm &> /dev/null; then
    echo "ERROR: Helm is not installed. Please install Helm first."
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "ERROR: kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if cluster is accessible
echo "Checking Kubernetes cluster..."
if ! kubectl cluster-info &> /dev/null; then
    echo "ERROR: Cannot connect to Kubernetes cluster."
    exit 1
fi
echo "✓ Kubernetes cluster is accessible"

# Create namespace if it doesn't exist
echo "Creating namespace $NAMESPACE..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
echo "✓ Namespace ready"

# Add Bitnami Helm repo
echo "Adding Bitnami Helm repository..."
helm repo add bitnami https://charts.bitnami.com/bitnami &> /dev/null || true
helm repo update &> /dev/null
echo "✓ Helm repository updated"

# Generate random password
DB_PASSWORD=$(openssl rand -base64 32)

# Install or upgrade PostgreSQL
echo "Installing PostgreSQL..."
helm upgrade --install $RELEASE_NAME $CHART \
  --namespace $NAMESPACE \
  --set auth.postgresPassword=$DB_PASSWORD \
  --set primary.persistence.enabled=true \
  --set primary.persistence.size=20Gi \
  --set primary.resources.requests.memory="512Mi" \
  --set primary.resources.requests.cpu="250m" \
  --set primary.resources.limits.memory="1Gi" \
  --set primary.resources.limits.cpu="500m" \
  --wait \
  --timeout=10m

echo "✓ PostgreSQL deployed successfully"

# Save credentials
echo ""
echo "Database Credentials:"
echo "====================="
echo "Username: postgres"
echo "Password: $DB_PASSWORD"
echo ""
echo "Connection string (internal):"
echo "postgresql://postgres:${DB_PASSWORD}@postgres.${NAMESPACE}.svc.cluster.local:5432/postgres"
echo ""

# Display status
echo "PostgreSQL Deployment Status:"
echo "============================="
kubectl get pods -n $NAMESPACE -l app.kubernetes.io/name=postgresql
echo ""

echo "✓ PostgreSQL deployment complete!"
