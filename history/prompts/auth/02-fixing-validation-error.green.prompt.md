# PHR: Fixed Response Validation Error for user_id

- ID: 2
- TITLE: Fixed Response Validation Error for user_id
- STAGE: green
- DATE_ISO: 2026-01-21
- SURFACE: agent
- MODEL: antigravity
- FEATURE: auth
- BRANCH: main
- USER: pc
- COMMAND: uvicorn main:app
- LABELS: ["fix", "fastapi", "pydantic", "validation"]
- LINKS: SPEC/TICKET/ADR/PR: null
- FILES_YAML: 
  - backend/app/schemas/schemas.py
- TESTS_YAML: []
- PROMPT_TEXT: |
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ...
    fastapi.exceptions.ResponseValidationError: 1 validation errors:
      {'type': 'string_type', 'loc': ('response', 'user_id'), 'msg': 'Input should be a valid string', 'input': UUID('5f6a9f16-9cbe-43e7-8ce6-cbe5839b11ee')}
- RESPONSE_TEXT: |
    I identified that the `StudentResponse` schema was expecting `user_id` as a `str`, but the database model was returning a `UUID` object. I updated the schema to use the `UUID` type from the `uuid` module, which allows FastAPI/Pydantic to correctly serialize the response.
- OUTCOME: Resolved 500 Internal Server Error (ResponseValidationError) on registration.
