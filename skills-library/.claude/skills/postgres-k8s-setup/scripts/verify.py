#!/usr/bin/env python3
"""
Verify PostgreSQL deployment and database health
"""

import subprocess
import sys
import json
from typing import Dict, Optional

def run_command(cmd: list, namespace: str = "learnflow") -> Optional[str]:
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
        return None
    except Exception as e:
        print(f"Error running command: {e}")
        return None

def check_pod_status(namespace: str = "learnflow") -> Dict[str, any]:
    """Check PostgreSQL pod status"""
    print("Checking PostgreSQL pod status...")
    
    output = run_command(["get", "pods", "-l", "app.kubernetes.io/name=postgresql", "-o", "json"], namespace)
    
    if not output:
        return {"status": "error", "message": "Could not retrieve pod status"}
    
    try:
        pods_data = json.loads(output)
        pods = pods_data.get("items", [])
        
        if not pods:
            return {"status": "error", "message": "No PostgreSQL pods found"}
        
        pod = pods[0]
        phase = pod["status"].get("phase", "Unknown")
        
        return {
            "status": "success" if phase == "Running" else "warning",
            "pod_name": pod["metadata"]["name"],
            "phase": phase,
            "ready": phase == "Running"
        }
    except Exception as e:
        return {"status": "error", "message": f"Error parsing pod data: {e}"}

def check_database_connection(namespace: str = "learnflow") -> Dict[str, any]:
    """Check database connection and tables"""
    print("Checking database connection...")
    
    # Get pod name
    output = run_command(
        ["get", "pods", "-l", "app.kubernetes.io/name=postgresql", 
         "-o", "jsonpath={.items[0].metadata.name}"],
        namespace
    )
    
    if not output:
        return {"status": "error", "message": "PostgreSQL pod not found"}
    
    pod_name = output
    
    # Check tables
    sql_check = "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
    
    try:
        result = subprocess.run(
            ["kubectl", "exec", "-n", namespace, pod_name,
             "psql", "-U", "postgres", "-d", "learnflow", "-c", sql_check],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            # Count tables
            tables = [line.strip() for line in result.stdout.split('\n') 
                     if line.strip() and line.strip() not in ('table_name', '---', '(0 rows)')]
            
            return {
                "status": "success" if len(tables) > 0 else "warning",
                "connected": True,
                "tables_found": len(tables),
                "tables": tables[:5]  # Show first 5
            }
        else:
            return {"status": "error", "message": "Database connection failed"}
    except Exception as e:
        return {"status": "error", "message": f"Error checking database: {e}"}

def check_pvc_status(namespace: str = "learnflow") -> Dict[str, any]:
    """Check persistent volume claim status"""
    print("Checking persistent volume status...")
    
    output = run_command(["get", "pvc", "-l", "app.kubernetes.io/name=postgresql", "-o", "json"], namespace)
    
    if not output:
        return {"status": "error", "message": "No PVC found"}
    
    try:
        pvc_data = json.loads(output)
        pvcs = pvc_data.get("items", [])
        
        if not pvcs:
            return {"status": "warning", "message": "No PVC found"}
        
        pvc = pvcs[0]
        phase = pvc["status"].get("phase", "Unknown")
        
        return {
            "status": "success" if phase == "Bound" else "warning",
            "phase": phase,
            "storage": pvc["spec"]["resources"]["requests"]["storage"]
        }
    except Exception as e:
        return {"status": "error", "message": f"Error parsing PVC data: {e}"}

def main():
    namespace = "learnflow"
    
    print("=" * 50)
    print("PostgreSQL Deployment Verification")
    print("=" * 50)
    print()
    
    # Check pod status
    pod_status = check_pod_status(namespace)
    print(f"Pod Status: {pod_status['status'].upper()}")
    if pod_status.get('pod_name'):
        print(f"  Pod: {pod_status['pod_name']}")
        print(f"  Phase: {pod_status.get('phase', 'Unknown')}")
    if pod_status.get('message'):
        print(f"  {pod_status['message']}")
    print()
    
    # Check PVC status
    pvc_status = check_pvc_status(namespace)
    print(f"Storage Status: {pvc_status['status'].upper()}")
    if pvc_status.get('phase'):
        print(f"  Phase: {pvc_status['phase']}")
    if pvc_status.get('storage'):
        print(f"  Storage: {pvc_status['storage']}")
    print()
    
    # Check database
    if pod_status.get('ready'):
        db_status = check_database_connection(namespace)
        print(f"Database Status: {db_status['status'].upper()}")
        if db_status.get('connected'):
            print(f"  Tables: {db_status.get('tables_found', 0)}")
            if db_status.get('tables'):
                for table in db_status['tables']:
                    print(f"    ✓ {table}")
        if db_status.get('message'):
            print(f"  {db_status['message']}")
    
    print()
    
    # Final verdict
    if pod_status.get('ready') and pvc_status['status'] != 'error':
        print("✓ PostgreSQL is healthy and ready for use!")
        return 0
    else:
        print("✗ PostgreSQL has issues. Check the details above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
