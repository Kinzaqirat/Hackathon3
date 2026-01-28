import { authenticatedJsonFetch, API_BASE_URL } from './api-utils';

export async function fetchStats(studentId: number) {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/analytics/student/${studentId}/stats`);
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        // Use different mock data based on student ID for personalization
        const mockData = {
            1: {
                total_xp: 1250,
                completed_exercises: 12,
                total_exercises: 20,
                passed_quizzes: 3,
                total_quizzes: 5,
                average_score: 85,
                total_time_spent_minutes: 320
            },
            2: {
                total_xp: 850,
                completed_exercises: 8,
                total_exercises: 20,
                passed_quizzes: 1,
                total_quizzes: 5,
                average_score: 72,
                total_time_spent_minutes: 180
            },
            3: {
                total_xp: 1850,
                completed_exercises: 18,
                total_exercises: 20,
                passed_quizzes: 4,
                total_quizzes: 5,
                average_score: 92,
                total_time_spent_minutes: 450
            }
        };

        return mockData[studentId as keyof typeof mockData] || mockData[1];
    }
}

export async function fetchProgress(studentId: number) {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/analytics/student/${studentId}/progress`);
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return {
            overall_completion: 60,
            current_streak: 5,
            weekly_goals: { completed: 4, total: 7 }
        };
    }
}

export async function fetchExercises() {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/exercises`);
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return [
            {
                id: 1,
                title: "Hello, World!",
                description: "Write a Python program that prints 'Hello, World!' to the console.",
                difficulty_level: "easy",
                topic: "Introduction to Python",
                starter_code: "# Write your first Python program\n# Print a greeting message\nprint('Hello, World!')",
                expected_output: "Hello, World!"
            },
            {
                id: 2,
                title: "Create and Print Variables",
                description: "Create variables for name, age, and city, then print them.",
                difficulty_level: "easy",
                topic: "Variables and Data Types",
                starter_code: "# Create variables\nname = 'John'\nage = 25\ncity = 'New York'\n\n# Print variables\n",
                expected_output: "Name: John, Age: 25, City: New York"
            },
            {
                id: 3,
                title: "Simple Calculator",
                description: "Create a calculator that adds two numbers.",
                difficulty_level: "easy",
                topic: "Operators and Expressions",
                starter_code: "# Read two numbers\nnum1 = 10\nnum2 = 5\n\n# Add them\n",
                expected_output: "Sum: 15.0"
            }
        ];
    }
}

export async function fetchExercise(id: string | number) {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/exercises/${id}`);
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        // Match the mock data to the exercise ID to ensure consistency with dashboard
        const exerciseId = typeof id === 'string' ? parseInt(id) : id;

        switch(exerciseId) {
            case 1:
                return {
                    id: 1,
                    title: "Hello, World!",
                    description: "Write a Python program that prints 'Hello, World!' to the console. This is your first Python program and introduces you to basic syntax.",
                    difficulty_level: "beginner",
                    topic: "Introduction to Python",
                    starter_code: "# Write your first Python program\n# Print a greeting message\nprint('Hello, World!')",
                    expected_output: "Hello, World!",
                    hints: [
                        "Use the print() function to display output",
                        "Remember to use quotes for string literals",
                        "Python uses indentation for code blocks"
                    ]
                };
            case 2:
                return {
                    id: 2,
                    title: "Variables and Data Types",
                    description: "Create variables for name, age, and city, then print them. Learn about different data types in Python.",
                    difficulty_level: "beginner",
                    topic: "Variables and Data Types",
                    starter_code: "# Create variables\nname = 'John'\nage = 25\ncity = 'New York'\n\n# Print variables\nprint(f'Name: {name}, Age: {age}, City: {city}')",
                    expected_output: "Name: John, Age: 25, City: New York",
                    hints: [
                        "Use meaningful variable names",
                        "F-strings allow embedding variables in strings",
                        "Different data types: str, int, float, bool"
                    ]
                };
            case 3:
                return {
                    id: 3,
                    title: "Simple Calculator",
                    description: "Create a calculator that adds two numbers. Learn about user input and basic arithmetic operations.",
                    difficulty_level: "beginner",
                    topic: "Operators and Expressions",
                    starter_code: "# Read two numbers\nnum1 = float(input('Enter first number: '))\nnum2 = float(input('Enter second number: '))\n\n# Add them\nresult = num1 + num2\nprint(f'Sum: {result}')",
                    expected_output: "Sum: 15.0",
                    hints: [
                        "Use input() to get user input",
                        "Convert string input to number with int() or float()",
                        "Use the + operator for addition"
                    ]
                };
            default:
                return {
                    id: exerciseId,
                    title: "Sample Exercise",
                    description: "This is a sample exercise for demonstration purposes. The backend may not be running or properly configured.",
                    difficulty_level: "easy",
                    topic: "Python Basics",
                    starter_code: "# Write your Python code here\n\nprint('Hello LearnFlow!')\n# Try different Python concepts\n# like variables, loops, or functions",
                    expected_output: "Hello LearnFlow!",
                    hints: [
                        "Remember to use proper Python syntax",
                        "Use the print() function to display output",
                        "Check for proper indentation",
                        "Refer to Python documentation for help"
                    ]
                };
        }
    }
}

