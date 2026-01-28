# PHR: Debugging Bcrypt and Registration Error

- ID: 1
- TITLE: Debugging Bcrypt and Registration Error
- STAGE: red
- DATE_ISO: 2026-01-21
- SURFACE: agent
- MODEL: antigravity
- FEATURE: auth
- BRANCH: main
- USER: pc
- COMMAND: uvicorn main:app
- LABELS: ["debug", "bcrypt", "fastapi"]
- LINKS: SPEC/TICKET/ADR/PR: null
- FILES_YAML: 
  - backend/app/core/security.py
- TESTS_YAML: 
  - backend/test_bcrypt.py
- PROMPT_TEXT: |
    resolve this error "PS E:\hackathon-03\backend> uvicorn main:app --reload --host 0.0.0.0 --port 8000
    INFO:     Will watch for changes in these directories: ['E:\\hackathon-03\\backend']
    INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
    INFO:     Started reloader process [6352] using WatchFiles
    INFO:     Started server process [11232]
    INFO:     Waiting for application startup.                                                       
    INFO:main:Starting LearnFlow API...
    INFO:app.core.database:Creating database tables...
    INFO:app.core.database:Database tables created successfully
    INFO:main:Database initialized
    INFO:     Application startup complete.
    INFO:     127.0.0.1:58118 - "GET /docs HTTP/1.1" 200 OK
    INFO:     127.0.0.1:58118 - "GET /openapi.json HTTP/1.1" 200 OK
    WARNING:passlib.handlers.bcrypt:(trapped) error reading bcrypt version
    Traceback (most recent call last):
      File "C:\Users\pc\AppData\Local\Programs\Python\Python314\Lib\site-packages\passlib\handlers\bcrypt.py", line 620, in _load_backend_mixin
        version = _bcrypt.__about__.__version__
                  ^^^^^^^^^^^^^^^^^
    AttributeError: module 'bcrypt' has no attribute '__about__'
    INFO:     127.0.0.1:58125 - "POST /api/auth/register HTTP/1.1" 400 Bad Request
    INFO:     Shutting down
    INFO:     Waiting for application shutdown.
    INFO:main:Shutting down LearnFlow API...
    INFO:main:Kafka producer closed"
- RESPONSE_TEXT: |
    I identified the issue as a compatibility problem between `passlib` and newer versions of `bcrypt`. I've proposed a monkeypatch in `app/core/security.py` to fix the `AttributeError` and am investigating if the `400 Bad Request` is related to this or a separate validation issue.
- OUTCOME: Investigating and preparing fix.
