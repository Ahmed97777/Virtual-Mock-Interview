import cv2
import os
import subprocess
import multiprocessing
from app.video_analyzer_models.modules.facial_model import FacialModel
from app.video_analyzer_models.modules.voice_model import VoiceModel
from app import app

class VideoAnalyzer:
    @staticmethod
    def analyze_video(interview_id,video_id, DEBUG=False):

        voiceModel = VoiceModel()
                                       
        # using ffmpeg to get audio from the webm video in a parrallel subprocess
        # ffmpeg -i "video_id.webm" -q:a 0 -map a "video_id.wav"
        os.chdir(f'{app.config["UPLOAD_FOLDER"]}/{interview_id}')
        process1 = subprocess.call(['ffmpeg', '-i', video_id + '.webm', '-q:a', '0', '-map', 'a', video_id + '.wav'])
        
        print("DEBUG: Finished extracting audio from video {}".format(video_id))
        
        silentTimeStamps, speechTimeStamps, text, simpleFillerDictionary, complexFillerDictionary, mostCommonSimpleFiller, emotionList  = voiceModel.voiceModel(video_id , DEBUG)
        del voiceModel
        os.chdir(app.config['BASEDIR'])
        
        queue = multiprocessing.Queue()
        p1 = multiprocessing.Process(target=VideoAnalyzer.analyze_vid_process, args=(queue ,interview_id, video_id, DEBUG))
        p1.start()
        p1.join()
        result_dict = queue.get()
        

        os.chdir(f'{app.config["UPLOAD_FOLDER"]}/{interview_id}')
        # merge the audio and video files using ffmpeg
        # ffmpeg -i video_id.avi -i video_id.wav -c:v copy -c:a  aac  -map 0:v:0 -map 1:a:0 video_id.avi and say yes to overwrite the existing file
        process2 = subprocess.call(['ffmpeg', '-i', video_id + '.avi', '-i', video_id + '.wav', '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0', video_id + '-temp.avi'])
        # delete .avi original file and rename the -temp file to .avi
        os.remove(video_id + '.avi')
        os.rename(video_id + '-temp.avi', video_id + '.avi')
        # change the avi file to webm
        # ffmpeg -i video_id.avi -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis video_id.webm
        process3 = subprocess.call(['ffmpeg', '-i', video_id + '.avi', '-c:v', 'libvpx','-crf', '10','-b:v', '1M', '-c:a', 'libvorbis', video_id + '.webm'])
        os.chdir(app.config['BASEDIR'])

        #return iris_pos_per_frame, facial_emotion_per_frame, energy_per_frame, silentTimeStamps, speechTimeStamps, text, simpleFillerDictionary, complexFillerDictionary, mostCommonSimpleFiller, emotionList
        return result_dict

    @staticmethod
    def analyze_vid_process(queue ,interview_id, video_id, DEBUG):
        # load facial model here instead of init to utilize gpu usage
        facialModel = FacialModel()
        os.chdir(f'{app.config["UPLOAD_FOLDER"]}/{interview_id}')
        # using opencv library to process the video and send the frames to the facial model
        iris_pos_per_frame = []
        facial_emotion_per_frame = []
        energy_per_frame = []
        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        cap = cv2.VideoCapture(video_id + '.webm')
        # creating video writer to write the output video: the output video extension is avi so that ffmepeg can merge it later with the audio with no need for additional configurations
        output_video = cv2.VideoWriter(video_id+'.avi', fourcc, cap.get(cv2.CAP_PROP_FPS), frameSize = (int(cap.get(3)), int(cap.get(4))))
        while True:
            ret, frame = cap.read()
            if not ret:
                print("failed to grab frame")
                break
            
            # get the iris position and facial emotion for the current frame
            iris, emotion, energy, frame = facialModel.facialAnalysis(frame, True)
            iris_pos_per_frame.append(iris)
            facial_emotion_per_frame.append(emotion)
            energy_per_frame.append(energy)
            # display the resulted frame
            output_video.write(frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                 break
        cap.release()
        cv2.destroyAllWindows()
        # delete video_id.webm
        os.remove(video_id + '.webm')
        del facialModel
        os.chdir(app.config['BASEDIR'])
        result_dict = {
            'iris_pos_per_frame': iris_pos_per_frame,
            'facial_emotion_per_frame': facial_emotion_per_frame,
            'energy_per_frame': energy_per_frame
        } 
        queue.put(result_dict)




        
