from flask import request, jsonify
from flask_restful import Resource, reqparse
from app.questions_generator import QuestionsGenerator

class Questions(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('job_field', type=str, location='args', required=True)
    def get(self):
        # Get the job field from the request.
        # print request.args
        print("DEBUG: Questions get request: ",request)
        job_field = self.parser.parse_args().get('job_field')
        print("DEBUG: Questions get job_field:  ", job_field)

        # Get the list of questions for the given job field.
        questions = QuestionsGenerator.get_questions(job_field)

        # Return the list of questions.
        return jsonify(questions)


# @app.post('/field')
# def field():
#     global user_field
#     try:
#         user_field = request.json['field']
#         #TODO: check validation of field
#         questions = get_questions(user_field) 
#     except: 
#         questions = get_questions("default")
#     return jsonify(questions)

# @app.post('/interview')
# def question_video():
#     # get video and audio from request
#     #TODO: check validation of video and audio
#     video = request.files['video']
#     media.save(video, name=file.filename)
#     #TODO: process video and audio
#     #      and return that the video is recieved 
#     return jsonify({'status': 'success', 'message': 'Video processed successfully'})

# @app.get('/report')
# def report():
#     # TODO: get interview results in json format
#     return jsonify({'status': 'success', 'message': 'Report generated successfully'})