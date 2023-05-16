from flask import request, jsonify, session
from flask_restful import Resource, reqparse
from app.questions_generator import QuestionsGenerator

class Field(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('job_field', type=str, location='args', required=True)
        self.field = None
    def get(self):
        # Get the job field from the request.
        # print request.args
        print("DEBUG: Field get request: ",request)
        job_field = self.parser.parse_args().get('job_field')
        print("DEBUG: Field get job_field:  ", job_field)
        session['job_field'] = job_field

        # Return the list of questions.
        return jsonify({'Field recieved':job_field})


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