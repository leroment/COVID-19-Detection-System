import pyaudio
import math
import struct
import wave
import time
import os

Threshold = 20

SHORT_NORMALIZE = (1.0/32768.0)
CHANNELS = 1
chunk = 1024
swidth = 2

TIMEOUT_LENGTH = 20 #seconds

f_name_directory = os.getcwd()

class AudioFile:

    @staticmethod
    def rms(frame):
        count = len(frame) / swidth
        format = "%dh" % (count)
        shorts = struct.unpack(format, frame)

        sum_squares = 0.0
        for sample in shorts:
            n = sample * SHORT_NORMALIZE
            sum_squares += n * n
        if (count > 0):
            rms = math.pow(sum_squares / count, 0.5)
        elif(count < 0):
            exit

        return rms * 1000

    def __init__(self, file):
        self.wavefile = wave.open(file, 'rb')
        self.p = pyaudio.PyAudio()
        self.stream = self.p.open(format = self.p.get_format_from_width(self.wavefile.getsampwidth()),
                                  channels = 1,
                                  rate = self.wavefile.getframerate(),
                                  output = True)

    def listen(self):
        print('Listening beginning')
        coughcount = 0
        print(os.getcwd())
        data = self.wavefile.readframes(chunk)
        while data != '':
            #input = self.stream.read(chunk)
            data = self.wavefile.readframes(chunk)
            if ((len(data)/swidth)<=0):

                if coughcount > 10:
                    print("Cough had been detected in this recording")

                exit()

            rms_val = self.rms(data)

            if rms_val < Threshold:
                print("listening")
                
            if rms_val > Threshold:
                #self.record()
                #print("cough detected")
                coughcount = coughcount + 1

a = AudioFile("test.wav")
a.listen()

