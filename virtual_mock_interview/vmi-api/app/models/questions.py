from app import db
from sqlalchemy import func

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    question_text = db.Column(db.String(255), unique=False)
    field = db.Column(db.String(125), unique=False)
    category = db.Column(db.String(125), unique=False)
    difficulty = db.Column(db.String(125), unique=False)

    # get question by id
    @classmethod
    def get_question_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    # query questions by field
    @classmethod
    def get_questions_by_field(cls, field, limit):
        # query random questions by the given field
        return cls.query.filter_by(field=field).order_by(func.random()).limit(limit).all()
    

    def __repr__(self):
        return '<Question:{}:{},   Field: {},  category: {},  difficulty: {}>'.format(self.id, self.question_text, self.field, self.category, self.difficulty)
