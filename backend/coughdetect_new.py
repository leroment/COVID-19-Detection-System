import pyaudio
import math
import struct
import wave
import time
import os
import sys

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
        coughcount = 0
        data = self.wavefile.readframes(chunk)
        while data != '':
            data = self.wavefile.readframes(chunk)
            if ((len(data)/swidth)<=0):

                if coughcount > 10:
                    print("Positive")
                else:
                    print("Negative")

                exit()

            rms_val = self.rms(data)
                
            if rms_val > Threshold:
                coughcount = coughcount + 1

def main(arg):
    a = AudioFile(arg)
    a.listen()

if __name__ == "__main__":
    main(sys.argv[1])

