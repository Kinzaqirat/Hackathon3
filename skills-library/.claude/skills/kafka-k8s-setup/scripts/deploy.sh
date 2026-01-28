#!/bin/bash
# Deploy Apache Kafka to Kubernetes using Helm

set -e

# Configuration
NAMESPACE=${NAMESPACE:-learnflow}
RELEASE_NAME=${RELEASE_NAME:-kafka}
CHART=${CHART:-bitnami/kafka}
REPLICAS=${REPLICAS:-3}

echo "================================"
echo "Deploying Kafka to Kubernetes"
echo "================================"
echo "Namespace: $NAMESPACE"
echo "Release: $RELEASE_NAME"
echo "Replicas: $REPLICAS"
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

# Install or upgrade Kafka
echo "Installing Kafka..."
helm upgrade --install $RELEASE_NAME $CHART \
  --namespace $NAMESPACE \
  --set replicaCount=$REPLICAS \
  --set persistence.enabled=true \
  --set persistence.size=10Gi \
  --set auth.enabled=false \
  --set zookeeper.enabled=true \
  --set zookeeper.replicaCount=3 \
  --set zookeeper.persistence.enabled=true \
  --set zookeeper.persistence.size=5Gi \
  --wait \
  --timeout=10m

echo "✓ Kafka deployed successfully"

# Display status
echo ""
echo "Kafka Deployment Status:"
echo "========================"
kubectl get pods -n $NAMESPACE -l app.kubernetes.io/name=kafka
echo ""
echo "Service endpoints:"
kubectl get svc -n $NAMESPACE -l app.kubernetes.io/name=kafka

echo ""
echo "✓ Kafka deployment complete!"
echo "Bootstrap servers: kafka-0.kafka-headless.$NAMESPACE.svc.cluster.local:9092"
