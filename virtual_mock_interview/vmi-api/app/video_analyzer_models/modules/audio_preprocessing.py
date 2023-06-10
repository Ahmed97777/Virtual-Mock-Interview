import librosa, librosa.display
import matplotlib.pyplot as plt
import numpy as np
import whisper
import soundfile as sf

TIME_THRESHOLD = 5
SILENCE_THRESHOLD = 20

def sliceAudioFile(AudioFilePath):

    silentStamps = []
    speechStamps = []
    # load audio file as an numpy ndarray using librosa
    try:
        x, sr = librosa.load(AudioFilePath, mono = True)
    except:
        print("ERROR: failed to load audio file")
        return [], []
    # split the audio file into segments of audio
    xt = librosa.effects.split(y= x,top_db = SILENCE_THRESHOLD)
    # add [0, 0] to the beginging of the list
    xt = np.insert(xt, 0, [0, 0], axis=0)
    # create a list of time instead of frames
    timeStamps = []
    for i in range(len(xt)):
        timeStamps.append([xt[i][0]/sr, xt[i][1]/sr])
    # if no time stamps then return the whole audio file
    if len(timeStamps) == 0:
        return [], [[0.0, timeStamps[-1][1]]]
    
    # get the silent time stamps
    for i in range(len(timeStamps)-1):
            # add found silent time stamp to the silent time stamps list
            if timeStamps[i+1][0] - timeStamps[i][1] > TIME_THRESHOLD:
                silentStamps.append([timeStamps[i][1], timeStamps[i+1][0]])

    # if no silent time stamps then return the whole audio file
    if len(silentStamps) == 0:
        return  [], [[0.0, timeStamps[-1][1]]]
    
    # check if the first frame is silent
    if not silentStamps[0][0] == 0.0:
            speechStamps.append([0.0, silentStamps[0][0]])
    
    for i in range(len(silentStamps) - 1):
        speechStamps.append([silentStamps[i][1], silentStamps[i+1][0]])
    # check if the last frame is silent
    if not silentStamps[-1][1] == timeStamps[-1][1]:
        speechStamps.append([silentStamps[-1][1], timeStamps[-1][1]])

    return silentStamps, speechStamps


def slicingForEmotionDetection(audio_path, speechTimeStamps):
        myfile = sf.SoundFile(audio_path)
        samplerate = myfile.samplerate
        audioFiles = []
        isAtSegmentEnd = False
        for i in range(len(speechTimeStamps)):
            # divide segment to 5 seconds small segments
            start = speechTimeStamps[i][0]
            end = speechTimeStamps[i][1]
            if end - start > TIME_THRESHOLD:
                while end - start > TIME_THRESHOLD:
                    myfile.seek(int(start))
                    data = myfile.read(int(TIME_THRESHOLD* samplerate), dtype = "float32")
                    audioFiles.append(data)
                    start += TIME_THRESHOLD
            # if speech is bigger than 2 seconds then it is worth to create a segment for it, else ignore it
            if end - start > 2:
                myfile.seek(int(start))
                data = myfile.read(int((end - start)*samplerate), dtype = "float32")
                audioFiles.append(data)
        return audioFiles, samplerate





