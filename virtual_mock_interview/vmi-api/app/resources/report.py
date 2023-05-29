from flask import jsonify
from flask_restful import Resource, reqparse
# from report_generator import ReportGenerator
class Report:
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('interview_id', type=str, location='args', required=True)
    def get(self):
        pass