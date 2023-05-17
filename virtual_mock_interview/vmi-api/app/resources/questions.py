from flask import jsonify
from flask_restful import Resource, reqparse
from app.models import Question

class Questions(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('job_field', type=str, location='args', required=True)
        self.field = None
    def get(self):
        # Get the job field from the request.
        # print request.args
        job_field = self.parser.parse_args().get('job_field')
        
        non_tech_questions = Question.get_questions_by_field('non-technical', 2)
        tech_questions = Question.get_questions_by_field(job_field, 3)
        questions = non_tech_questions + tech_questions
        # Return the list of questions in json format.
        return jsonify([question.serialize() for question in questions])

