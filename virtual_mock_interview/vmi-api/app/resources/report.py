from flask_restful import Resource, reqparse
from app.report_generator.report_generator import ReportGenerator

class Report(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('interview_id', type=str, location='args', required=True)
        self.parser.add_argument('video_id', type=str, location='args', required=True)
    def get(self):
        # Get the interview id from the request.
        interview_id = self.parser.parse_args().get('interview_id')
        video_id = self.parser.parse_args().get('video_id')
        # Get the report.
        video_result = ReportGenerator.generate_report(interview_id, video_id)
        
        if video_result['msg'] != 'success':
            return {'status':video_result['msg']}, 404


        return {
            'status': 'success',
            'highlighted_text': video_result['highlighted_text'],
            'text': video_result['text'],
            'gpt_response': video_result['gpt_response'],
            'figures': ['{}_video_0.png'.format(video_id[1]),  # 1_video_0.png
                        '{}_video_1.png'.format(video_id[1]),
                        '{}_video_2.png'.format(video_id[1]),
                        '{}_video_3.png'.format(video_id[1]),
                        '{}_video_4.png'.format(video_id[1])
                        ],
            'video': '{}{}.mp4'.format(interview_id, video_id),
            'vtt': '{}{}.vtt'.format(interview_id,video_id),
        }, 200