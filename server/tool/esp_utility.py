import sys
import os 
from subprocess import check_call, Popen, PIPE, check_output
import datetime
import binascii
import time
import struct
import pathlib

THIS_DIRECTORY = pathlib.Path(__file__).parent.absolute()

def is_window():
    st =  platform.system()

    if st.find("Linux") > -1 or st.find('Darwin') > -1:
        return False
    else:
        return True

def execute_command(cmd):
    r = None
    r = check_output(cmd.split(" ")).decode('utf-8').split('\n')
    return r
# from process_factory import *

default_usb_port = "/dev/tty.usbserial-DO00FW3S"

# PYTHON = 'venv/bin/python'
PYTHON = 'python3'

print("PYTHON: {}".format(PYTHON))

def burn_efuse(usb_port = default_usb_port,iso_day = None,model='SBO2',version_code='2a2b1518',production_line='16'):
    r = None
    today = datetime.date.today()
    
    if iso_day is None:
        iso_day=today.strftime("%Y-%m-%d")
    # prdn_date=today.strftime("%y%U")
    '''    
    Jaan format will burn in fuse like that: <iso_date>:<model><versioncode><prdn_date><production_line>. 
    EX: 2018-04-17:SBO2_2a2b1518181516

    My format will remove prdn_date and burn on fuse like that: 2018-04-17:SBO2_2a2b1518_16 
    This will make more sense to me when i split string and show in my QC-Tool 
    '''
    prdn_format="{}:{}_{}_{}"    
    prdn=prdn_format.format(iso_day, model,version_code,production_line)

    usbPortFileName = usb_port.replace('/','_')
    fileToWriteEfuseData = '{}_{}.bin'.format(prdn, usbPortFileName)

    if os.path.exists(fileToWriteEfuseData):
        print("fileToWriteEfuseData exist>>>>>>>>>remove that one")
        os.remove(fileToWriteEfuseData)

    with open(fileToWriteEfuseData, 'wb') as keyfile:
        keyfile.write(prdn.ljust(32,'\0').encode('utf-8'))
        print("iso_day = {} model ={} production_number = {} production_line = {}".format(iso_day,model,version_code,production_line))
        '''
        remove --force-write-always option here because if we write new value on fuse, the result will be bitwise OR of new and old values.
        It lead to error when we try to read back  
        '''
    time.sleep(2)

    print("burn efuse with command: {}".format('{} tool/espefuse.py --port {} --do-not-confirm burn_key BLK3 tmp_prdn.bin --no-protect-key'.format(PYTHON,usb_port)))
    try:
        # check_call("{} tool/espefuse.py --port {} --do-not-confirm set_flash_voltage 1.8V".format(PYTHON,usb_port).split(" "))
        # print("{} tool/espefuse.py --port /dev/ttyUSB0 --do-not-confirm set_flash_voltage 1.8V".format(PYTHON))

        r = check_call([PYTHON, "tool/espefuse.py","--port",usb_port, "--do-not-confirm","burn_key","BLK3", fileToWriteEfuseData,"--no-protect-key"])
        print("burn production efuse at file: {}".format(fileToWriteEfuseData))
        # forece burn
        # r = check_call([PYTHON, "tool/espefuse.py","--port",usb_port, "--do-not-confirm","burn_key","BLK3",'tmp_prdn.bin',"--no-protect-key", "--force-write-always"])
    
        print("burned info device to efuse")
        os.remove(fileToWriteEfuseData)

        print("done burn efuse>>>>>>>>>deleted fileToWriteEfuseData:  {}".format(fileToWriteEfuseData))
    
    except Exception as e:
        print(str(e))

    return r

def burn_efuse_wrover(data, usbPort):
    today = datetime.date.today()
	# change format string 
    prdn_format="{}{}{}{}"
    PRDN_LEN = 12

    print("data: {}".format(data))
    print("data.keys(): {}".format(data.keys()))
    # if 'model' in data.keys() and 'version_code' in data.keys() and 'production_line' in data.keys():
	#     print("Invalid configuration, talk to Production Manager")
	#     exit(1)
    
    iso_date=today.strftime("%Y-%m-%d")
    prdn_date=today.strftime("%y%U")
	# remove prdn_date string in string to be burn 
    data["model"] = data["model"][1:]
    device_revision = data["version_code"][0:4]
    week = data["version_code"][4:]
    print("Model:", data["model"])
    print("Device revision:", device_revision)
    print("Week:", week)
    prdn=prdn_format.format(data["model"], device_revision, week, data["production_line"])
    '''
     NEW FORMAT for efuse WE WILL HAVE SOMETHING LIKE THIS <SBO2 stored by character><following string>
     old: <day strored by integer><following string>
    '''
    
    if len(prdn) > PRDN_LEN:
	    print("PRDN {} too long ({} bytes). Expected {} bytes".format(prdn, len(prdn), PRDN_LEN))
	    sys.exit()
	
    prdn = prdn[::-1] # Reverse byte order because burn_block_data cmd writes data to Efuse block in normal byter order
    input("prdn: {}".format(prdn))
    with open('tmp_prdn.bin','wb') as keyfile:
	    keyfile.write(prdn.ljust(32,'\0').encode('utf-8'))
	    # get rid of last 20 bytes
	    keyfile.seek(-20, os.SEEK_END)
	    keyfile.truncate()

    try:
        check_call(["python", "tool/espefuse.py", "--port", usbPort, "--do-not-confirm", "burn_block_data", "--offset", "0", "BLK3", 'tmp_prdn.bin'])
    except Exception as e:
        return str(e)
    
    return