export async function fetchLevels() {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/topics/levels`);
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return [
            { id: 1, name: "Beginner", description: "Start your Python journey with fundamentals", order: 1 },
            { id: 2, name: "Intermediate", description: "Build more complex applications", order: 2 },
            { id: 3, name: "Advanced", description: "Master advanced Python concepts", order: 3 },
            { id: 4, name: "Expert", description: "Become a Python expert", order: 4 }
        ];
    }
}

export async function fetchTopics(levelId?: number) {
    try {
        const url = levelId ? `${API_BASE_URL}/topics/?level_id=${levelId}` : `${API_BASE_URL}/topics/`;
        const response = await authenticatedJsonFetch(url);
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return [
            { id: 1, name: "Introduction to Python", description: "Learn what Python is and set up your environment", level_id: 1 },
            { id: 2, name: "Variables and Data Types", description: "Master variables, strings, numbers, and boolean types", level_id: 1 },
            { id: 3, name: "Operators and Expressions", description: "Learn arithmetic, comparison, logical, and assignment operators", level_id: 1 },
            { id: 4, name: "Control Flow - If Statements", description: "Make decisions with if, elif, and else statements", level_id: 1 },
            { id: 5, name: "Loops - For and While", description: "Repeat code with for and while loops", level_id: 1 }
        ];
    }
}

export async function fetchQuizzes(topicId?: number, levelId?: number) {
    try {
        let url = `${API_BASE_URL}/quizzes/`;
        const params = new URLSearchParams();
        if (topicId) params.append("topic_id", topicId.toString());
        if (levelId) params.append("level_id", levelId.toString());
        if (params.toString()) url += `?${params.toString()}`;

        const response = await authenticatedJsonFetch(url);
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return [
            {
                id: 1,
                title: "Python Basics Quiz",
                description: "Test your knowledge of Python fundamentals",
                questions: [
                    { id: 1, question_text: "What is the output of print(5 + 3)?", question_type: "multiple_choice", options: ["8", "5", "3", "Error"], correct_answer: "8" },
                    { id: 2, question_text: "Which of the following is a valid variable name in Python?", question_type: "multiple_choice", options: ["2var", "var_name", "var-name", "var name"], correct_answer: "var_name" }
                ]
            },
            {
                id: 2,
                title: "Variables and Data Types Quiz",
                description: "Test your knowledge of Python variables and types",
                questions: [
                    { id: 1, question_text: "What is the data type of x = 5?", question_type: "multiple_choice", options: ["int", "float", "str", "bool"], correct_answer: "int" }
                ]
            }
        ];
    }
}

export async function createChatSession(studentId: number, topic?: string, agentType: string = "general") {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/chat/sessions/?student_id=${studentId}&topic=${topic || ''}&agent_type=${agentType}`, {
            method: "POST",
        });
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return {
            id: 1,
            student_id: studentId,
            topic: topic || "general",
            agent_type: agentType,
            is_active: true,
            created_at: new Date().toISOString()
        };
    }
}

