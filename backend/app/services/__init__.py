"""
Initialize services module
"""

from app.services.auth_service import AuthService
from app.services.exercise_service import ExerciseService, SubmissionService, ProgressService
from app.services.chat_service import ChatService
from app.services.kafka_service import KafkaService
from app.services.ai_service import AIService

__all__ = [
    "AuthService",
    "ExerciseService",
    "SubmissionService",
    "ProgressService",
    "ChatService",
    "KafkaService",
    "AIService",
]
