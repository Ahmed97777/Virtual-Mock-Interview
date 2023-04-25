from flask import request, jsonify
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from flask_restful import Resource, reqparse
from app.video_analyzer import VideoAnlyzer
from app import app
import os

ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'}

class Video(Resource):
    
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('video', type=FileStorage, location='files')

        # Check for secure file.
        video_file = request.files["video"]
        print("DEBUG: Video file: ", video_file)
        if not secure_filename(video_file.filename):
            return 400, "Invalid file name."

    def post(self):
        # Get the video file from the request body.
        if 'video' not in request.files:
            return 400, "No video file found."
        video_file = request.files["video"]
        if video_file and self.allowed_file(video_file.filename):
            video_filename = secure_filename(video_file.filename)
            video_file.save(os.path.join(app.config['UPLOAD_FOLDER'], video_filename))

        # Analyze the video.
        analysis = VideoAnlyzer.analyze_video(video_filename)

        # Return the video analysis results.
        return jsonify(analysis)
        
    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    