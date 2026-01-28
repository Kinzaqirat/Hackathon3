# PHR: Resolved Bcrypt and Registration Error

- ID: 1
- TITLE: Resolved Bcrypt and Registration Error
- STAGE: green
- DATE_ISO: 2026-01-21
- SURFACE: agent
- MODEL: antigravity
- FEATURE: auth
- BRANCH: main
- USER: pc
- COMMAND: uvicorn main:app
- LABELS: ["debug", "bcrypt", "fastapi", "resolved"]
- LINKS: SPEC/TICKET/ADR/PR: null
- FILES_YAML: 
  - backend/app/core/security.py
- TESTS_YAML: 
  - backend/test_auth_flow.py
- PROMPT_TEXT: |
    resolve this error "PS E:\hackathon-03\backend> uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ...
    AttributeError: module 'bcrypt' has no attribute '__about__'
    INFO:     127.0.0.1:58125 - "POST /api/auth/register HTTP/1.1" 400 Bad Request
    ..."
    [Update] remove hash password and add simple password if they cause error
- RESPONSE_TEXT: |
    I have resolved the issue by simplifying the password handling logic. I removed the `passlib` and `bcrypt` dependencies in `app/core/security.py` and implemented plain text password storage and comparison as requested. This fixed both the `AttributeError` and the `400 Bad Request` (which was caused by a `ValueError` from the failed hashing process). I verified the fix with a registration and login simulation.
- OUTCOME: Successfully simplified auth logic and restored functionality.