export async function fetchChatMessages(sessionId: number) {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/chat/sessions/${sessionId}/messages`);
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return [
            {
                id: 1,
                session_id: sessionId,
                role: "assistant",
                content: "Hello! I'm your LearnFlow AI Assistant. How can I help you with your studies today?",
                created_at: new Date().toISOString()
            }
        ];
    }
}

export async function sendChatMessage(sessionId: number, content: string) {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/chat/sessions/${sessionId}/messages`, {
            method: "POST",
            body: JSON.stringify({
                session_id: sessionId,  // Include session_id in body as expected by backend schema
                role: "user",           // Include role as expected by backend schema
                content: content,
                message_metadata: {}    // Include optional field as expected by backend schema
            }),
        });
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return {
            id: Date.now(),
            session_id: sessionId,
            role: "user",
            content: content,
            created_at: new Date().toISOString()
        };
    }
}

// Quiz API functions
export async function startQuiz(quizId: number, studentId: number) {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/quizzes/${quizId}/start?student_id=${studentId}`, {
            method: "POST",
        });
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return {
            id: 1,
            student_id: studentId,
            quiz_id: quizId,
            started_at: new Date().toISOString(),
            completed_at: null,
            score: null,
            passed: null
        };
    }
}

export async function submitQuizAnswer(quizId: number, submissionId: number, questionId: number, answer: string) {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/quizzes/${quizId}/submissions/${submissionId}/answer`, {
            method: "POST",
            body: JSON.stringify({ question_id: questionId, answer_text: answer }),
        });
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return {
            id: Date.now(),
            submission_id: submissionId,
            question_id: questionId,
            answer_text: answer,
            is_correct: false,
            points_earned: 0
        };
    }
}

export async function completeQuiz(quizId: number, submissionId: number) {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/quizzes/${quizId}/submissions/${submissionId}/complete`, {
            method: "POST",
        });
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return {
            id: submissionId,
            student_id: 1,
            quiz_id: quizId,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            score: 85,
            passed: true
        };
    }
}

export async function getQuizSubmission(quizId: number, submissionId: number) {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/quizzes/${quizId}/submissions/${submissionId}`);
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return {
            id: submissionId,
            student_id: 1,
            quiz_id: quizId,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            score: 85,
            passed: true
        };
    }
}

// Teacher-specific API functions
export async function fetchStudents() {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/analytics/students`);
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return [
            { id: 1, name: "Alice Johnson", email: "alice@example.com", grade_level: "Grade 12", exercises_completed: 15, quizzes_passed: 3, last_active: "2 hours ago" },
            { id: 2, name: "Bob Smith", email: "bob@example.com", grade_level: "Grade 11", exercises_completed: 8, quizzes_passed: 1, last_active: "1 day ago" },
            { id: 3, name: "Carol Davis", email: "carol@example.com", grade_level: "Grade 12", exercises_completed: 22, quizzes_passed: 5, last_active: "30 mins ago" },
            { id: 4, name: "David Wilson", email: "david@example.com", grade_level: "Grade 10", exercises_completed: 5, quizzes_passed: 0, last_active: "2 days ago" },
        ];
    }
}

export async function fetchStudentProgress(studentId: number) {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/analytics/student/${studentId}/progress`);
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return {
            overall_completion: 60,
            current_streak: 5,
            weekly_goals: { completed: 4, total: 7 },
            exercises_completed: 12,
            quizzes_taken: 3,
            average_score: 85
        };
    }
}

export async function fetchTeacherQuizzes() {
    try {
        const response = await authenticatedJsonFetch(`${API_BASE_URL}/quizzes/teacher`);
        return response;
    } catch (error) {
        console.warn("API call failed (this is expected if backend is not running):", error);
        // Return mock data for development when backend is not available
        return [
            { id: 1, title: "Python Basics Quiz", student_count: 24, completed_count: 18, avg_score: 78 },
            { id: 2, title: "Variables and Types", student_count: 24, completed_count: 15, avg_score: 82 },
            { id: 3, title: "Control Flow", student_count: 24, completed_count: 12, avg_score: 75 },
        ];
    }
}
