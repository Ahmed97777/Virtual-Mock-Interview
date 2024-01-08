import os
from dotenv import load_dotenv

load_dotenv('.flaskenv')    # loads environment variables from .flaskenv, Edit it to your needs before running the app
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    CORS_HEADERS = 'Content-Type'
    CORS_ORIGINS = '*' # '*' means all origins
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    FLASK_DEBUG = os.environ.get('FLASK_DEBUG') or False
    BASEDIR = basedir
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER') or 'uploads'
    DOWNLOAD_FOLDER = os.environ.get('DOWNLOAD_FOLDER') or 'downloads'
    FACIAL_CONFIG = 'app/video_analyzer_models/config.ini'
    VOICE_MODEL_PKL = 'app/video_analyzer_models/models/speech_emotion_analysis.pkl'
    SQLALCHEMY_DATABASE_URI = ("mysql+pymysql://"+ os.environ['DB_USER'] + ":" + os.environ['DB_PASSWORD']+ "@" + os.environ['DB_HOST'] + ":3306/" + os.environ['DB_NAME'] )
    ORG = os.environ.get('ORG')
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    