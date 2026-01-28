#!/bin/bash
# Create Kafka topics for LearnFlow

set -e

# Configuration
NAMESPACE=${NAMESPACE:-learnflow}
KAFKA_POD=${KAFKA_POD:-kafka-0}
BROKER_LIST="${KAFKA_POD}.kafka-headless.${NAMESPACE}.svc.cluster.local:9092"

echo "================================"
echo "Creating LearnFlow Kafka Topics"
echo "================================"
echo "Broker: $BROKER_LIST"
echo "Namespace: $NAMESPACE"
echo ""

# Define LearnFlow topics
declare -a TOPICS=(
  "student-events:3:1"
  "exercise-submissions:3:1"
  "progress-updates:3:1"
  "chat-messages:3:1"
  "code-execution-results:3:1"
  "agent-responses:3:1"
  "system-events:3:1"
)

# Function to create topic
create_topic() {
  local topic_config=$1
  local topic_name=$(echo $topic_config | cut -d: -f1)
  local partitions=$(echo $topic_config | cut -d: -f2)
  local replication=$(echo $topic_config | cut -d: -f3)
  
  echo "Creating topic: $topic_name (partitions: $partitions, replication: $replication)..."
  
  kubectl exec -n $NAMESPACE $KAFKA_POD -- \
    kafka-topics.sh \
    --create \
    --bootstrap-server $BROKER_LIST \
    --topic $topic_name \
    --partitions $partitions \
    --replication-factor $replication \
    --if-not-exists
  
  echo "  ✓ Topic created/verified"
}

# Create all topics
for topic_config in "${TOPICS[@]}"; do
  create_topic "$topic_config"
done

echo ""
echo "Listing all topics:"
kubectl exec -n $NAMESPACE $KAFKA_POD -- \
  kafka-topics.sh \
  --list \
  --bootstrap-server $BROKER_LIST

echo ""
echo "✓ All LearnFlow topics created successfully!"
