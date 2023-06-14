from keras.models import model_from_json
import numpy as np
#from rmn import RMN
import time

class FacialEmotionAnalysis():

    EMOTIONS_LIST = ["angry", "disgust",
                    "fear", "happy",
                    "neutral", "sad",
                    "surprise"]

    def __init__(self, model_json_file, model_weights_file):
        # print('INFO: Loading RMN model...')
        # t = time.time()
        # self.m = RMN()
        # print('INFO: RMN model loaded in ', (time.time() - t), ' seconds')

        # load model from JSON file
        with open(model_json_file, "r") as json_file:
            loaded_model_json = json_file.read()
            self.loaded_model = model_from_json(loaded_model_json)
        
        # load weights into the new model
        self.loaded_model.load_weights(model_weights_file)
        self.loaded_model.make_predict_function()

        

    def predict_emotion(self, img):
        
        self.preds = self.loaded_model.predict(img)
        return FacialEmotionAnalysis.EMOTIONS_LIST[np.argmax(self.preds)], np.max(self.preds)
        
        # # detect emotion for single frame and return emotion label and probability
        # t = time.time()
        # results = self.m.detect_emotion_for_single_frame(img)
        # print('INFO: RMN model predicted in ', time.time() - t, ' seconds')
        # print('INFO: RMN result:   ',results[0]['emo_label'], ' accuracy:  ', results[0]['emo_proba'])
        # return results[0]['emo_label'], results[0]['emo_proba']


        # results = 
        # [
        #     {
        #         'xmin': 400, 
        #         'ymin': 201, 
        #         'xmax': 791, 
        #         'ymax': 592, 
        #         'emo_label': 'neutral', 
        #         'emo_proba': 0.7847931981086731, 
        #         'proba_list': 
        #             [
        #                 {'angry': 0.009409250691533089}, 
        #                 {'disgust': 0.00028879489400424063}, 
        #                 {'fear': 0.0007825487409718335}, 
        #                 {'happy': 0.0012373102363198996}, 
        #                 {'sad': 0.11401679366827011}, 
        #                 {'surprise': 0.08947204053401947}, 
        #                 {'neutral': 0.7847931981086731}
        #             ]
        #     }
        # ]