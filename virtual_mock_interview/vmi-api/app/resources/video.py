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
        # self.parser.add_argument('video', type=FileStorage, location='files')
        self.parser.add_argument('question', type=str, location='form')
        self.parser.add_argument('interview_id', type=str, location='form')
        self.parser.add_argument('video_filename', type=str, location='form')

    
    def post(self):
        # # Get the video file from the request body.
        # if 'video' not in request.files:
        #     return "No video file found.", 400

        # # Check for secure file.
        # video_file = request.files["video"]
        # if not secure_filename(video_file.filename):
        #     return "Invalid file name.",  400


        # video_file = request.files["video"]
        # question = request.form.get('question')
        # if video_file and self.allowed_file(video_file.filename):
        #     video_filename = secure_filename(video_file.filename)
        #     interview_id = video_filename.split('_')[0]
        #     # get video id from the filename
        #     # create dir of user_id if not exist
        #     # if video contains 1_video then create dir of user id
        #     isFirstFile = re.search(r'1_video', video_filename)
        #     if isFirstFile:
        #         os.mkdir(app.config['UPLOAD_FOLDER']+ '/' + interview_id)
        #         os.mkdir(app.config['DOWNLOAD_FOLDER']+ '/' + interview_id)
        #     # save video to the dir of interview_id even if we are in it
        #     if os.getcwd().split('/')[-1] == interview_id:
        #         video_file.save(video_filename)
        #     else:
        #         video_file.save(app.config['UPLOAD_FOLDER'] + '/'+ interview_id + '/' + video_filename)
            
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