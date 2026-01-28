# FastAPI + Dapr + OpenAI Agents Reference

## Overview

This skill provides a complete scaffolding system for creating AI agent microservices using FastAPI, Dapr, and OpenAI's Agents SDK. It handles all boilerplate code, allowing you to focus on agent logic.

## Architecture

```
┌─────────────────────────────────────┐
│      Kubernetes Deployment          │
│  ┌───────────────────────────────┐  │
│  │  {{SERVICE_NAME}} Pod         │  │
│  │  ┌──────────────────────────┐ │  │
│  │  │ FastAPI Container        │ │  │
│  │  │  Port 8000               │ │  │
│  │  │  - /health (health)      │ │  │
│  │  │  - /ready (readiness)    │ │  │
│  │  │  - /chat (agent)         │ │  │
│  │  │  - /status (status)      │ │  │
│  │  └──────────────────────────┘ │  │
│  │  ┌──────────────────────────┐ │  │
│  │  │ Dapr Sidecar             │ │  │
│  │  │  Port 3500               │ │  │
│  │  │  - State Management      │ │  │
│  │  │  - Pub/Sub (Kafka)       │ │  │
│  │  └──────────────────────────┘ │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
       │              │
       ├──────────────┴─────────────────┐
       │                                 │
   Redis (State)                    Kafka (Events)
```

## Generated Service Structure

```
my-agent/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   └── agent.py             # OpenAI Agent logic
├── k8s/
│   └── deployment.yaml      # Kubernetes manifest
├── dapr/
│   └── components.yaml      # Dapr configuration
├── requirements.txt         # Python dependencies
├── Dockerfile               # Container image
└── README.md               # Service documentation
```

## Scaffolding

### Basic Usage
```bash
python scripts/scaffold.py \
  --name concepts-agent \
  --output services/concepts-agent
```

### What Gets Created
1. **FastAPI Application** (`app/main.py`)
   - Health check endpoint
   - Chat endpoint for agent communication
   - Status endpoint for monitoring
   - Kubernetes readiness/liveness probes

2. **Agent Class** (`app/agent.py`)
   - OpenAI Agents SDK integration
   - Message processing logic
   - Session management
   - State management via Dapr

3. **Docker Configuration**
   - Multi-stage build for optimization
   - Health check configured
   - Environment variables set up

4. **Kubernetes Deployment**
   - 2 replicas by default
   - Resource requests/limits configured
   - Dapr sidecar annotation
   - Service creation

5. **Dapr Components**
   - Redis state store configuration
   - Kafka pub/sub configuration

## Customization Guide

### 1. Add Agent Tools

Edit `app/agent.py`:

```python
TOOLS = [
    {
        "name": "get_exercise",
        "description": "Get an exercise by ID",
        "parameters": {
            "type": "object",
            "properties": {
                "exercise_id": {"type": "string"}
            }
        }
    },
    {
        "name": "submit_code",
        "description": "Submit code for evaluation",
        "parameters": {
            "type": "object",
            "properties": {
                "code": {"type": "string"},
                "language": {"type": "string"}
            }
        }
    }
]

async def handle_tool_call(tool_name: str, params: dict):
    """Route tool calls to handlers"""
    if tool_name == "get_exercise":
        return await get_exercise(params["exercise_id"])
    elif tool_name == "submit_code":
        return await submit_code(params["code"], params["language"])
```

### 2. Update System Prompt

Edit `app/agent.py`:

```python
SYSTEM_PROMPT = """
You are the Concepts Agent for LearnFlow.
Your role is to help students understand programming concepts.

You have access to:
- Exercise database
- Code execution environment
- Student progress history

Guidelines:
- Explain concepts clearly with examples
- Ask clarifying questions
- Encourage exploration
- Track student progress
"""
```

### 3. Add Service Endpoints

Edit `app/main.py`:

```python
@app.post("/exercise/{exercise_id}")
async def get_exercise(exercise_id: int):
    """Get specific exercise details"""
    # Query database
    # Return formatted response
    pass

@app.post("/submit")
async def submit_solution(request: SubmitRequest):
    """Process code submission"""
    # Validate code
    # Run tests
    # Store results
    pass
```

### 4. Configure Dapr Components

Edit `dapr/components.yaml`:

```yaml
metadata:
- name: redisHost
  value: "redis.learnflow.svc.cluster.local:6379"
- name: consumerGroup
  value: "concepts-agent-group"
```

## OpenAI Agents SDK Integration

### Basic Agent Setup
```python
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def process_message(user_id: str, message: str):
    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": message}
        ],
        tools=TOOLS,
        tool_choice="auto"
    )
    
    return handle_response(response)
```

