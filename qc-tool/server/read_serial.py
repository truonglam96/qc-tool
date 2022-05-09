from threading import Thread
import serial
import sys
import signal
import os

PORT = sys.argv[1]

def sigterm_handler(_signo, _stack_frame):
    # Raises SystemExit(0):
    print("python read serial process got kill signal")
    ser.flush()
    ser.close()
    sys.exit(0)
# hook on signal 
signal.signal(signal.SIGHUP, sigterm_handler)

ser = serial.Serial(port=PORT, baudrate=115200, timeout=1)

while True:
    d = ''
    
    try:
        d = ser.readline()
    except Exception as e:
        os.kill(os.getpid(), signal.SIGHUP)

    try:
        d = d.decode()
    except Exception as e:
        d = ''
        continue
    
    sys.stdout.flush()
    sys.stdout.write(d)

    