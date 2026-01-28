#!/usr/bin/env python3
"""
Generate Dapr component configuration for a service
"""

import argparse
import yaml
from pathlib import Path

def generate_dapr_config(service_name: str, output_file: str) -> bool:
    """Generate Dapr components configuration"""
    
    config = {
        "apiVersion": "dapr.io/v1alpha1",
        "kind": "Component",
        "metadata": {
            "name": f"{service_name}-statestore",
            "namespace": "learnflow"
        },
        "spec": {
            "type": "state.redis",
            "version": "v1",
            "metadata": [
                {"name": "redisHost", "value": "redis.learnflow.svc.cluster.local:6379"},
                {"name": "redisPassword", "value": ""},
                {"name": "actorStateStore", "value": "false"}
            ]
        }
    }
    
    pubsub_config = {
        "apiVersion": "dapr.io/v1alpha1",
        "kind": "Component",
        "metadata": {
            "name": f"{service_name}-pubsub",
            "namespace": "learnflow"
        },
        "spec": {
            "type": "pubsub.kafka",
            "version": "v1",
            "metadata": [
                {"name": "brokers", "value": "kafka.learnflow.svc.cluster.local:9092"},
                {"name": "consumerGroup", "value": service_name}
            ]
        }
    }
    
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w') as f:
        yaml.dump_all([config, pubsub_config], f)
    
    return True

def main():
    parser = argparse.ArgumentParser(description="Generate Dapr configuration")
    parser.add_argument("--service", required=True, help="Service name")
    parser.add_argument("--output", default="dapr/components.yaml", help="Output file")
    
    args = parser.parse_args()
    
    print(f"Generating Dapr configuration for {args.service}...")
    
    if generate_dapr_config(args.service, args.output):
        print(f"✓ Configuration saved to {args.output}")
        return 0
    else:
        print("✗ Failed to generate configuration")
        return 1

if __name__ == "__main__":
    import sys
    sys.exit(main())
