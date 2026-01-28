# Docusaurus Deployment Reference

## Overview

Docusaurus is a static documentation site generator built with React. This skill helps generate, build, and deploy documentation for your projects.

## Generated Site Structure

```
docs-site/
├── docs/                  # Documentation markdown files
│   ├── intro.md
│   ├── getting-started/
│   └── api/
├── sidebars.ts            # Navigation structure
├── docusaurus.config.ts   # Site configuration
├── static/                # Static assets
└── build/                 # Generated HTML (ignored in git)
```

## Configuration

### docusaurus.config.ts
```typescript
export default {
  title: 'LearnFlow',
  tagline: 'AI-Powered Learning Platform',
  url: 'https://docs.learnflow.local',
  baseUrl: '/',
  organizationName: 'learnflow',
  projectName: 'learnflow-docs',
  
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'LearnFlow Docs',
      items: [
        { to: '/docs/intro', label: 'Getting Started' },
        { to: '/docs/api', label: 'API Reference' },
      ],
    },
  },
};
```

## Markdown Frontmatter

```markdown
---
title: Getting Started
sidebar_label: Getting Started
sidebar_position: 1
---

# Getting Started

Content here...
```

## Features

### Auto-Generated API Documentation
```python
# generate_docs.py can scan code and create docs
- Scan Python files for docstrings
- Extract function signatures
- Generate Markdown documentation
- Create API reference pages
```

### Search Integration
```typescript
// Docusaurus includes built-in search
// Algolia integration for production
```

### Versioning
```bash
# Generate new version
npm run docusaurus docs:version 1.0.0

# Manage versions in versioned_docs/
```

## Deployment

### Docker Build
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
RUN npm install -g http-server
CMD ["http-server", "build", "-p", "3000"]
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: learnflow-docs
  namespace: learnflow
spec:
  replicas: 2
  selector:
    matchLabels:
      app: learnflow-docs
  template:
    metadata:
      labels:
        app: learnflow-docs
    spec:
      containers:
      - name: docs
        image: learnflow/docs:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "50m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

## Content Types

### Guides
```markdown
---
title: How to Submit Code
sidebar_label: Submitting Code
---

Step-by-step guide...
```

### API Reference
```markdown
---
title: Chat API
---

## POST /chat

Description...

### Request
```json
{
  "message": "Hello"
}
```

### Response
```json
{
  "response": "Hi there!"
}
```
```

### Tutorials
```markdown
---
title: Building Your First Exercise
---

Tutorial content...
```

## Best Practices

1. **Organization**
   - Group related docs in folders
   - Use clear sidebar structure
   - Maintain consistent naming

2. **Content**
   - Use clear headings
   - Include code examples
   - Add diagrams for complex topics
   - Keep pages focused

3. **Maintenance**
   - Keep docs updated with code
   - Remove outdated content
   - Link related pages
   - Add revision dates

4. **Accessibility**
   - Use descriptive link text
   - Include alt text for images
   - Use proper heading hierarchy
   - Test with screen readers

## References

- [Docusaurus Documentation](https://docusaurus.io/)
- [Markdown Guide](https://www.markdownguide.org/)
