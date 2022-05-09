const theBoot = require('./boot').theBoot
delay = require('delay');
ip = require('ip')

const fs = require('fs')
const path = require('path')
const csv = require('csvtojson');
const config = require('../config')
const {get, post} = require('axios')
const {hex_to_ascii, decimalToHexString} = require('./utility')
let date = require('date-and-time');
const CRC32 = require('crc-32');
// const delay = require('delay');

module.exports = {
    userConfirmRBGLedOk: null,

    userConfirmImageQualityOk: null, 

    TIME_OUT_ERROR: 30000,

    checkWifiConnection: async function(reportStatusRunningFunc) {
        let timeOutErr = this.TIME_OUT_ERROR
        theBoot.logDebugs = []

        theBoot.sendSerial('check_wifi Inconspicuous3G sunisrising')
        while(timeOutErr) {
            await delay(2000)
            timeOutErr -= 2000
            reportStatusRunningFunc(timeOutErr)
            if (theBoot.logDebugs.find(l => (l.indexOf('Connected to WIFI AP successfully') > -1))) {
                return true
            } else if (theBoot.logDebugs.find(l => (l.indexOf('Failed to connect to AP') > -1))) {
                return false
            }
        }

        return false
    },

    testUserButton: async function (reportStatusRunningFunc) {
        let timeOutErr = this.TIME_OUT_ERROR
        await delay(500)
        theBoot.sendSerial(`events_url http://${ip.address()}:8000/api/getTestingImage`)
        while(timeOutErr) {
            await delay(100)
            timeOutErr -= 100
            reportStatusRunningFunc(timeOutErr)
            for (let str of theBoot.logDebugs) {
                if (str.indexOf('User button was pressed') > -1) {
                    return true
                }
            }
        }

        return false 
    },

    testResetButton: async function(reportStatusRunningFunc) {
        timeOutErr = this.TIME_OUT_ERROR
        while (timeOutErr) {
            await delay(100)
            timeOutErr -= 100
            reportStatusRunningFunc(timeOutErr)
            for (let str of theBoot.logDebugs) {
                if (str.indexOf('Reset button was pressed') > -1) {
                    await delay(3000)
                    return true
                }
            }
        }
        await delay(2000)
        return false
    },

    testRGBLed: async function(reportStatusRunningFunc) {
        let timeOutErr = this.TIME_OUT_ERROR
        for (let led=0; led<8; led++) {
            theBoot.sendSerial(`led ${led}`)
            await delay(1000)
        }
        
        while(timeOutErr) {
            await delay(100)
            reportStatusRunningFunc(timeOutErr)
            timeOutErr -= 100
            if (this.userConfirmRBGLedOk !== null) {
                return this.userConfirmRBGLedOk
            } 
        }
        return false
    },

    testOpenFakeCap: async function(reportStatusRunningFunc) {
        // return true
        let timeOutErr = this.TIME_OUT_ERROR
        tryNum = 5
        let isUrlChangedSuccesful
        while(tryNum && !isUrlChangedSuccesful) {
            theBoot.sendSerial(`events_url http://${ip.address()}:8000/api/getTestingImage`)
            await delay(1000)
            theBoot.logDebugs.find(l => (l.indexOf('URL for opener-events system was successfully changed') > -1))
                                ? isUrlChangedSuccesful = true 
                                : isUrlChangedSuccesful = false
            
            tryNum -= 1
        }

        if(tryNum == 0) return false
        
        while(timeOutErr) {
            await delay(100)
            timeOutErr -= 100
            reportStatusRunningFunc(timeOutErr)
            
            for (let str of theBoot.logDebugs) {
                if(str.indexOf('Image was successfully saved into memory') > -1) {
                    return true
                }
            }
        }
        return false
    },

    confirmImageQuality: async function(reportStatusRunningFunc) {
        let timeOutErr = this.TIME_OUT_ERROR
        while(timeOutErr) {
            await delay(100)
            timeOutErr -= 100
            reportStatusRunningFunc(timeOutErr)
            
            if (this.userConfirmImageQualityOk !== null) {
                return this.userConfirmImageQualityOk
            } 
        }
        return false
    },

    checkBattery: async function(reportStatusRunningFunc) {
        let timeOutErr = this.TIME_OUT_ERROR
        let chargeVol = null
        let charginCurrent = null
        theBoot.logDebugs = []

        theBoot.sendSerial('charge')
        await delay(200)
        
        while(timeOutErr) {
            theBoot.sendSerial('charge')
            await delay(1000)
            timeOutErr -= 1000
            reportStatusRunningFunc(timeOutErr)
            for (let str of theBoot.logDebugs) {
                if ((str.indexOf('Charge Current: ') > -1) && (str.indexOf('Unrecognized')==-1)) {
                    charginCurrent = str.slice(str.indexOf('Charge Current: ') + 'Charge Current: '.length-1, str.length)
                    charginCurrent = charginCurrent.replace(/[\s|\n|\r]/g, '')
                    charginCurrent = parseFloat(charginCurrent)
                   console.log('charginCurrent: ', charginCurrent)
                }

                if (str.indexOf('Charge Voltage: ')>-1) {
                    chargeVol = str.slice(str.indexOf('Charge Voltage: ')+'Charge Voltage: '.length-1, str.length) 
                    chargeVol = chargeVol.replace(/[\s|\n|\r]/g, '')
                    chargeVol = parseFloat(chargeVol)
                    console.log("chargeVol: ", chargeVol)
                }
            }
            
            if ((chargeVol !== null) && (charginCurrent !== null)) {
                if ((chargeVol>0)&&(charginCurrent>50)) {
                    return true
                } else {
                    return false
                }
            }
        }

        return false
    },

    checkHallSensor: async function(reportStatusRunningFunc) {
        let timeOutErr = this.TIME_OUT_ERROR
        // let timeOutErr = 0
        while (timeOutErr) {
            await delay(1000)
            timeOutErr -= 1000
            reportStatusRunningFunc(timeOutErr)
            for (let str of theBoot.logDebugs) {
                if(str.indexOf('Hall sensor was triggered')>-1) {
                    return true
                }
            }
        }
        return false
    },

    checkOTASuccess: async function(reportStatusRunningFunc) {
        // return true

        timeOutErr = 180000
        let isCommandSendSuccessFul = false
        let tryNum = 5
        theBoot.sendSerial(`events_url http://${ip.address()}:8000/api/getTestingImage`)
        await delay(200) 
        
        let exitTimer = 2000
        while(!isCommandSendSuccessFul && exitTimer) {
            theBoot.sendSerial(`require_ota`)
            await delay(2000)

            if (theBoot.logDebugs.map(l=>(l.indexOf('OTA requirement was set') > -1)))  {
                break
            }
            exitTimer -= 2000
        }

        let isBoxDeviceStartSuccessful = false
        theBoot.logDebugs = []
        while(timeOutErr > 0) {
            // waiting for box start successful
            while(timeOutErr && !isBoxDeviceStartSuccessful) {
                reportStatusRunningFunc(timeOutErr)
                await delay(500)        
                timeOutErr -= 500 
                // if (theBoot.logDebugs.find(log => (log.indexOf('eFuse Vref calibration type') > -1))) {
                if (theBoot.logDebugs.find(log => (log.indexOf('Configure power save mode') > -1))) {
                    isBoxDeviceStartSuccessful = true
                    break
                }
            }
            delay(80000)
            while(tryNum) {
                await delay(3000)
                theBoot.sendSerial('version')
                reportStatusRunningFunc(timeOutErr)
                for (let str of theBoot.logDebugs) {
                    if (str.indexOf('FW Version: ') > -1) {
                        if (str.indexOf('BOx+/4')>-1) {
                            return true
                        } else {
                            return false
                        }
                    }
                }
                tryNum -= 1    
            }
            
        }
        return false 
    },

    changeToUrlDefault: async function(reportStatusRunningFunc) {
        // return true
        let timeOutErr = this.TIME_OUT_ERROR
        tryNum = 5
        let isUrlChangedSuccesful
        while(timeOutErr) {
            timeOutErr -= 100
            await delay(100)
            reportStatusRunningFunc(timeOutErr)
            if (theBoot.logDebugs.find(l=>(l.indexOf("https://api.wecheer.me")>-1))) 
                return true    
        }

        return false
    },

    inConnectingDevice: null,

    sendKey:  async function (reportStatusRunningFunc) {
        let timeOutErr = this.TIME_OUT_ERROR
        theBoot.logDebugs = []

        try {
            console.log(`get certificate info from this endpoind ${config.qcServerEndpoind}/api/getCertificateInfoBySerial?serial=${this.inConnectingDevice.serial}`)
            var certificateInfo = await get(`${config.qcServerEndpoind}/api/getCertificateInfoBySerial?serial=${this.inConnectingDevice.serial}`)    
            // var certificateInfo = await get(`${config.qcServerEndpoind}/api/getCertificateInfoHaveNotUsedYet`)    
            certificateInfo = certificateInfo.data
            
            if (!certificateInfo.serial | !certificateInfo.PEM | !certificateInfo.privateKey) 
                throw Error(`lack certificate info, currently certificate got: ${certificateInfo}`)
            
            console.log("certificateInfo: ", certificateInfo)
        } catch (error) {
            console.log("get certificateInfo error: ", error)    
            return false
        }
        
        const sendKey = async (commandSend, tryNum, expectedResponse) => {
            if (timeOutErr < 0) return

            while (tryNum--) {
                timeOutErr -= 1000
                theBoot.sendSerial(commandSend)
                
                await delay(2000)

                let logStoreExpectedResponse = theBoot.logDebugs.find(l => (l.indexOf(expectedResponse) > -1))
                if (logStoreExpectedResponse) return true

                if (reportStatusRunningFunc) reportStatusRunningFunc(timeOutErr)
            }

            return false
        }

        certificateInfo.privateKey = certificateInfo.privateKey.replace(/-/g,'_')
        config.CA_ROOT_KEY = config.CA_ROOT_KEY.replace(/-/g, '_')
        certificateInfo.PEM = certificateInfo.PEM.replace(/-/g, '_')

        certificateInfo.privateKey = certificateInfo.privateKey.replace(/\n/g,'>')
        config.CA_ROOT_KEY = config.CA_ROOT_KEY.replace(/\n/g, '>')
        certificateInfo.PEM = certificateInfo.PEM.replace(/\n/g, '>')

        let crcString = null

        crcString = CRC32.str(certificateInfo.privateKey)
        crcString = decimalToHexString(crcString)
        if (crcString.length < 8) crcString = `${'0'.repeat(8 - crcString.length)}${crcString}`

        // crcString = crcString.substring(8, crcString.length)
        if (!await sendKey(`private_key "${certificateInfo.privateKey}${crcString}"`, 3, 'The private key was stored successfully')) return false

        crcString = Number(CRC32.str(config.CA_ROOT_KEY))
        crcString = decimalToHexString(crcString)
        if (crcString.length < 8) crcString = `${'0'.repeat(8 - crcString.length)}${crcString}`
        if (!await sendKey(`root_ca "${config.CA_ROOT_KEY}${crcString}"`, 3, 'The root-CA key was stored successfully')) return false
        await delay(200)
        
        crcString = Number(CRC32.str(certificateInfo.PEM))
        crcString = decimalToHexString(crcString)
        if (crcString.length < 8) crcString = `${'0'.repeat(8 - crcString.length)}${crcString}`
        // crcString = crcString.substring(8, crcString.length)
        if (!await sendKey(`cert_key "${certificateInfo.PEM}${crcString}"`, 3, 'The certificate key was stored successfully')) return false
        await delay(200)           
        
        return true
    }
}