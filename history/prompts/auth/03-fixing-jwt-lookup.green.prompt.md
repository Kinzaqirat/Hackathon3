# PHR: Fixed User Profile Lookup and JWT Claims

- ID: 3
- TITLE: Fixed User Profile Lookup and JWT Claims
- STAGE: green
- DATE_ISO: 2026-01-21
- SURFACE: agent
- MODEL: antigravity
- FEATURE: auth
- BRANCH: main
- USER: pc
- COMMAND: uvicorn main:app
- LABELS: ["fix", "jwt", "auth"]
- LINKS: SPEC/TICKET/ADR/PR: null
- FILES_YAML: 
  - backend/app/services/auth_service.py
- TESTS_YAML: 
  - backend/test_api.py
- PROMPT_TEXT: |
    Continue (Debugging 500 error in /api/auth/me)
- RESPONSE_TEXT: |
    I identified that the `/api/auth/me` endpoint was failing because the JWT token contained the student's UUID in the `sub` claim, while the route tried to parse it as an integer to look up the student by their primary key. I updated `AuthService.login_student` to use the integer `id` in the `sub` claim, ensuring consistency with the lookup logic.
- OUTCOME: Resolved 500 Internal Server Error in `/api/auth/me`.
