import requests
from flask import Flask, send_from_directory, request
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os


file_server = Flask(__name__)
cors = CORS(file_server)

UPLOADS_DIR = 'uploads'
DOWNLOADS_DIR = 'downloads'

#save file to uploads folder
@file_server.route('/file/<folder_id>', methods=['POST'])
def save_file(folder_id):
    # Get the video file from the request body.
    if 'file' not in request.files:
        return "No file found.", 400

        # Check for secure file.
    file = request.files["file"]
    if not secure_filename(file.filename):
        return "Invalid file name.",  400
    #save file to its folder_id folder inside uploads folder 
    input_path = os.path.join(UPLOADS_DIR, str(folder_id))
    output_path = os.path.join(DOWNLOADS_DIR, str(folder_id))
    os.makedirs(input_path, exist_ok=True)
    os.makedirs(output_path, exist_ok=True)
    file.save(os.path.join(input_path, file.filename))
    # make http request to the backend with port 5000 to process the video given interview_id, video_id, and questions[currentQuestionIndex].
    interview_id = request.form.get('interview_id')
    question = request.form.get('question')
    video_filename = request.form.get('video_filename')
    request_url = 'http://localhost:5000/video'
    request_data = {
        'interview_id': interview_id,
        'video_filename': video_filename,
        'question': question
    }
    try:
        requests.post(request_url, data=request_data)
    except Exception as e:
        return 'error in sending video to the backend', 500

    return 'file uploaded successfully'

@file_server.route('/file/<folder_id>/<filename>')
def serve_file(folder_id,filename):
    output_path = os.path.join(DOWNLOADS_DIR, str(folder_id))
    # if file not exist return 404
    if not os.path.isfile(os.path.join(output_path, filename)):
        return 'file not found', 404
    return send_from_directory(output_path, filename)


if __name__ == '__main__':
    file_server.run(port=8000, debug=True)
