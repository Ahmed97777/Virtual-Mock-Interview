import pickle
import numpy as np
import librosa
from . import audio_preprocessing as ap
from collections import Counter
import re
import os
import subprocess
from app import app

class VoiceModel:
    '''
    A class that uses the Whisper library to perform speech-to-text conversion and 
    performs speech emotion analysis using a pre-trained machine learning model.
    '''
    
    def __init__(self, model="tiny.en"):
        '''
        Initializes the SpeechToText object.
        
        Args:
            model (str): language model to be used for speech-to-text conversion.
        '''

        # list of fillers to be checked in the model
        self.fillers = ['well', 'like', 'actually', 'basically', 'seriously', 'literally', 'totally','right', 'umm', 'um', 'uh', 'hmm', 'okay', 'ok','actually', 'honestly', 'yeah', 'yep', 'right' ]
        self.complex_fillers = ['i guess','i suppose','believe me','you know what i mean','i mean','you see','you know','at the end of the day']
        
        self.samplerate_soundFile = 0
        self.model_type = model
        # load the emotion recognition model
        pkl_model_path = app.config['VOICE_MODEL_PKL']

        self.emotion_model = pickle.load(open(pkl_model_path, 'rb'))
        print("INFO: model loaded")
        
    
    def audio_prepocessing(self, audio_path, DEBUG=False):
        '''
        Calculates the total duration of silences in an audio segment and returns the maximum duration of a single silence segment.

        Args:
            audio_path (str): The path to the audio file to be analyzed.
            DEBUG (bool, optional): If True, additional debug information will be printed. Defaults to False.
        Returns:
            silentTimeStamps (List): A list of timestamps of silent segments in the audio file.
            speechTimeStamps (List): A list of timestamps of speech segments in the audio file.
            audioFiles (list of np.ndarray): The audio files list where each item is a numpy n dimensional array but with different sampling rate than librosa sampling.
        '''
        try:
            # call the audio_prepocessing slicing functions
            silentTimeStamps, speechTimeStamps = ap.sliceAudioFile(audio_path)
            audioFiles, sr_soundFile = ap.slicingForEmotionDetection(audio_path, speechTimeStamps)
            self.samplerate_soundFile = sr_soundFile
        except:
            print("ERROR: audio_prepocessing, failed to slice audio file")
            return None, None, None
        if DEBUG:
            print("DEBUG: silentTimeStamps",silentTimeStamps)
            print("DEBUG: speechTimeStamps",speechTimeStamps)
            print("DEBUG: sr_librosa",sr_librosa)
            print("DEBUG: audio_librosa type ", type(audio_librosa))
            print("DEBUG: audio_librosa shape ", audio_librosa.shape)
            print("__________________________________________________")
            print("DEBUG: sr_soundFile",sr_soundFile)
            print("DEBUG: audioFiles[0] type ", type(audioFiles[0]))
            print("DEBUG: audioFiles[0] shape ", audioFiles[0].shape)
        return silentTimeStamps, speechTimeStamps, audioFiles
 

    def analyze_text(self, text, DEBUG=False):
        '''
        Analyzes the given text for the occurrence of simple and complex fillers and returns the counts and the most frequent
        simple filler.

        Args:
            text (str): The text to be analyzed.
            DEBUG (bool, optional): If True, additional debug information will be printed. Defaults to False.

        Returns:
            tuple: A tuple containing:
                - simple_filler_counts (Counter): A Counter object containing the count of each simple filler in the text.
                - complex_filler_counts (dict): A dictionary containing the count of each complex filler in the text.
                - most_common_simple_filler (str): The most frequent simple filler in the text.
        '''
        # Pre-process text
        text = text.lower()
        words = re.findall(r'\w+', text)

        # Count occurrences of simple fillers
        simple_filler_counts = Counter(word for word in words if word in self.fillers)

        # Count occurrences of complex fillers
        complex_filler_counts = {}
        for filler in self.complex_fillers:
            count = text.count(filler)
            if count > 0:
                complex_filler_counts[filler] = count

        # Determine most frequent simple filler
        if simple_filler_counts:
            most_common_simple_filler = simple_filler_counts.most_common(1)[0][0]
        else:
            most_common_simple_filler = None
        # Print debug information
        if DEBUG:
            print("DEBUG: simple_filler_counts",simple_filler_counts)
            print("DEBUG: complex_filler_counts",complex_filler_counts)
            print("DEBUG: most_common_simple_filler",most_common_simple_filler)

        return simple_filler_counts, complex_filler_counts, most_common_simple_filler

    def speech_emotion_analysis(self, audioFiles, DEBUG=False):
        '''
        Analyzes the emotions conveyed in a list of audio files using a pre-trained emotion detection model.

        Args:
            audioFiles (list): A list of audio files of type numpy ndarrays.
            DEBUG (bool, optional): If True, print debug information. Defaults to False.

        Returns:
            emotionResults (list): A list of the predicted emotions for each audio file in audioFiles.
        '''
        voice_emotions = []
        voice_tone = []
        # Iterate through audio files
        for file in audioFiles:
            try:
                # Extract audio features
                features = self.extract_feature(file, mfcc=True, chroma=True, mel=True)
                # Predict emotion using pre-trained model
                result = self.emotion_model.predict(features.reshape(1, -1))
                print("INFO: result",result)
                voice_emotions.append(result[0])
                # Predict tone using pre-trained model
                if result[0] != 'sad':
                    tone = 'Non monotone'
                else:
                    tone = 'Monotone'
                voice_tone.append(tone)
                
            except Exception as e:
                print('ERROR: failed to extract features and predict emotion at time stamp')
                print(e)
                continue
        if DEBUG:
            print("DEBUG: voice_emotions",voice_emotions)
        return voice_emotions, voice_tone


    def extract_feature(self, audio, **kwargs):
        '''
        Extract feature from audio file `file_name`
            Features supported:
                - MFCC (mfcc)
                - Chroma (chroma)
                - MEL Spectrogram Frequency (mel)
                - Contrast (contrast)
                - Tonnetz (tonnetz)
        e.g:
            - `features = extract_feature(path, mel=True, mfcc=True)`
        Args:
            - audio (numpy.ndarray): Audio data in numpy array format
            - **kwargs (bool): Keyword arguments for different feature types

        Returns:
            - numpy.ndarray: Extracted features in numpy array format
        '''
        sample_rate = self.samplerate_soundFile
        # Get keyword arguments for different feature types
        mfcc = kwargs.get("mfcc")
        chroma = kwargs.get("chroma")
        mel = kwargs.get("mel")
        contrast = kwargs.get("contrast")
        tonnetz = kwargs.get("tonnetz")
        # setting audio to mono channel
        if audio.ndim > 1:
            X = np.mean(audio, axis = 1)
        else:
            X = audio

        if chroma or contrast:
            stft = np.abs(librosa.stft(X, n_fft = 512))
            features = np.array([])
        if mfcc:
            mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40).T, axis=0)
            features = np.hstack((features, mfccs))
        if chroma:
            chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T,axis=0)
            features = np.hstack((features, chroma))
        if mel:
            mel = np.mean(librosa.feature.melspectrogram(y=X, sr=sample_rate).T,axis=0)
            features = np.hstack((features, mel))
        if contrast:
            contrast = np.mean(librosa.feature.spectral_contrast(S=stft, sr=sample_rate).T,axis=0)
            features = np.hstack((features, contrast))
        if tonnetz:
            tonnetz = np.mean(librosa.feature.tonnetz(y=librosa.effects.harmonic(X), sr=sample_rate).T,axis=0)
            features = np.hstack((features, tonnetz))
        return features

    def voiceModel(self, video_id, DEBUG=False):
        
        #create parallel subprocess to execute whisper model
        #process = subprocess.Popen(["cd",  user_id, "&&","whisper", audio_file,"--model", self.model_type, "--language", "en", "&&", "cd", "../.."])
        # go to user directory and run whisper model
        try:
            process = subprocess.call(["whisper","{}.wav".format(video_id), "--model", self.model_type, "--language", "en"])
        except Exception as e:
            print("ERROR: failed to run whisper model")
            print(e)
            return

        silentTimeStamps, speechTimeStamps, audioFiles = self.audio_prepocessing("{}.wav".format(video_id), DEBUG=DEBUG)
        # emotion analysis
        voice_emotions, voice_tone = self.speech_emotion_analysis(audioFiles, DEBUG)
        
        # read text file
        with open('{}.txt'.format(video_id), 'r') as f:
            text = f.read()
        # analyze text
        simpleFillerDictionary, complexFillerDictionary, mostCommonSimpleFiller =  self.analyze_text(text, DEBUG)
        highlightedText = text
        # highlight the filler words in the text
        for word in self.fillers:
            highlightedText = highlightedText.replace(word, '<span style="color: red; text-decoration: underline;">{}</span>'.format(word))
        for cmplx in self.complex_fillers:
            highlightedText = highlightedText.replace(cmplx, '<span style="color: red; text-decoration: underline;">{}</span>'.format(cmplx))
        



        # Open the VTT file and read its contents
        with open('{}.vtt'.format(video_id), 'r') as f:
            vtt_contents = f.read()
        for word in self.fillers:
            vtt_contents = vtt_contents.replace(word, '<span style="color: red; text-decoration: underline;">{}</span>'.format(word))
        for cmplx in self.complex_fillers:
            vtt_contents = vtt_contents.replace(cmplx, '<span style="color: red; text-decoration: underline;">{}</span>'.format(cmplx))
        
        # Write the modified contents to the VTT file
        with open('{}.vtt'.format(video_id), 'w') as f:
            f.write(vtt_contents)
        # return all the analyzed information
        return {    "silentTimeStamps":silentTimeStamps,
                    "speechTimeStamps":speechTimeStamps,
                    "text":text,
                    "highlightedText": highlightedText,
                    "simpleFillerDictionary":simpleFillerDictionary,
                    "complexFillerDictionary":complexFillerDictionary,
                    "mostCommonSimpleFiller":mostCommonSimpleFiller,
                    "voice_emotions":voice_emotions,
                    "voice_tone":voice_tone
                }


    







