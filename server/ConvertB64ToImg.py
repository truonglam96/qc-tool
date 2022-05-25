from subprocess import check_output
import base64
import sys

def execute_command(cmd):
    r = None
    try: 
        r = check_output(cmd.split(" ")).decode('utf-8').replace('\n', '')
    except Exception as e:    
        return str(e)
    return r

# img out should be .png
def b64_to_img(b64String, imgOut):
    b64File = imgOut.replace('.png', '')
    b64File = "../templates/build/static/testImages/{}".format(b64File)
    with open(b64File,'wb') as f:
        raw_bytes = base64.b64decode(b64String)
        l =  f.write(raw_bytes)
        
        if l != 76800:
            print(l)
    
    try:    
        # my command will jumpt to resource/imgs for converting
        execute_command('sh convert_b64_to_img.sh ../templates/assets/img/testImages ./bayer2rgb {} {}.tiff'.format(b64File,b64File))    
    except Exception as e:
        print(e)
        return 
    
    return imgOut

if __name__ == "__main__":
    b64_to_img(sys.argv[1], sys.argv[2])