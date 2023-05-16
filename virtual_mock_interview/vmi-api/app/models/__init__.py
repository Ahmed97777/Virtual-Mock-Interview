from app import app, db 
from .questions import Question

with app.app_context():
    db.create_all()
