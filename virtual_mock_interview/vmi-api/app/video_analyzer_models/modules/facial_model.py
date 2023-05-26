import mediapipe as mp
import numpy as np
import cv2
import os
import math
from configparser import ConfigParser
import json
from . import facial_emotion_detection as fed
import time

class FacialModel:
    
    '''
    A class for facial feature extraction and analysis.

    Attributes:
    - config: A ConfigParser object that reads the configuration file 'config.ini'
    - LEFT_EYE, RIGHT_EYE, RIGHT_IRIS, LEFT_IRIS, L_H_LEFT, L_H_RIGHT, R_H_LEFT,
      R_H_RIGHT, MID_EYES: Indexes for facial landmarks, read from the 'FACE_INDEXES'
      section of the configuration file.
    - IMG_H, IMG_W: Height and width of images, read from the 'IMG_SIZE' section of
      the configuration file.
    - mp_face_mesh: A mediapipe face mesh object.
    - emotion_model: A FacialEmotionAnalysis object for facial emotion analysis.
    - DEBUG: A boolean value indicating whether debug mode is enabled or not.
    '''

    def __init__(self):
        # read config sections
        self.config = ConfigParser()
        self.config.read("../../app/video_analyzer_models/config.ini")
        self.emotion_model = fed.FacialEmotionAnalysis("../../app/video_analyzer_models/models/face_emotion_analysis.json", "../../app/video_analyzer_models/models/face_emotion_analysis_weights.h5")
        # eyes indexes in mediapipe
        self.LEFT_EYE = json.loads(self.config.get('FACE_INDEXES', 'LEFT_EYE'))
        self.RIGHT_EYE = json.loads(self.config.get('FACE_INDEXES', 'RIGHT_EYE'))
        
        self.RIGHT_IRIS = json.loads(self.config.get('FACE_INDEXES', 'RIGHT_IRIS'))
        self.LEFT_IRIS = json.loads(self.config.get('FACE_INDEXES', 'LEFT_IRIS'))

        self.L_H_LEFT = json.loads(self.config.get('FACE_INDEXES', 'L_H_LEFT'))
        self.L_H_RIGHT = json.loads(self.config.get('FACE_INDEXES', 'L_H_RIGHT'))    

        self.R_H_LEFT = json.loads(self.config.get('FACE_INDEXES', 'R_H_LEFT'))
        self.R_H_RIGHT = json.loads(self.config.get('FACE_INDEXES', 'R_H_RIGHT')) 
        self.MID_EYES = json.loads(self.config.get('FACE_INDEXES', 'MID_EYES'))
        # load mediapipe face mesh
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_face_detection = mp.solutions.face_detection
        # load emotion model
        self.DEBUG = False

    def euclideanDistance(self, p1: list, p2: list):
        '''
        Calculate the Euclidean distance between two points in a two-dimensional space.

        Args:
        - p1: A list containing the coordinates of the first point.
        - p2: A list containing the coordinates of the second point.

        Returns:
        - dist: A float representing the Euclidean distance between the two points.
        '''
        # Unpack the coordinates of the two points from the input lists.
        x1, y1 = p1.ravel()
        x2, y2 = p2.ravel()

        # Calculate the Euclidean distance between the two points using the formula
        # sqrt((x2-x1)^2 + (y2-y1)^2).
        dist = math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        # Return the calculated distance.
        return dist

    def irisPosition(self, r_iris_center, right_point, left_point, mid_eye, l_iris_center):
        '''
        Calculates the position of the iris within the eye (left, center, or right) based on the position of the iris center
        and the distance ratio between the nose and the eyes.

        Args:
        - r_iris_center (list): Coordinates of the right iris center point.
        - right_point (list): Coordinates of the right eye rightmost point.
        - left_point (list): Coordinates of the right eye leftmost point.
        - mid_eye (list): Coordinates of the midpoint between both eyes.
        - l_iris_center (list): Coordinates of the left iris center point.

        Returns:
        - A tuple containing:
            - irisPosition (str): Position of the iris within the eye (left, center, or right).
            - iris_ratio (float): Ratio between the distance from the right iris center to the rightmost eye point
            and the width of the eye.
            - nose_to_eye_ratio (float): Ratio between the distance from the nose to the right iris center and the
            distance between both eyes.
        '''
        
        # calculate disctance between the two centers of both eyes
        nose_to_right_eye_center = self.euclideanDistance(r_iris_center, mid_eye)
        total_eye_distance = self.euclideanDistance(r_iris_center, l_iris_center)
        nose_to_eye_ratio = nose_to_right_eye_center/total_eye_distance
        
        # caclulate right eye iris position
        center_to_right_dist = self.euclideanDistance(r_iris_center, right_point)
        eye_width = self.euclideanDistance(right_point, left_point)  
        iris_ratio = center_to_right_dist/eye_width
        
        iris_position = ""
        
        # determine iris position based on the calculated ratios
        if nose_to_eye_ratio <= 0.30:
            iris_position = "Right"
        
        elif nose_to_eye_ratio > 0.30 and nose_to_eye_ratio <= 0.70:
            
            if iris_ratio <= 0.40:
                iris_position = "Right"
            elif iris_ratio > 0.40 and iris_ratio <= 0.60:

                iris_position = "Center"
            else:
                iris_position = "Left"     
        else:
            iris_position = "Left"
        
        return iris_position, iris_ratio, nose_to_eye_ratio

    def dummyMain(self, DEBUG = False):
        '''
        Dummy main function for testing purposes. it simulates taking the frame from the webcam and passing it to the facialAnalysis function. instead of getting it from the backend.
        '''
        # initialize lists to store the iris position and facial emotion per frame
        iris_pos_per_frame = []
        facial_emotion_per_frame = []

        cap = cv2.VideoCapture(0)
        while True:
            ret, frame = cap.read()
            if not ret:
                print("failed to grab frame")
                break
            
            # get the iris position and facial emotion for the current frame
            iris, emotion, energy, frame = self.facialAnalysis(frame, DEBUG)
            iris_pos_per_frame.append(iris)
            facial_emotion_per_frame.append(emotion)
            # display the resulted frame
            cv2.imshow("frame", frame)
            key = cv2.waitKey(1)
            if key == ord('q'):
                break
        cap.release()
        cv2.destroyAllWindows()
        return iris_pos_per_frame, facial_emotion_per_frame

    def facialAnalysis(self, frame, DEBUG= False):
        '''
        Detects and analyse person's facial landmarks in real-time using the computer's webcam.

        Args:
            - frame: cv2 frame to be analyzed.
            -DEBUG (bool, optional): A flag indicating whether to enable debug mode, which displays additional visualizations of the process. Defaults to False.

        Returns:
            tuple: A tuple containing two values: iris_pos and facial_emotion. 
        '''
        # get facial emotion analysis
        frame, facial_emotion, energitic = self.facialEmotionAnalysis(frame, DEBUG)
        # initialize iris position
        iris_pos = None
        # calculate fps
        frame_count = 0
        start_time = time.time()

        # get facial landmarks using mediapipe face mesh model
        with self.mp_face_mesh.FaceMesh(
            max_num_faces= 1,
            refine_landmarks = True,
            min_detection_confidence = 0.5,
            min_tracking_confidence = 0.5
        ) as face_mesh:
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                #get results
                results = face_mesh.process(rgb_frame)
                if results.multi_face_landmarks:
                   
                    # get keypoints of face_mesh
                    mesh_points = np.array([np.multiply([p.x, p.y], [rgb_frame.shape[1], rgb_frame.shape[0]]).astype(int) \
                                        for p in results.multi_face_landmarks[0].landmark])
                    (l_cx, l_cy), l_rad = cv2.minEnclosingCircle(mesh_points[self.LEFT_IRIS])
                    (r_cx, r_cy), r_rad = cv2.minEnclosingCircle(mesh_points[self.RIGHT_IRIS])
                    
                    center_left = np.array([l_cx, l_cy], dtype = np.int32)
                    center_right = np.array([r_cx, r_cy], dtype = np.int32)
                    # draw circles around the iris, and the midpoint between both eyes
                    if DEBUG:
                        cv2.circle(frame, center_left, int(l_rad), (255, 255, 0), 1, cv2.LINE_AA)
                        cv2.circle(frame, center_right, int(r_rad), (255, 255, 0), 1, cv2.LINE_AA)
                        cv2.circle(frame, mesh_points[self.R_H_LEFT][0], 3, (255, 255, 0), -1, cv2.LINE_AA)
                        cv2.circle(frame, mesh_points[self.R_H_RIGHT][0], 3, (255, 255, 0), -1, cv2.LINE_AA)
                        cv2.circle(frame, mesh_points[self.MID_EYES][0], 3, (255, 255, 0), -1, cv2.LINE_AA)
                    
                    # get iris position and ratios for both eyes
                    iris_pos, iris_ratio, nose_to_eye_ratio = self.irisPosition(center_right, mesh_points[self.R_H_RIGHT], mesh_points[self.R_H_LEFT], mesh_points[self.MID_EYES], center_left)       
                    
                    # display the iris position and ratios on the frame
                    if DEBUG:
                        cv2.putText(
                            frame, 
                            f"Iris pos: {iris_pos} eye: {iris_ratio: .2f} head: {nose_to_eye_ratio: 0.2f}",
                            (30,60),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.5,
                             (0, 0, 0),
                            6
                        )
                        cv2.putText(
                            frame, 
                            f"Iris pos: {iris_pos} eye: {iris_ratio: .2f} head: {nose_to_eye_ratio: 0.2f}",
                            (30,60),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.5,
                             (255, 255, 255),
                            1
                        )
                        
                frame_count += 1
                #calculate fps
                fps = frame_count / (time.time() - start_time)
                # display fps on the frame
                if DEBUG:
                    cv2.putText(
                            frame, 
                            f"fps: {fps: .2f}",
                            (30, 30),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.5,
                            (0, 0, 0),
                            6
                    )
                    cv2.putText(
                            frame, 
                            f"fps: {fps: .2f}",
                            (30, 30),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.5,
                            (255, 255, 255),
                            1
                    )
                    

        return iris_pos, facial_emotion, energitic, frame

    def facialEmotionAnalysis(self, frame, DEBUG = False):
        '''
        Analyzes the facial emotion of the given frame using the pre-trained EmotionModel and mediapipe FaceDetection model.
        Args:
            -frame: cv2 frame to be analyzed for facial emotion.

        Returns:
            tuple: A tuple containing the original frame with the predicted emotion label and a string representing the predicted emotion, or None if no faces were detected in the frame.
        '''
        # get a copy of the original frame
        orignal_frame = frame.copy()
        # convert the frame to grayscale
        gray_fr = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # initialize the predicted emotion
        pred = None
        # detect faces in the frame using the mediapipe FaceDetection model
        with self.mp_face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.5) as face_detection:
            # convert the frame to RGB color space for the face detection model
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_detection.process(frame)
            # if no faces were detected, return the original frame and None
            if(results.detections == None):
                return orignal_frame, pred
            # get the bounding box of the detected face
            x = int(results.detections[0].location_data.relative_bounding_box.xmin * frame.shape[1])
            y = int(results.detections[0].location_data.relative_bounding_box.ymin *  frame.shape[0])
            w = int(results.detections[0].location_data.relative_bounding_box.width *  frame.shape[1])
            h = int(results.detections[0].location_data.relative_bounding_box.height * frame.shape[0])

            # crop the face on the grey frame and resize it to 48x48 --> our region of interest
            fc = gray_fr[y:y+h, x:x+w]
            try:
                roi = cv2.resize(fc, (48, 48))
            except:
                print("Error resizing the face")
                return orignal_frame, pred
            # predict the emotion of the face
            pred = self.emotion_model.predict_emotion(roi[np.newaxis, :, :, np.newaxis])
            # pred is either "Angry", "Disgust", "Fear", "Sad","Surprise" --> negative emotions
            # or "Happy", "Neutral" --> positive emotions
            # change pred to "Axious" if the emotion is negative, "Not Axious" otherwise
            # 
            isEnergitic = None
            if pred in ["Sad","Neutral"]:
                isEnergitic = "Not Energetic"
            else:
                isEnergitic = "Energetic"

            # draw the bounding box and the predicted emotion on the original frame
            if DEBUG:
                cv2.putText(orignal_frame, isEnergitic, (x-2, y-10), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
                cv2.rectangle(orignal_frame,(x,y),(x+w,y+h),(255, 255, 0), 2)
        return orignal_frame, pred, isEnergitic

#-------------------for testing the model----------------------- #
if __name__ == "__main__":
    faceModel = FacialModel()
    faceModel.dummyMain(DEBUG = True)

 
        
        

