from flask import request, jsonify
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from flask_restful import Resource, reqparse
from app import app
import os
import re

ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'}

class Video(Resource):
    
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('video', type=FileStorage, location='files')


        # Check for secure file.
        video_file = request.files["video"]
        if not secure_filename(video_file.filename):
            return 400, "Invalid file name."

    def post(self):
        # Get the video file from the request body.
        if 'video' not in request.files:
            return 400, "No video file found."
        video_file = request.files["video"]
        if video_file and self.allowed_file(video_file.filename):
            video_filename = secure_filename(video_file.filename)
            interview_id = video_filename.split('_')[0]
            # get video id from the filename
            # create dir of user_id if not exist
            # if video contains 1_video then create dir of user id
            isFirstFile = re.search(r'1_video', video_filename)
            if isFirstFile is not None:
                os.mkdir(app.config['UPLOAD_FOLDER']+ '/' + interview_id)
            # save video to the dir of interview_id even if we are in it
            if os.getcwd().split('/')[-1] == interview_id:
                video_file.save(video_filename)
            else:
                video_file.save(app.config['UPLOAD_FOLDER'] + '/'+ interview_id + '/' + video_filename)
            

            # Analyze the video asynchronously.
            video_id = video_filename.split('.')[0]
            app.config['video_queue_manager'].add_video(interview_id, video_id)

            # Return the video analysis results.
            return jsonify({'msg': ' video {} added to queue'.format(video_id)})
        else:
            # Release the lock if the video is invalid
            video_queue_manager.processing_lock.release()
            return 400, "Invalid file format."  
        
    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS