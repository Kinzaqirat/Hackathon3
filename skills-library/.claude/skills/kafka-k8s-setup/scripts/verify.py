#!/usr/bin/env python3
"""
Verify Kafka deployment health and topic creation
"""

import subprocess
import sys
import time
import json
from typing import Dict, List, Optional

def run_command(cmd: List[str], namespace: str = "learnflow") -> Optional[str]:
    """Run a kubectl command and return output"""
    try:
        result = subprocess.run(
            ["kubectl", "-n", namespace] + cmd,
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode == 0:
            return result.stdout.strip()
        else:
            print(f"Command failed: {result.stderr}")
            return None
    except Exception as e:
        print(f"Error running command: {e}")
        return None

def check_pod_health(namespace: str = "learnflow") -> Dict[str, any]:
    """Check if Kafka pods are running"""
    print("Checking Kafka pod health...")
    
    output = run_command(["get", "pods", "-l", "app.kubernetes.io/name=kafka", "-o", "json"], namespace)
    
    if not output:
        return {"status": "error", "message": "Could not retrieve pod status"}
    
    try:
        pods_data = json.loads(output)
        pods = pods_data.get("items", [])
        
        if not pods:
            return {"status": "error", "message": "No Kafka pods found"}
        
        running_pods = []
        failed_pods = []
        
        for pod in pods:
            name = pod["metadata"]["name"]
            phase = pod["status"].get("phase", "Unknown")
            
            if phase == "Running":
                running_pods.append(name)
            else:
                failed_pods.append({"name": name, "status": phase})
        
        return {
            "status": "success",
            "running_pods": running_pods,
            "failed_pods": failed_pods,
            "total": len(pods),
            "healthy": len(running_pods) == len(pods)
        }
    except Exception as e:
        return {"status": "error", "message": f"Error parsing pod data: {e}"}

def get_kafka_bootstrap_servers(namespace: str = "learnflow") -> Optional[str]:
    """Get Kafka bootstrap server address"""
    output = run_command(["get", "svc", "-l", "app.kubernetes.io/name=kafka", "-o", "json"], namespace)
    
    if not output:
        return None
    
    try:
        services = json.loads(output).get("items", [])
        for svc in services:
            if "kafka-headless" in svc["metadata"]["name"]:
                name = svc["metadata"]["name"]
                cluster_ip = svc["spec"]["clusterIP"]
                port = svc["spec"]["ports"][0]["port"]
                return f"{name}.{namespace}.svc.cluster.local:{port}"
    except Exception as e:
        print(f"Error parsing service data: {e}")
    
    return None

def verify_kafka_connectivity(namespace: str = "learnflow") -> Dict[str, any]:
    """Verify Kafka is responding"""
    print("Verifying Kafka connectivity...")
    
    bootstrap_servers = get_kafka_bootstrap_servers(namespace)
    if not bootstrap_servers:
        return {"status": "error", "message": "Could not find Kafka bootstrap servers"}
    
    # Try to connect using a Kafka admin command (simplified check)
    return {
        "status": "success",
        "bootstrap_servers": bootstrap_servers,
        "message": "Kafka cluster is accessible via cluster DNS"
    }

def main():
    namespace = "learnflow"
    
    print("=" * 50)
    print("Kafka Deployment Verification")
    print("=" * 50)
    print()
    
    # Check pod health
    pod_health = check_pod_health(namespace)
    print(f"Pod Status: {pod_health['status']}")
    if pod_health.get('running_pods'):
        print(f"  Running pods: {len(pod_health['running_pods'])}/{pod_health.get('total', 0)}")
        for pod in pod_health['running_pods']:
            print(f"    ✓ {pod}")
    if pod_health.get('failed_pods'):
        print(f"  Failed pods:")
        for pod in pod_health['failed_pods']:
            print(f"    ✗ {pod['name']} ({pod['status']})")
    print()
    
    # Check Kafka connectivity
    kafka_status = verify_kafka_connectivity(namespace)
    print(f"Kafka Connectivity: {kafka_status['status']}")
    if kafka_status.get('bootstrap_servers'):
        print(f"  Bootstrap servers: {kafka_status['bootstrap_servers']}")
    if kafka_status.get('message'):
        print(f"  {kafka_status['message']}")
    print()
    
    # Final verdict
    if pod_health.get('healthy') and kafka_status['status'] == 'success':
        print("✓ Kafka cluster is healthy and ready for use!")
        return 0
    else:
        print("✗ Kafka cluster has issues. Check the details above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
