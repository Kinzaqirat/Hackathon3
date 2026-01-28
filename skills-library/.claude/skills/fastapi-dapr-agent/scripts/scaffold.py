#!/usr/bin/env python3
"""
Scaffold a new FastAPI + Dapr + OpenAI Agent service
"""

import argparse
import json
import shutil
from pathlib import Path
from datetime import datetime

def create_service_structure(service_name: str, output_dir: str) -> bool:
    """Create the complete service directory structure"""
    
    base_dir = Path(output_dir)
    base_dir.mkdir(parents=True, exist_ok=True)
    
    # Create subdirectories
    (base_dir / "app").mkdir(exist_ok=True)
    (base_dir / "k8s").mkdir(exist_ok=True)
    (base_dir / "dapr").mkdir(exist_ok=True)
    
    print(f"✓ Created directory structure in {output_dir}")
    return True

def get_template_content(template_name: str, service_name: str) -> str:
    """Get template content and replace placeholders"""
    
    template_dir = Path(__file__).parent.parent / "templates"
    template_file = template_dir / f"{template_name}.template"
    
    if not template_file.exists():
        print(f"Warning: Template {template_file} not found")
        return ""
    
    content = template_file.read_text()
    
    # Replace placeholders
    service_display_name = service_name.replace("-", " ").title()
    
    replacements = {
        "{{SERVICE_NAME}}": service_name,
        "{{SERVICE_DISPLAY_NAME}}": service_display_name,
        "{{TIMESTAMP}}": datetime.now().isoformat(),
    }
    
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    return content

def create_files(service_name: str, base_dir: Path) -> bool:
    """Create all required files for the service"""
    
    files_to_create = {
        "app/main.py": get_template_content("main.py", service_name),
        "app/agent.py": get_template_content("agent.py", service_name),
        "Dockerfile": get_template_content("Dockerfile", service_name),
        "k8s/deployment.yaml": get_template_content("k8s-deployment.yaml", service_name),
        "dapr/components.yaml": get_template_content("dapr-components.yaml", service_name),
        "requirements.txt": get_requirements(),
        "README.md": get_readme(service_name),
    }
    
    for file_path, content in files_to_create.items():
        full_path = base_dir / file_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_text(content)
        print(f"✓ Created {file_path}")
    
    return True

def get_requirements() -> str:
    """Get Python requirements for the service"""
    return """fastapi==0.95.0
uvicorn==0.21.0
pydantic==1.10.7
httpx==0.23.3
openai==0.27.2
dapr==1.10.0
python-dotenv==1.0.0
pytest==7.3.1
"""

def get_readme(service_name: str) -> str:
    """Generate README for the service"""
    display_name = service_name.replace("-", " ").title()
    
    return f"""# {display_name} Service

## Overview

The {display_name} service is an AI agent microservice built with FastAPI, Dapr, and OpenAI Agents SDK.

## Architecture

- **Framework**: FastAPI 0.95+
- **Agent Framework**: OpenAI Agents SDK
- **Service Mesh**: Dapr (state management, pub/sub)
- **Container**: Docker/Kubernetes
- **Language**: Python 3.10+

## Local Development

### Requirements
- Python 3.10+
- Dapr CLI
- Docker (for deployment)

### Setup
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
```

### Running Locally
```bash
# With Dapr
dapr run --app-id {service_name} --app-port 8000 -- uvicorn app.main:app --reload

# Without Dapr (simple testing)
uvicorn app.main:app --reload --port 8000
```

### Testing
```bash
pytest
```

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Agent Endpoints
- `POST /chat` - Send message to agent
- `GET /status` - Get agent status

## Configuration

### Environment Variables
- `OPENAI_API_KEY` - OpenAI API key (required)
- `DAPR_HOST` - Dapr sidecar host (default: localhost)
- `DAPR_PORT` - Dapr sidecar port (default: 3500)
- `SERVICE_NAME` - Service identifier (default: {service_name})

### Dapr Components
The service uses:
- **State Store**: Redis (configurable)
- **Pub/Sub**: Kafka (configurable)

## Deployment

### Build Docker Image
```bash
docker build -t learnflow/{service_name}:latest .
docker push learnflow/{service_name}:latest
```

### Deploy to Kubernetes
```bash
kubectl apply -f dapr/components.yaml
kubectl apply -f k8s/deployment.yaml
```

### Verify Deployment
```bash
kubectl get pods -l app={service_name}
kubectl logs -l app={service_name}
```

## Monitoring

### Check Logs
```bash
kubectl logs -f deployment/{service_name}
```

### Check Health
```bash
kubectl port-forward svc/{service_name} 8000:8000
curl http://localhost:8000/health
```

## Contributing

See the parent LearnFlow documentation for contribution guidelines.
"""

def main():
    parser = argparse.ArgumentParser(description="Scaffold a new FastAPI + Dapr + Agent service")
    parser.add_argument("--name", required=True, help="Service name (e.g., concepts-agent)")
    parser.add_argument("--output", required=True, help="Output directory")
    
    args = parser.parse_args()
    
    print("=" * 50)
    print(f"Scaffolding {args.name} Service")
    print("=" * 50)
    print()
    
    base_dir = Path(args.output)
    
    # Create structure
    if not create_service_structure(args.name, args.output):
        return 1
    
    # Create files
    if not create_files(args.name, base_dir):
        return 1
    
    print()
    print("✓ Service scaffolded successfully!")
    print()
    print("Next steps:")
    print(f"1. Edit app/agent.py to add your OpenAI prompts and tools")
    print(f"2. Edit app/main.py to add service-specific endpoints")
    print(f"3. Run locally: dapr run --app-id {args.name} --app-port 8000 -- uvicorn app.main:app")
    print()
    
    return 0

if __name__ == "__main__":
    import sys
    sys.exit(main())
