import cv2
from app import app

class VideoAnlyzer:
    @staticmethod
    def analyze_video(video_filename):
        # Creating a VideoCapture object to read the video
        cap = cv2.VideoCapture(app.config['UPLOAD_FOLDER'] + '/' + video_filename)
        while(cap.isOpened()):
            ret, frame = cap.read()
            if ret == False:
                break
            cv2.imshow('frame',frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        cap.release()
        cv2.destroyAllWindows()
        return {'video': 'analyzed'}
