from flask import request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from flask_restful import Resource, reqparse
from app import app
import re
import os

ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'}

class Video(Resource):
    
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('question', type=str, location='form')
        self.parser.add_argument('interview_id', type=str, location='form')
        self.parser.add_argument('video_filename', type=str, location='form')
    
    def post(self):

        args = self.parser.parse_args()
        print(args)
        interview_id = args['interview_id']

        video_filename = args['video_filename']
        question = args['question']
        if secure_filename(video_filename) and self.allowed_file(video_filename):
            # pass video to the queue to be processed.
            video_id = video_filename.split('.')[0]
            app.config['video_queue_manager'].add_video(interview_id, video_id, question)

            # Return video is being processed .
            return ' video {} added to queue'.format(video_id), 200
        else:
            return "Invalid file name.",  400
        
        
    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS