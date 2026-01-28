from app.core.database import SessionLocal
from app.models.models import Exercise, Topic, Level
from datetime import datetime, timedelta

def verify_data():
    db = SessionLocal()
    try:
        # Check if we have exercises
        exercises = db.query(Exercise).all()
        print(f"Total exercises in DB: {len(exercises)}")
        
        # Add a new exercise to test 'New' badge
        if not db.query(Exercise).filter(Exercise.title == "Test New Exercise").first():
            # Need a topic and level
            level = db.query(Level).first()
            topic = db.query(Topic).first()
            if level and topic:
                new_exercise = Exercise(
                    title="Test New Exercise",
                    description="Testing the new badge",
                    difficulty_level="easy",
                    topic=topic.name,
                    topic_id=topic.id,
                    level_id=level.id,
                    created_at=datetime.utcnow()
                )
                db.add(new_exercise)
                db.commit()
                print("Added a new exercise for verification.")
            else:
                print("Could not find topic or level to add test exercise.")
        
    finally:
        db.close()

if __name__ == "__main__":
    verify_data()
