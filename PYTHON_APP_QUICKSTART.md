# Quick Start Guide - Python Learning App with Topics, Levels & Quizzes

## What's New

Your Python learning application now includes:
- ✅ **4 Skill Levels** (Beginner, Intermediate, Advanced, Expert)
- ✅ **20+ Python Topics** with learning objectives
- ✅ **15+ Exercises** with solutions and test cases
- ✅ **2 Quizzes** with multiple question types
- ✅ **Complete API** for managing all content

## Quick Setup

### 1. Navigate to Backend
```bash
cd e:\hackathon-03\backend
```

### 2. Install Dependencies (if needed)
```bash
pip install -r requirements.txt
```

### 3. Seed the Database with Python Content
```bash
python seed_python_content.py
```

Expected output:
```
Starting database seeding...
Seeding levels...
✓ Levels seeded
Seeding topics...
✓ Topics seeded
Seeding exercises...
✓ Exercises seeded
Seeding quizzes...
✓ Quizzes seeded

✓ Database seeding completed successfully!
```

### 4. Start the Application
```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Access the API
- **API Docs**: http://localhost:8000/docs
- **Redoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## Key Features

### Topics & Levels Management
- Browse all available skill levels
- Get topics by level
- View learning objectives for each topic
- Access learning resources

### Exercises
- 15+ structured exercises
- Progressive difficulty levels
- Starter code templates
- Expected outputs for validation
- Hints for guidance
- Complete solutions

### Quizzes
- Multiple choice questions
- True/false questions
- Short answer questions
- Automatic scoring
- Passing score tracking
- Detailed feedback

## Database Schema

The application uses these new database tables:

| Table | Purpose |
|-------|---------|
| `levels` | Skill levels (Beginner, Intermediate, etc.) |
| `topics` | Python topics with learning objectives |
| `quizzes` | Quiz definitions and metadata |
| `quiz_questions` | Individual questions within quizzes |
| `quiz_submissions` | Student quiz attempts |
| `quiz_answers` | Individual answers within submissions |

Existing tables updated:
- `exercises` - now linked to topics and levels

## API Examples

### Get All Levels
```bash
curl http://localhost:8000/api/topics/levels
```

### Get Beginner Topics
```bash
curl "http://localhost:8000/api/topics/?level_id=1"
```

### Get Quizzes for a Topic
```bash
curl "http://localhost:8000/api/quizzes/?topic_id=1&level_id=1"
```

### Start a Quiz
```bash
curl -X POST "http://localhost:8000/api/quizzes/1/start?student_id=1"
```

### Submit an Answer
```bash
curl -X POST "http://localhost:8000/api/quizzes/1/submissions/1/answer" \
  -H "Content-Type: application/json" \
  -d '{"question_id": 1, "answer_text": "8"}'
```

### Complete a Quiz
```bash
curl -X POST "http://localhost:8000/api/quizzes/1/submissions/1/complete"
```

## Python Curriculum

### Beginner Topics (Level 1)
1. Introduction to Python
2. Variables and Data Types
3. Operators and Expressions
4. Control Flow - If Statements
5. Loops - For and While
6. Lists and Indexing
7. Functions Basics
8. Strings and Text Processing
9. Dictionaries and Tuples
10. Input and Output

### Intermediate Topics (Level 2)
11. List Comprehensions
12. File Handling
13. Exception Handling
14. OOP Basics
15. Inheritance and Polymorphism
16. Modules and Packages
17. Lambda Functions and Map/Filter

### Advanced Topics (Level 3)
18. Decorators
19. Generators and Iterators
20. Regular Expressions

## Exercise Examples

Each exercise includes:
- Clear description of what to build
- Starter code template
- Expected output
- Test cases for validation
- Helpful hints
- Complete solution code

Example exercises:
- "Hello, World!" - First program
- "Create and Print Variables" - Basic variables
- "Simple Calculator" - Arithmetic operations
- "Check if Even or Odd" - If-else logic
- "List Comprehensions" - Advanced syntax
- "Class Inheritance" - OOP concepts

## Quiz Examples

### Python Basics Quiz
- 4 questions covering Python fundamentals
- Multiple choice and true/false questions
- Automatic grading
- 70% passing score
- 15 minute time limit

### Variables and Data Types Quiz
- 3 questions on data types
- Tests understanding of type conversion
- Variable reassignment concepts

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

### Database Issues
```bash
# Reset database (delete old one first)
rm backend/app/core/database.db  # or your database file
python seed_python_content.py
```

### Import Errors
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

## Next Steps

1. **Frontend Integration**: Create UI components for topics, exercises, and quizzes
2. **Exercise Submissions**: Students can submit and test their code
3. **Progress Tracking**: Monitor student learning journey
4. **Leaderboards**: Gamify with scoring and badges
5. **Analytics**: Dashboard for learning insights

## Documentation

For detailed API documentation, see:
- [PYTHON_LEARNING_GUIDE.md](PYTHON_LEARNING_GUIDE.md) - Comprehensive guide
- [README.md](README.md) - General backend documentation
- http://localhost:8000/docs - Interactive API documentation

## File Structure

```
backend/
├── main.py                          # FastAPI application entry point
├── seed_python_content.py           # Database seeding script
├── PYTHON_LEARNING_GUIDE.md         # Comprehensive guide
├── app/
│   ├── models/
│   │   └── models.py               # Database models (includes new Topic, Quiz models)
│   ├── schemas/
│   │   └── schemas.py              # Pydantic schemas (includes new schemas)
│   ├── routes/
│   │   ├── topics.py               # NEW - Topics and levels API
│   │   ├── quizzes.py              # NEW - Quizzes API
│   │   └── exercises.py            # Existing exercises API
│   └── services/
│       └── exercise_service.py     # Exercise business logic
└── pyproject.toml                  # Dependencies
```

## Support

For issues or questions:
1. Check the API documentation at `/docs`
2. Review the [PYTHON_LEARNING_GUIDE.md](PYTHON_LEARNING_GUIDE.md)
3. Check database logs for errors
4. Ensure all dependencies are installed

Happy learning! 🐍📚