def read_efuse(usb_port, block_number ='EFUSE block 3:'):
    """
    read fuse block. The fuse block is appear after line "EFUSE block 3:" something like that
    EFUSE block 3:
    00000000 35313600 74313831 5f746573 756f6e67 31373a68 2d30342d 32303138

        :param usb_port: usb-serial port 
        :param block_number: block-number to be read 
    """
    try:
        output = check_output([PYTHON ,os.path.join(THIS_DIRECTORY, "espefuse.py"),'--port',usb_port, 'dump'])
    except Exception as e:
        print(e)
        raise Exception("read efuse got error")


    flag_found_block = False 
    data = ''
    output = output.decode("utf-8")
    output = output.split('\n')
    
    for i in output:
        if 'EFUSE block 3:' in i:
            flag_found_block = True
            continue
        
        if flag_found_block:   
            block_data = i.split(' ')
            # reverse array block_data
            block_data = reversed(block_data)
            block_data = [i for i in block_data]
            data = ''.join(block_data)

            emptyEfuse = True

            for i in data:
                if i != '0':
                    emptyEfuse = False
                    
            if emptyEfuse:
                print("Empty Efuse")
                return
            
            data = str(binascii.a2b_hex(data).decode('ASCII'))

            print("efuse in device: {}".format(data))      
            # check whether fuse has been writen ?                                    
            return data

    return

def erase_firmware(port):
    r = ''
    commandCall = '{} tool/esptool.py --port {} erase_flash'.format(PYTHON, port)
    commandCall = commandCall.split(' ')
    
    try:
        r = check_output(commandCall)
    except Exception as e:
        print(e)
        return False
    return r.decode("utf-8")


def read_mac_esp32(usb_port = '/dev/ttyUSB0'):
    try:
        command = '{} tool/esptool.py -p {} -b 115200 --before default_reset --after hard_reset read_mac'.format(PYTHON, usb_port)
        r = check_output(command.split(" ")).decode("ASCII")
        print("read mac output: {}".format(r))
        
        p = r.find("MAC: ") + len("MAC: ")
        mac = r[p:]
        
        print("macAddress: {}".format(mac))
    except Exception as e:
        print(e)
        raise Exception("read macAddress Got error: {}".format(str(e)))
    return mac
# swap functions above to process 

def detect_type_esp32(usb_port = '/dev/ttyUSB0'):
    cmd = "{} tool/esptool.py -p {} -b 115200 flash_id".format(PYTHON, usb_port)
    cmd = cmd.split(" ")
    try:
        r = check_output(cmd).decode("utf-8")
    except Exception as e:
        return e
    find_flash = "Detected flash size: "
    index_flash = r.find(find_flash)
    flash_type = r[(index_flash + len(find_flash)) : r.find('\n',index_flash)]
    
    find_chip = "Chip is "
    index_chip = r.find(find_chip)
    chip_type = r[index_chip + len(find_chip) : r.find('\n', index_chip)]
    return flash_type, chip_type

