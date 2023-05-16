from flask import request, jsonify, session
from flask_restful import Resource, reqparse
from app import db

class Questions(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
    def get(self):
        # Get the job field from the request.
        # print request.args
        print("DEBUG: Questions get request: ",request)
        
        # Get the list of questions for the given job field.
        
        non_tech_questions = db.Question.get_questions_by_field('non-tech', 2)
        tech_questions = db.Question.get_questions_by_field(session.get('job_field', None), 3)
        questions = non_tech_questions + tech_questions

        # Return the list of questions.
        return jsonify(questions)

