from flask import Flask
from flask_cors import CORS
from config import Config
from flask_restful import Api

app = Flask(__name__)
app.config.from_object(Config)

api = Api(app)

cors = CORS(app)

from app import resources
from app import serializers
from app import errors