'''
 if there is 1 value at this string  BLK3_PART_RESERVE      BLOCK3 partially served for ADC calibration data  = 0 R/W (0x0) => epressif use BLK3 for calirate ADC => remove
2. the string on BLK3 should be hikami format or 0
'''
def is_error_chip(usbPort='/dev/ttyUSB0'):
    EMPTY_EFUSE = False
    STRANGE_FORMAT_STRING_ERROR = "Strange Format String\n(Efuse Lỗi Vui Lòng Xếp Loại Fail)"
    READ_EFUSE_ERROR = "Read Efuse Error"
    EPRESSIF_USED_BLK3_ERROR = "Epressif used BLK3 for calibrate\n(Efuse Lỗi Vui Lòng Xếp Loại Fail)"
    CAN_NOT_READ_EFUSE = "Can't Read Efuse Please Try Again\n(Không Thể Đọc Efuse Vui Lòng Thử Lại)"
    BLK3_STR = ''

    try:
        a = execute_command("{} tool/espefuse.py --port {} summary".format(PYTHON, usbPort))
    except Exception as e:
        return "","","",CAN_NOT_READ_EFUSE
    # find blk3 
    BLK3_PART_RESERVE = [i for i in a if i.find("BLK3_PART_RESERVE      BLOCK3 partially served for ADC calibration data") > -1][0]
    print("found BLK3_PART_RESERVE: {}".format(BLK3_PART_RESERVE))
    if BLK3_PART_RESERVE.find('1') > -1:
        return '','','',EPRESSIF_USED_BLK3_ERROR
        
    
    BLK3_VALUE = [a[i+1] for i in range(len(a)) if a[i].find('Variable Block 3') > -1][0]
    print("found BLK3_VALUE: {}".format(BLK3_VALUE))
    BLK3_VALUE = BLK3_VALUE.replace("=", "")
    BLK3_VALUE = BLK3_VALUE.replace("R/W", '')
    BLK3_VALUE = BLK3_VALUE.replace(" ","")
    BLK3_VALUE = BLK3_VALUE.rstrip('\r')
    print("BLK3_VALUE extracted: {}".format(repr(BLK3_VALUE)))
    
    try:
        print(">>>>>>>>>>>>>>>>>>>>>>>1")
        BLK3_STR = binascii.a2b_hex(BLK3_VALUE).decode('utf-8')[::-1]
        print("BLK3_STR: {}".format(repr(BLK3_STR)))
        
        # if efuse empty the BLK3_STR value should be \x00\x00....\x00\x00
        if not [i for i in BLK3_VALUE if i.find('0') == -1]:
            EMPTY_EFUSE = True
            return BLK3_STR, BLK3_PART_RESERVE, EMPTY_EFUSE,''
        
        # is this format from hikami 
        elif BLK3_STR.split(':')[1].split('_')[0].find("SBO") > -1:
            return BLK3_STR, BLK3_PART_RESERVE, EMPTY_EFUSE, ''
        
    except Exception as e:
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>something wrong")
        return BLK3_STR, BLK3_PART_RESERVE, EMPTY_EFUSE, STRANGE_FORMAT_STRING_ERROR
    
    return BLK3_STR, BLK3_PART_RESERVE, EMPTY_EFUSE, STRANGE_FORMAT_STRING_ERROR

def check_and_burn_efuse(port, iso_day = None, model=None, version_code=None, production_line=None):
    BLK3_STR, BLK3_PART_RESERVE, EMPTY_EFUSE, STRANGE_FORMAT_STRING_ERROR = is_error_chip(port)
    r = None
    print('\tEMPTY_EFUSE: ', EMPTY_EFUSE, '\tSTRANGE_FORMAT_STRING_ERROR: ', STRANGE_FORMAT_STRING_ERROR)
    
    print('>>>>>>>>>>>>>>>>burn efuse:')
    # burn_efuse(usb_port=port,iso_day = iso_day, model=model, version_code=version_code, production_line=production_line)
    if (EMPTY_EFUSE and not STRANGE_FORMAT_STRING_ERROR):
        print('>>>>>>>>>>>>>>>>burn efuse:')
        print('iso_day: {} model: {}, version_code: {}, production_line: {}'.format(iso_day, model, version_code, production_line))
        burn_efuse(usb_port=port,iso_day = iso_day, model=model, version_code=version_code, production_line=production_line)
    else: 
        print("don't burn efuse")
        return

    print('>>>>>>>>>>>>>>>>>>>>>port: {}'.format(port))
    cmd = '{} tool/esptool.py --chip auto --port {} --after hard_reset run'.format(PYTHON, port)
    r = check_call(cmd.split(' '))
    print("excuted cmd: ", cmd)
    return

if __name__ == '__main__':
    # print("detect: {}".format(detect_type_esp32()))
    # burn_efuse_wrover(  data={"model":"SBO2", "version_code":"2e3a1849","production_line":'A'}, \
    #                     usbPort='/dev/tty.SLAB_USBtoUART')
    read_efuse('/dev/tty.SLAB_USBtoUART')
    # check_and_burn_efuse(port="/dev/tty.SLAB_USBtoUART", model='SBO2', version_code='3b3c1926', production_line='A')
    # burn_efuse(usb_port='/dev/tty.usbserial-DO00FV4Y',version_code='2a2b1518',production_line='16',model='SBO2')
    # print(read_efuse(usb_port='/dev/ttyUSB0',block_number='BLK3\n') == True)
    # is_error_chip(usbPort='/dev/tty.SLAB_USBtoUART')