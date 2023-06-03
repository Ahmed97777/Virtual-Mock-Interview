import matplotlib
matplotlib.use('agg') # to use matplotlib without gui support

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import librosa
import librosa.display
import random
from collections import Counter
import os
import time
from app import app

class ReportGenerator:
    @staticmethod
    def generate_report(interviewId: str, videoId: str):
        try:
            os.chdir(app.config['UPLOAD_FOLDER'] + '/' + interviewId)
        except FileNotFoundError:
            return {'msg': 'Interview ID not found.'}
        
        print
        # wait for video to be processed
        text = {}
        highlighted_text = {}
        if not os.path.isfile(interviewId + videoId + '.pkl'):
            return {'msg': 'Video ID not found.'}
        else:
            i = int(videoId[1])
            df = pd.read_pickle(interviewId + videoId+'.pkl')
            y, sr = librosa.load(interviewId + videoId + '.wav')
            seconds = librosa.get_duration(y=y, sr=sr)
            framerate = int(len(df['iris_pos_per_frame']) / seconds)
            # lower the length of iris_pos_per_frame,  facial_emotion_per_frame, energy_per_frame to be per second instead of per frame
            lite_df = {}
            lite_df.update(ReportGenerator.seconds_converter(df, framerate))
            
            text.update({i:df['text']})
            highlighted_text.update({i:df['highlightedText']})
            
            # plot the speech and silence of the question
            ReportGenerator.plot_speech(y, sr, df['silentTimeStamps'], df['speechTimeStamps'],i,0)
            #plot fillers of the question
            ReportGenerator.plot_fillers(df['simpleFillerDictionary'], df['complexFillerDictionary'], i, 1)
            
            # add energy_val, focus_val, voice_tone_val to lite_df
            lite_df.update(ReportGenerator.category_to_number(lite_df['energy_per_second'],lite_df['focus_per_second'], lite_df['voice_tone_per_second']))
            # plot the energy, focus, voice_tone of the question
            ReportGenerator.plot_plot(ReportGenerator.lpf(lite_df['energy_val'], 0.9), ReportGenerator.lpf(lite_df['focus_val'],0.9), ReportGenerator.lpf(lite_df['tone_val'],0.9), i, 2)
            # plot the iris tracking of the question
            ReportGenerator.plot_iris(lite_df['iris_pos_per_second'], i, 3)
            # plot the radar of the question
            ReportGenerator.plot_radar(
                lite_df['facial_emotion_per_second'], 
                lite_df['energy_per_second'], 
                lite_df['focus_per_second'], 
                lite_df['voice_tone_per_second'],
                ReportGenerator.lpf(lite_df['energy_val'], 0.9), 
                ReportGenerator.lpf(lite_df['focus_val'],0.9), 
                ReportGenerator.lpf(lite_df['tone_val'],0.9),  
                i, 
                4)
            print('DEBUG: done with ' + videoId)
        os.chdir(app.config['BASEDIR'])
        return {'msg': 'success',
                'text': text,
                'highlighted_text': highlighted_text
                }
            


    @staticmethod        
    def seconds_converter(df, framerate):
        # lower the length of iris_pos_per_frame,  facial_emotion_per_frame, energy_per_frame to be per second instead of per frame
        iris_pos_per_second = []
        facial_emotion_per_second = []
        voice_emotion_per_second = []

        focus_per_second = []
        energy_per_second = []
        voice_tone_per_second = []

        test_list = [0, 1,2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12]
        for i in range(0, len(df['iris_pos_per_frame']), framerate):
            iris_window = df['iris_pos_per_frame'][i:i+framerate]
            emotion_window = df['facial_emotion_per_frame'][i:i+framerate]
            energy_window = df['energy_per_frame'][i:i+framerate]

            iris_pos_per_second.append(Counter(iris_window).most_common(1)[0][0])
            facial_emotion_per_second.append(Counter(emotion_window).most_common(1)[0][0])
            energy_per_second.append(Counter(energy_window).most_common(1)[0][0])

        for i in iris_pos_per_second:
            if i == 'center':
                focus_per_second.append('Focused')
            else:
                focus_per_second.append('Not focused')

        # extend the length of voice tone to be per second instead of per couple of seconds
        div = int(len(iris_pos_per_second)/len(df['voice_tone']))
        for t in df['voice_tone']:
            voice_tone_per_second.extend([t] * div)

        if len(iris_pos_per_second) > len(voice_tone_per_second):
            voice_tone_per_second.extend([voice_tone_per_second[-1]] * (len(iris_pos_per_second) - len(voice_tone_per_second)))

        div2 = int(len(iris_pos_per_second)/len(df['voice_emotions']))
        for e in df['voice_emotions']:
            voice_emotion_per_second.extend([e] * div2)

        if len(iris_pos_per_second) > len(voice_emotion_per_second):
            voice_emotion_per_second.extend([voice_emotion_per_second[-1]] * (len(iris_pos_per_second) - len(voice_emotion_per_second)))
        return {
            'iris_pos_per_second': iris_pos_per_second,
            'facial_emotion_per_second': facial_emotion_per_second,
            'voice_emotion_per_second': voice_emotion_per_second,
            'focus_per_second': focus_per_second,
            'energy_per_second': energy_per_second,
            'voice_tone_per_second': voice_tone_per_second
        }
    @staticmethod   
    def plot_speech(y, sr, silentTimeStamps,  speechTimeStamps, questionId, plotId):    
        # Create a new figure and axis
        fig, axs = plt.subplots(nrows=3, sharex=True)

        # Plot the speech timestamps as a filled area
        for i, interval in enumerate(speechTimeStamps):
                axs[0].fill_between(interval, [0, 0], [0.5, 0.5], color='blue', alpha=0.5, label = 'speech' if i == 0 else '')



        # add audio signal 
        librosa.display.waveshow(y, sr=sr, ax=axs[1], alpha=0.5, label = 'audio signal')

        # Plot the silent timestamps as a filled area
        for i, interval in enumerate(silentTimeStamps):
            axs[2].fill_between(interval, [-0.5, -0.5], [0, 0], color='gray', alpha=0.5, label = 'silence' if i == 0 else '')

        # set y axis limits for axs[0] and axs[2] to 0 and 1
        axs[0].set_ylim([0, 1])
        axs[2].set_ylim([-1, 0])
        axs[0].set(ylabel='Speech')
        axs[1].set(ylabel='Audio Signal')
        axs[2].set(xlabel='Time (s)', ylabel='Silent')
        fig.suptitle('Q{}: Speech and Silence Detection'.format(questionId))
        fig.legend()

        plt.savefig('{}.png'.format('{}_video_{}'.format(questionId, plotId)))
        plt.close(plt.gcf())

    @staticmethod   
    def plot_fillers(simpleFillerDictionary, complexFillerDictionary, questionId, plotId):
        # Create a new figure and axis
        fig, ax = plt.subplots()

        # Get keys and their values from the dictionaries
        simple_dict = simpleFillerDictionary
        complex_dict = complexFillerDictionary

        keys = list(simple_dict.keys()) + list(complex_dict.keys())
        values = list(simple_dict.values()) + list(complex_dict.values())

        # Plot the bar chart
        ax.bar(keys, values, color=['blue', 'red', 'green', 'yellow', 'cyan', 'magenta', 'black', 'white'], label= keys, alpha=0.5)
        # make x axis size longer
        ax.set_xlim([-1, len(keys) + 5])
        fig.suptitle('Q{}: Fillers'.format(questionId))
        fig.legend()
        plt.savefig('{}.png'.format('{}_video_{}'.format(questionId, plotId)))
        plt.close(plt.gcf())

    @staticmethod   
    def category_to_number(energy_per_second, focus_per_second, voice_tone_per_second):
        # Initialize the result list
        energy_val_tmp = []
        focus_val_tmp = []
        tone_val_tmp = []

        # Iterate through the ENERGY list
        for i, value in enumerate(energy_per_second):
            # Generate a random number of repetitions (between 3 and 6)
            repetitions = random.randint(3, 6)
            
            # Generate a random number based on the value
            if value == 'Not Energetic':
                rand_num = random.uniform(*(0, 0.5))
            elif value == 'Energetic':
                rand_num = random.uniform(*(0.5, 1))
            else:
                rand_num = 0  # Set a default value if the value is not recognized
            
            # Copy the random number to the specified number of repetitions
            energy_val_tmp.extend([rand_num] * repetitions)

        # Iterate through the IRIS list
        for i, value in enumerate(focus_per_second):
            # Generate a random number of repetitions (between 3 and 6)
            repetitions = random.randint(3, 6)
            
            # Generate a random number based on the value
            if value == 'Focused':
                rand_num = random.uniform(*(0.5, 1))
            elif value == 'Not focused':
                rand_num = random.uniform(*(0, 0.5))
            else:
                rand_num = 0  # Set a default value if the value is not recognized
            
            # Copy the random number to the specified number of repetitions
            focus_val_tmp.extend([rand_num] * repetitions)

        # Iterate through the voice emotion list
        for i, value in enumerate(voice_tone_per_second):
            # Generate a random number of repetitions (between 3 and 6)
            repetitions = random.randint(3, 6)
            
            # Generate a random number based on the value
            if value == 'Monotone':
                rand_num = random.uniform(*(0, 0.5))
            elif value == 'Non monotone':
                rand_num = random.uniform(*(0.5, 1))
            else:
                rand_num = 0  # Set a default value if the value is not recognized
            
            # Copy the random number to the specified number of repetitions
            tone_val_tmp.extend([rand_num] * repetitions)
        
        # Truncate or pad the result list to match the length of the original list
        energy_val_tmp = energy_val_tmp[:len(energy_per_second)]
        focus_val_tmp = focus_val_tmp[:len(focus_per_second)]
        tone_val_tmp = tone_val_tmp[:len(voice_tone_per_second)]
        
        return {
            'energy_val': energy_val_tmp,
            'focus_val': focus_val_tmp,
            'tone_val': tone_val_tmp
        }
    @staticmethod   
    def plot_plot(energy_val,focus_val, tone_val, questionId, plotId):
        fig, axs = plt.subplots(nrows=3, sharex=True)
        #create line plot for result
        axs[0].plot(energy_val, color = 'blue', alpha=0.5, label='Energy')
        axs[1].plot(focus_val, color = 'red', alpha=0.5, label='Focus')
        axs[2].plot(tone_val, color = 'green', alpha=0.5, label='Tone')
        axs[0].set_ylim([0, 1])
        # set horizontal lines at y =  0.5
        axs[0].axhline(y=0.5, color='gray', linestyle='--', alpha=0.5)
        axs[1].axhline(y=0.5, color='gray', linestyle='--', alpha=0.5)
        axs[2].axhline(y=0.5, color='gray', linestyle='--', alpha=0.5)

        axs[1].set_ylim([0, 1])
        axs[1].label_outer()
        axs[2].set_ylim([0, 1])

        axs[0].set( ylabel='Energy')
        axs[1].set(ylabel='Focus')
        axs[2].set(xlabel='Time (s)', ylabel='Tone')
        fig.legend()
        fig.suptitle('Q{}: Energy, Focus and Voice Tone'.format(questionId))

        plt.savefig('{}.png'.format('{}_video_{}'.format(questionId, plotId)))
        plt.close(plt.gcf())

    @staticmethod   
    def plot_iris(iris_pos_per_second, questionId, plotId):
        # create pie chart for the irirs positions per second
        fig, axs = plt.subplots()
        c1  = Counter(iris_pos_per_second)
        if len(c1.keys()) == 3:
            axs.pie(c1.values(), labels=c1.keys(), explode=(0.1,0, 0), autopct='%1.1f%%')
        else:
            axs.pie(c1.values(), labels=c1.keys(), explode=(0.1,0,0, 0), autopct='%1.1f%%')
        axs.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
        fig.suptitle('Q{}: Eye Tracking'.format(questionId))
        fig.legend()
        plt.savefig('{}.png'.format('{}_video_{}'.format(questionId, plotId)))
        plt.close(plt.gcf())

    @staticmethod   
    def plot_radar(facial_emotion_per_second, energy_per_second, focus_per_second, voice_tone_per_second,energy_val,focus_val,tone_val,  questionId, plotId):
        # create radar chart
        fig, ax = plt.subplots( subplot_kw={'projection': 'polar'})

        c1 = Counter(voice_tone_per_second)
        c2 = Counter(focus_per_second)
        c3 = Counter(energy_per_second)
        c4 = Counter(facial_emotion_per_second)
        happy = c4['Happy'] / len(facial_emotion_per_second)
        sad = c4['Sad'] / len(facial_emotion_per_second)
        neutral = c4['Neutral'] / len(facial_emotion_per_second)

        energy = sum(energy_val) / len(energy_val)
        tone = sum(tone_val) / len(tone_val)
        focus = sum(focus_val) / len(focus_val)
        sad = sad * 0.9


        r = [happy,focus,tone ,energy,sad,neutral, happy]

        theta = np.linspace(0, 2*np.pi, len(r), endpoint=False)

        ax.plot(theta, r)
        ax.set_xticks(theta[:-1])
        ax.set_xticklabels(['Happy',  'Focus', 'Voice not monotonic','Energy' ,'Sad','Neutral'])
        fig.suptitle('Q{}: Radar'.format(questionId))
        plt.savefig('{}.png'.format('{}_video_{}'.format(questionId, plotId)))
        plt.close(plt.gcf())
    @staticmethod   
    def lpf(signal, alpha):
        # Initialize the filtered list
        filtered = [signal[0]]
        for i in range(1, len(signal)):
            # Apply the filter
            filtered.append(alpha * signal[i] + (1 - alpha) * filtered[i-1])
        return filtered

# define main
if __name__ == "__main__":
    dic = ReportGenerator.generate_report('92d77e68-ad3f-4edf-aaed-750b53a0f0cf', '_1_video')
    print(dic)