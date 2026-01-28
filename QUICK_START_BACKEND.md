# 🚀 LearnFlow Backend - Quick Start

## ⚡ Start in 30 Seconds

### 1. Open Terminal in `backend` folder
```bash
cd backend
```

### 2. Run Setup Script
**Windows:**
```cmd
setup.bat
```

**Linux/Mac:**
```bash
bash setup.sh
```

### 3. Edit Configuration
```bash
# Copy template
cp .env.example .env

# Edit .env with your values:
# DATABASE_URL=postgresql://...
# KAFKA_BOOTSTRAP_SERVERS=...
# OPENAI_API_KEY=sk-...
# SECRET_KEY=<generate-with-openssl-rand-hex-32>
```

### 4. Start Server
```bash
python -m uvicorn main:app --reload
```

### 5. Access
- 🌐 **API**: http://localhost:8000
- 📖 **Swagger Docs**: http://localhost:8000/docs
- 📄 **ReDoc**: http://localhost:8000/redoc

---

## 📚 Documentation

All documentation is in the `backend/` folder:

| File | Purpose |
|------|---------|
| `README.md` | Quick reference |
| `BACKEND_GUIDE.md` | Detailed guide with examples |
| `IMPLEMENTATION_SUMMARY.md` | Feature checklist |
| `STATUS.md` | Completion status |
| `FILES_CREATED.md` | File tree and structure |

---

## 🧪 Run Tests

```bash
pytest tests/                    # All tests
pytest tests/ --cov=app         # With coverage
pytest tests/test_auth.py -v    # Specific file
```

---

## 📝 Example Requests

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"student@example.com",
    "name":"Student Name",
    "password":"password123",
    "grade_level":10
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"student@example.com",
    "password":"password123"
  }'
```

### Create Exercise
```bash
curl -X POST http://localhost:8000/api/exercises/ \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Hello World",
    "description":"Print Hello World",
    "difficulty_level":"beginner",
    "topic":"python",
    "starter_code":"print()",
    "expected_output":"Hello World",
    "test_cases":[{"input":"","output":"Hello World"}]
  }'
```

---

## ✨ Features

✅ User authentication (JWT)  
✅ Exercise management  
✅ Code submissions  
✅ Progress tracking  
✅ AI chatbot (OpenAI)  
✅ Real-time events (Kafka)  
✅ Analytics & leaderboards  
✅ WebSocket support  

---

## 🗄️ Database

**8 Tables:**
- students (user accounts)
- exercises (learning content)
- exercise_submissions (code submissions)
- code_execution_results (execution logs)
- progress (learning progress)
- chat_sessions (chat records)
- chat_messages (messages)
- system_events (audit logs)

---

## 📡 API Endpoints (25)

| Category | Count |
|----------|-------|
| Authentication | 4 |
| Exercises | 5 |
| Submissions | 5 |
| Chat | 6 |
| Analytics | 4 |
| Health | 1 |
| **Total** | **25** |

---

## 🔧 Environment Variables

Create `.env` file with:
```
APP_HOST=0.0.0.0
APP_PORT=8000
DATABASE_URL=postgresql://user:pass@localhost/learnflow
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
OPENAI_API_KEY=sk-your-key
SECRET_KEY=your-secret-key-32-chars
```

---

## 📦 Dependencies

16 packages pre-configured:
- FastAPI & Uvicorn
- SQLAlchemy & Psycopg2
- Pydantic & Validation
- JWT & Password Security
- Kafka & OpenAI
- Pytest & Testing

All managed in `pyproject.toml`

---

## ✅ Status

- ✅ All 25 endpoints implemented
- ✅ All 8 database tables created
- ✅ Test suite ready
- ✅ Documentation complete
- ✅ Production ready

---

## 🎯 For Frontend

Backend is ready for Next.js integration:

1. Use endpoints from `/api/*`
2. Send JWT token in Authorization header
3. Handle WebSocket for chat
4. Check `/docs` for full API reference

---

## 📞 Need Help?

1. Check `BACKEND_GUIDE.md` for detailed guide
2. Visit http://localhost:8000/docs for API docs
3. Review test files for usage examples
4. Check error messages for debugging

---

**🚀 Backend Ready - Start Developing!**

```bash
cd backend
python -m uvicorn main:app --reload
```
