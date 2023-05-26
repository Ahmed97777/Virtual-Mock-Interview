import cv2
import os
import subprocess
from app import app
from app.video_analyzer_models.modules.facial_model import FacialModel
from app.video_analyzer_models.modules.voice_model import VoiceModel

class VideoAnlyzer:
    @staticmethod
    def analyze_video(user_id,video_id, DEBUG=False):

        currentDirectory =  os.getcwd()
        distinationDirectory =app.config['UPLOAD_FOLDER']+'/'+ user_id
        os.chdir(distinationDirectory)                                                                              
        # using ffmpeg to get audio from the webm video in a parrallel subprocess
        # ffmpeg -i "video_id.webm" -q:a 0 -map a "video_id.wav"
        process1 = subprocess.call(['ffmpeg', '-i', video_id + '.webm', '-q:a', '0', '-map', 'a', video_id + '.wav'])
        voiceModel = VoiceModel()
        silentTimeStamps, speechTimeStamps, text, simpleFillerDictionary, complexFillerDictionary, mostCommonSimpleFiller, emotionList  = voiceModel.voiceModel(video_id , DEBUG)
        # load facial model here instead of init to utilize gpu usage
        facialModel = FacialModel()
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
            iris, emotion, energy, frame = facialModel.facialAnalysis(frame, DEBUG)
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
        
        # merge the audio and video files using ffmpeg
        # ffmpeg -i video_id.avi -i video_id.wav -c:v copy -c:a  aac  -map 0:v:0 -map 1:a:0 video_id.avi and say yes to overwrite the existing file
        process2 = subprocess.call(['ffmpeg', '-i', video_id + '.avi', '-i', video_id + '.wav', '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0', video_id + '-temp.avi'])

        # delete .avi original file and rename the -temp file to .avi
        os.remove(video_id + '.avi')
        os.rename(video_id + '-temp.avi', video_id + '.avi')
        # change the avi file to webm
        # ffmpeg -i video_id.avi -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis video_id.webm
        process3 = subprocess.call(['ffmpeg', '-i', video_id + '.avi', '-c:v', 'libvpx','-crf', '10','-b:v', '1M', '-c:a', 'libvorbis', video_id + '.webm'])

        os.chdir(currentDirectory)
        print("DEBUG: back to current directory", currentDirectory)

        return iris_pos_per_frame, facial_emotion_per_frame, energy_per_frame, silentTimeStamps, speechTimeStamps, text, simpleFillerDictionary, complexFillerDictionary, mostCommonSimpleFiller, emotionList
        

# if __name__ == "__main__":
#     videoPath = '1video'
#     videoAnalyzer = VideoAnlyzer()
#     iris_pos_per_frame, facial_emotion_per_frame, energy_per_frame, silentTimeStamps, speechTimeStamps, text, simpleFillerDictionary, complexFillerDictionary, mostCommonSimpleFiller, emotionList = videoAnalyzer.analyze_video(videoPath, DEBUG=True)

#     print("IRIS_POS:   ", iris_pos_per_frame)
#     print("__________________________________")
#     print("EMOTIONS:    ", facial_emotion_per_frame)
#     print("__________________________________")
#     print("ENERGY:      ", energy_per_frame)

#     print("__________________________________")
#     print("SILENT:      ", silentTimeStamps)
#     print("__________________________________")
#     print("SPEECH:      ", speechTimeStamps)
#     print("__________________________________")
#     print("TEXT:        ", text)
#     print("__________________________________")
#     print("SIMPLE:      ", simpleFillerDictionary)
#     print("__________________________________")
#     print("COMPLEX:     ", complexFillerDictionary)
#     print("__________________________________")
#     print("MOST COMMON: ", mostCommonSimpleFiller)
#     print("__________________________________")
#     print("EMOTION LIST:", emotionList)
#     print("__________________________________")
#     print("__________________________________")


        
