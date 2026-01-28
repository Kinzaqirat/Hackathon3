# LearnFlow Application

LearnFlow is an AI-powered educational platform that helps students learn programming concepts through interactive tutoring, code execution, and progress tracking.

## Overview

LearnFlow provides an intelligent learning environment where students can:
- Interact with AI tutors for conceptual explanations
- Write and execute code in a safe sandbox environment
- Receive personalized feedback and progress tracking
- Access teacher dashboards for monitoring and analytics

## Architecture

The LearnFlow application consists of:
- **Frontend**: Next.js application with student and teacher dashboards
- **AI Agents**: 6 specialized microservices (Triage, Concepts, Code Review, Debug, Exercise, Progress)
- **Infrastructure**: Kafka for event streaming, PostgreSQL for persistence
- **API Gateway**: Kong for routing and authentication

## Structure

```
frontend/               # Next.js frontend application
services/              # AI agent microservices
  ├── triage-agent/    # Routes queries to appropriate agents
  ├── concepts-agent/  # Explains programming concepts
  ├── code-review-agent/ # Reviews code quality
  ├── debug-agent/     # Helps debug code issues
  ├── exercise-agent/  # Generates coding exercises
  ├── progress-agent/  # Tracks learning progress
infrastructure/        # Kubernetes manifests and configurations
mcp-servers/           # Model Context Protocol servers
docs/                  # Documentation
scripts/               # Utility scripts
```

## Getting Started

The application can be deployed using the skills from the skills-library repository.