### Tool Use Pattern
```python
if response.tool_calls:
    for tool_call in response.tool_calls:
        tool_name = tool_call.function.name
        tool_args = json.loads(tool_call.function.arguments)
        
        tool_result = await handle_tool_call(tool_name, tool_args)
        
        # Continue conversation with tool result
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(tool_result)
        })
```

## Dapr State Management

### Store State
```python
import dapr.client

client = dapr.client.DaprClient()

# Store session state
await client.save_state(
    store_name="{{SERVICE_NAME}}-statestore",
    key=f"session_{session_id}",
    value={"context": [...], "history": [...]}
)
```

### Retrieve State
```python
# Get session state
response = await client.get_state(
    store_name="{{SERVICE_NAME}}-statestore",
    key=f"session_{session_id}"
)
state = json.loads(response.data)
```

## Dapr Pub/Sub

### Publish Events
```python
# Send response event
await client.publish_event(
    pub_sub_name="{{SERVICE_NAME}}-pubsub",
    topic_name="agent-responses",
    data={
        "session_id": session_id,
        "response": response_text,
        "timestamp": datetime.utcnow().isoformat()
    }
)
```

### Subscribe to Events
```python
# Subscribe to exercise submissions
@client.subscribe_event(
    pub_sub_name="{{SERVICE_NAME}}-pubsub",
    topic_name="exercise-submissions"
)
async def on_exercise_submitted(event: dict):
    """Process submitted exercise"""
    # Handle submission
    pass
```

## Deployment

### Build Docker Image
```bash
docker build -t learnflow/{{SERVICE_NAME}}:1.0 .
docker push learnflow/{{SERVICE_NAME}}:1.0
```

### Deploy to Kubernetes
```bash
# Apply Dapr components
kubectl apply -f dapr/components.yaml

# Deploy service
kubectl apply -f k8s/deployment.yaml

# Verify
kubectl get pods -l app={{SERVICE_NAME}}
kubectl logs -f deployment/{{SERVICE_NAME}}
```

### Port Forward (Testing)
```bash
kubectl port-forward svc/{{SERVICE_NAME}} 8000:8000
curl http://localhost:8000/health
```

## Monitoring and Debugging

### Check Service Logs
```bash
kubectl logs -f deployment/{{SERVICE_NAME}} -n learnflow
```

### Check Dapr Sidecar Logs
```bash
kubectl logs -f deployment/{{SERVICE_NAME}} -c daprd -n learnflow
```

### Test Agent Locally
```bash
# Start with Dapr
dapr run --app-id {{SERVICE_NAME}} --app-port 8000 \
  -- uvicorn app.main:app --reload

# In another terminal
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user1", "message": "Hello"}'
```

### Performance Monitoring
```bash
# Get service metrics
kubectl top pods -l app={{SERVICE_NAME}} -n learnflow

# Check resource usage
kubectl describe pods -l app={{SERVICE_NAME}} -n learnflow
```

## Testing

### Unit Tests
```python
# tests/test_agent.py
import pytest
from app.agent import Agent

@pytest.mark.asyncio
async def test_process_message():
    agent = Agent("test-service")
    response = await agent.process_message(
        user_id="test_user",
        message="Hello agent"
    )
    assert "message" in response
    assert response["user_id"] == "test_user"
```

### Integration Tests
```bash
# With Dapr running
pytest tests/integration/

# Check agent response
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test", "message": "test message"}'
```

## Best Practices

### 1. Error Handling
- Wrap agent calls in try-catch
- Return meaningful error messages
- Log errors with context

### 2. Session Management
- Generate unique session IDs
- Store session context in Dapr state
- Clean up old sessions

### 3. Resource Management
- Set appropriate memory/CPU limits
- Use replicas for high availability
- Implement proper shutdown handlers

### 4. Security
- Store API keys in Kubernetes secrets
- Use TLS for service communication
- Validate user inputs

### 5. Observability
- Log all agent interactions
- Include trace IDs in requests
- Use structured logging (JSON)

## Troubleshooting

### Pod Won't Start
1. Check image exists: `docker images | grep {{SERVICE_NAME}}`
2. Check logs: `kubectl logs deployment/{{SERVICE_NAME}}`
3. Check resources: `kubectl describe pod {{SERVICE_NAME}}-xxx`

### Agent Not Responding
1. Verify OpenAI API key is set
2. Check Dapr sidecar is running: `kubectl get pods`
3. Test endpoint: `curl http://localhost:8000/health`

### High Memory Usage
1. Check for memory leaks in agent
2. Verify Dapr state store is accessible
3. Reduce replica count and monitor

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenAI Agents SDK](https://platform.openai.com/docs/agents/)
- [Dapr Documentation](https://docs.dapr.io/)
- [Kubernetes Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
