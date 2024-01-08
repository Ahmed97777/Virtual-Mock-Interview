import numpy as np
from rmn import RMN
import time

class FacialEmotionAnalysis():

    def __init__(self):
        print('INFO: Loading RMN model...')
        t = time.time()
        self.m = RMN()
        print('INFO: RMN model loaded in ', (time.time() - t), ' seconds')

        

    def predict_emotion(self, img):
        
        
        # detect emotion for single frame and return emotion label and probability
        t = time.time()
        results = self.m.detect_emotion_for_single_frame(img)
        # print('INFO: RMN model predicted in ', time.time() - t, ' seconds')
        # print('INFO: RMN result:   ',results[0]['emo_label'], ' accuracy:  ', results[0]['emo_proba'])
        return results[0]['emo_label'], results[0]['emo_proba']
