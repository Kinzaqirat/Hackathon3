# LearnFlow - Professional Python Learning Platform

A comprehensive Python learning application with interactive exercises, quizzes, and AI-powered assistance.

## ✨ Features

### 📚 Interactive Lessons
- Structured curriculum from beginner to expert level
- 20+ Python topics covering fundamentals to advanced concepts
- Learning objectives and resources for each topic
- Progress tracking and analytics

### 💻 Code Editor
- Full-featured Python code editor with Monaco Editor
- Syntax highlighting and auto-completion
- Run and test code directly in the browser
- Copy, download, and save functionality
- Keyboard shortcuts (Ctrl+Enter to run)

### 🧠 AI Assistant
- Intelligent chatbot for learning support
- Different agent types (general, concepts, debugging, exercise help)
- Real-time responses and explanations
- Context-aware conversations

### 📝 Exercise System
- 15+ hands-on Python exercises
- Starter code templates
- Solution verification and hints
- Progressive difficulty levels
- XP reward system

### 🎯 Quiz System
- Multiple question types (MCQ, True/False, Short Answer)
- Timed quizzes with time limits
- Automatic grading and feedback
- Passing scores and certificates
- Shuffle questions for fairness

### 📊 Progress Tracking
- Detailed analytics and statistics
- XP points and achievements
- Learning streaks and milestones
- Performance metrics and insights

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Code Editor**: Monaco Editor React

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.10+
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI Integration**: Google Gemini API
- **Message Queue**: Apache Kafka
- **Authentication**: JWT tokens

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL
- Docker (optional, for Kafka)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd learnflow
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# backend/.env
DATABASE_URL=postgresql://username:password@localhost/dbname
GEMINI_API_KEY=your_gemini_api_key
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
```

5. Start the backend:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

6. Start the frontend:
```bash
cd frontend
npm run dev
```

7. Seed the database with learning content:
```bash
cd backend
python seed_python_content.py
```

## 📁 Project Structure

```
learnflow/
├── backend/
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── core/           # Configuration and database
│   ├── main.py             # Application entry point
│   └── seed_python_content.py  # Data seeding script
├── frontend/
│   ├── app/               # Next.js pages
│   ├── components/        # Reusable UI components
│   ├── lib/              # Utilities and API functions
│   └── public/           # Static assets
└── README.md
```

## 🎯 Learning Paths

### Beginner Level
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

### Intermediate Level
11. List Comprehensions
12. File Handling
13. Exception Handling
14. Object-Oriented Programming Basics
15. Inheritance and Polymorphism
16. Working with Modules and Packages
17. Lambda Functions and Map/Filter

### Advanced Level
18. Decorators
19. Generators and Iterators
20. Regular Expressions

## 🔧 API Endpoints

### Topics Management
- `GET /api/topics/levels` - Get all skill levels
- `GET /api/topics/` - Get all topics
- `GET /api/topics/{topic_id}` - Get specific topic

### Exercises
- `GET /api/exercises/` - Get all exercises
- `GET /api/exercises/{id}` - Get specific exercise
- `POST /api/exercises/submit/{id}` - Submit exercise solution

### Quizzes
- `GET /api/quizzes/` - Get all quizzes
- `POST /api/quizzes/{quiz_id}/start` - Start a quiz
- `POST /api/quizzes/{quiz_id}/submissions/{submission_id}/answer` - Submit answer
- `POST /api/quizzes/{quiz_id}/submissions/{submission_id}/complete` - Complete quiz

### Chat
- `POST /api/chat/sessions/` - Create chat session
- `POST /api/chat/sessions/{session_id}/messages` - Send message
- `GET /api/chat/sessions/{session_id}/messages` - Get messages

## 🤖 AI Assistant Capabilities

The AI assistant supports multiple agent types:
- **General**: General learning support and guidance
- **Concepts**: Deep explanations of Python concepts
- **Debug**: Code debugging and troubleshooting
- **Exercise**: Step-by-step exercise assistance

## 📊 Analytics & Progress

Track your learning progress with:
- Total XP earned
- Exercises completed
- Quizzes passed
- Current learning streak
- Weekly activity
- Performance trends

## 🧪 Testing

Run the validation suite to test all components:
```bash
# Navigate to the validation page in the app
http://localhost:3000/test-validation
```

## 🚀 Deployment

For production deployment:
1. Build the frontend: `npm run build`
2. Configure environment variables
3. Set up PostgreSQL database
4. Deploy backend and frontend separately
5. Configure reverse proxy (nginx/Apache)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

Made with ❤️ for Python learners everywhere!