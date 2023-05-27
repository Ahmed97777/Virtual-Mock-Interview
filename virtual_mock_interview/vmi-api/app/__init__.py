from flask import Flask
from flask_cors import CORS
from config import Config
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
api = Api(app)
cors = CORS(app)


from app import models
from app import resources
from app import serializers
from app import errors
from app.utils.video_queue_manager import VideoQueueManager
from app.video_analyzer_models.video_analyzer import VideoAnalyzer
video_queue_manager = VideoQueueManager(VideoAnalyzer)

# Add the video queue manager to the app config.
app.config['video_queue_manager'] = video_queue_manager

