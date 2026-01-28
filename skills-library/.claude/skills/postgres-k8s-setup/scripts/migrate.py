#!/usr/bin/env python3
"""
Run database migrations and initialize LearnFlow schema
"""

import subprocess
import sys
import time
import os
from typing import Optional
from pathlib import Path

def get_pod_name(namespace: str = "learnflow", app: str = "postgresql") -> Optional[str]:
    """Get PostgreSQL pod name"""
    try:
        result = subprocess.run(
            ["kubectl", "get", "pods", "-n", namespace, 
             "-l", f"app.kubernetes.io/name={app}", 
             "-o", "jsonpath={.items[0].metadata.name}"],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode == 0 and result.stdout:
            return result.stdout.strip()
    except Exception as e:
        print(f"Error getting pod name: {e}")
    return None

def wait_for_postgres(namespace: str = "learnflow", timeout: int = 120) -> bool:
    """Wait for PostgreSQL to be ready"""
    print("Waiting for PostgreSQL to be ready...")
    
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            result = subprocess.run(
                ["kubectl", "get", "pods", "-n", namespace,
                 "-l", "app.kubernetes.io/name=postgresql",
                 "-o", "jsonpath={.items[0].status.phase}"],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0 and result.stdout.strip() == "Running":
                print("✓ PostgreSQL pod is Running")
                return True
        except Exception as e:
            pass
        
        time.sleep(5)
    
    print("✗ PostgreSQL failed to start in time")
    return False

def run_sql_script(sql_content: str, pod_name: str, namespace: str = "learnflow") -> bool:
    """Execute SQL script in PostgreSQL pod"""
    try:
        # Write SQL to temp file
        temp_file = "/tmp/migrate.sql"
        
        # Use kubectl exec with stdin
        process = subprocess.Popen(
            ["kubectl", "exec", "-i", "-n", namespace, pod_name, 
             "psql", "-U", "postgres"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate(input=sql_content, timeout=60)
        
        if process.returncode != 0:
            print(f"SQL execution failed:\n{stderr}")
            return False
        
        return True
    except Exception as e:
        print(f"Error executing SQL: {e}")
        return False

def get_schema_sql() -> str:
    """Get the LearnFlow database schema SQL"""
    return """
-- Create learnflow database
CREATE DATABASE learnflow;
\\c learnflow;

-- Students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    grade_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercises table
CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(50),
    topic VARCHAR(100),
    starter_code TEXT,
    test_cases JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise Submissions table
CREATE TABLE exercise_submissions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    exercise_id INTEGER NOT NULL REFERENCES exercises(id),
    code TEXT NOT NULL,
    status VARCHAR(50),
    score INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Progress table
CREATE TABLE progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    exercise_id INTEGER NOT NULL REFERENCES exercises(id),
    status VARCHAR(50),
    attempts INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Sessions table
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    topic VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);

-- Chat Messages table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES chat_sessions(id),
    role VARCHAR(50),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Code Execution Results table
CREATE TABLE code_execution_results (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES exercise_submissions(id),
    execution_result JSON,
    passed BOOLEAN,
    duration_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Events table
CREATE TABLE system_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100),
    component VARCHAR(100),
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_exercises_topic ON exercises(topic);
CREATE INDEX idx_submissions_student ON exercise_submissions(student_id);
CREATE INDEX idx_submissions_exercise ON exercise_submissions(exercise_id);
CREATE INDEX idx_progress_student ON progress(student_id);
CREATE INDEX idx_chat_sessions_student ON chat_sessions(student_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_execution_results_submission ON code_execution_results(submission_id);
CREATE INDEX idx_system_events_type ON system_events(event_type);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
"""

def main():
    namespace = "learnflow"
    
    print("=" * 50)
    print("PostgreSQL Database Migration")
    print("=" * 50)
    print()
    
    # Wait for PostgreSQL to be ready
    if not wait_for_postgres(namespace):
        return 1
    
    time.sleep(10)  # Additional wait for pod startup
    
    # Get pod name
    pod_name = get_pod_name(namespace)
    if not pod_name:
        print("ERROR: Could not find PostgreSQL pod")
        return 1
    print(f"PostgreSQL pod: {pod_name}")
    
    # Run schema migrations
    print("Applying LearnFlow schema...")
    schema_sql = get_schema_sql()
    
    if run_sql_script(schema_sql, pod_name, namespace):
        print("✓ Schema migrations applied successfully")
    else:
        print("✗ Schema migrations failed")
        return 1
    
    print()
    print("✓ Database initialization complete!")
    return 0

if __name__ == "__main__":
    sys.exit(main())
