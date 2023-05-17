from .video import Video
from .questions import Questions
from app import api

api.add_resource(Questions, '/questions')
api.add_resource(Video, '/video')