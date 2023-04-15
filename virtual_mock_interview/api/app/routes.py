from app import app
from flask import request, jsonify
from werkzeug.utils import secure_filename


user_field = ""

@app.get('/')
@app.get('/index')
def index():
    return "server connected!"

@app.get('/configuration')
def configuration():
    return "configuration page: success!"

@app.post('/field')
def field():
    global user_field
    user_field = request.json['field']
    #TODO: check validation of field
    #TODO: get questions from DB using the field and return them
    return jsonify({"field recieved from frontend": user_field})

@app.get('/example_case')
def example_case():
    return "example case: success!"

@app.post('/interview')
def question_video():
    # get video and audio from request
    #TODO: check validation of video and audio
    video = request.files['video']
    media.save(video, name=file.filename)
    #TODO: process video and audio
    #      and return that the video is recieved 
    return jsonify({'status': 'success', 'message': 'Video processed successfully'})

@app.get('/report')
def report():
    # TODO: get interview results in json format
    return jsonify({'status': 'success', 'message': 'Report generated successfully'})