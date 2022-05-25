try {
    delay = require('delay');
} catch (error) {
    console.log("can not import module delay");
    delay = (ms) => {
        console.log(`virtual delay in ${ms}`);
        return;
    }
}

const fs = require('fs')
const path = require('path')
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
var utility = require('./utility');
var arr_diff = utility.arr_diff
var listFolder = utility.listFolder
var esp = require("./esp").esp
// const manualTest = require('./manualTest')
const { testingResult } = require('./models')
const events = require('events');
const {execSync} = require('child_process')
const util = require('util')
const config = require('../config')

var listSerialPortsAsync = util.promisify(SerialPort.list) 

module.exports = {
    theBoot: {
        delay: delay,
        // methods for control and  prevent hardware from conflict 
        hardwareManager: {
            isOsSupportHardware: false,
            // make virtual gpio class becasue my macbook is not support this framework
            Gpio: class Gpio {
                constructor(pinNum, direction) {
                    this.runAsVirtual = true;
                    this.pinNum = pinNum;

                    try {
                        const Gpio = require('onoff').Gpio;
                        let a = new Gpio(pinNum, direction);
                        return a
                    } catch (error) {  
                        this.writeSync = (level) => {
                            console.log(`virtual write Pin: ${this.pinNum}\tlevel: ${level}`);
                        }

                        this.direction = () => {
                            console.log(`virtual write Pin Can't get direction`);
                        }

                        this.setDirection = (dir) => {
                            console.log(`pin: ${this.pinNum}\tset dir: ${dir}`);
                        }
                    }
                }

            },

            // store all pin 
            pins: {
            },

            initPin: function (pinNUM, direction) {
                if (this.pins[String(pinNUM)] == null) {
                    this.pins[String(pinNUM)] = { pinClass: new this.Gpio(pinNUM, direction), dir: direction };
                }

                // just update direction 
                else {
                    if (this.pins[String(pinNUM)].dir != direction) {
                        this.pins[String(pinNUM)].pinClass.setDirection(direction);
                        this.pins[String(pinNUM)].dir = direction;
                    }
                }
                return this.pins[String(pinNUM)];
            },

            setPinLevel: function (pinNum, level) {
                this.initPin(pinNum, 'out').pinClass.writeSync(level)
            },

            getPinLevel: function (pin) {
            },

            unexportAllPins: function () {
                for (let i in this.pins) {
                    try {
                        this.pins[String(i)].pinClass.unexport();  
                    } catch (error) {
                        
                    }
                }

                this.pins = []
            }
        },

        macAddress: null,
        
        allLogDebugs: [],

        logDebugs: [],

        checkerHandles: [],

        autoConnectEsp: true, 

        serialPortConnecting: null, 

        serialPorts: [],

        serialPortObj: null,

        onDeviceBusy: false,

        onRunningAutomaticTesting: false,

        onRunningManualTesting: false,

        testingDevicesStack: [],

        productionMode: false, 

        testAutomaticMode: false, 

        testManualMode: false,

        deviceBroken: false,

        oldAutomaticTestingResult: [],

        isAutomaticTestingPass: false,

        oldManualTestingResult: [],

        lastTestingResult: null,

        listSerialPorts: async function() {
            let gotSerialPortInfos = []
            let gotSerialPorts = []
            if (config.os != 'macOS') {
                gotSerialPortInfos = await SerialPort.list() // on macbook, this method use with cp2012 cause bocking here 
                // console.log("gotSerialPortInfos: ", gotSerialPortInfos)
                gotSerialPorts = gotSerialPortInfos.map(wholeSerialPortInfo => (wholeSerialPortInfo.path))
            } else {
                gotSerialPortInfos = fs.readdirSync('/dev/')
                gotSerialPorts = gotSerialPortInfos.filter((pathSerial)=>{
                    if(pathSerial.match(/usb/i)) {
                        // console.log("matched pathSerial: ", pathSerial)
                        // console.log("path.join('/dev', pathSerial): ", path.join('/dev', pathSerial))
                        return pathSerial
                    }
                })

                gotSerialPorts = gotSerialPorts.map(serialPort => (path.join('/dev/', serialPort)))
            }
            // console.log("gotSerialPorts: ",gotSerialPorts)

            return gotSerialPorts
        },

        getFirmwaresList: function() {
            let r =  listFolder(path.join(__dirname, 'firmwares'))
            return r
        },

        findSerialPortClosedConnection: async function(oldSerialPorts) {
            let portClosed = null
            
            let currentSerialPorts = await this.listSerialPorts()
            portClosed = oldSerialPorts.find(oldSerialPort=> (currentSerialPorts.indexOf(oldSerialPort) === -1))

            return String(portClosed)
        },

        // serialPortsEventHandle is callback function that use for broadcast 
        // a event when new serial port appear or old serial port remove.
        //  It apply two args:
        // 1: New port appear
        // 2: old port remove  
        findSerialPorts: async function (serialPortsEventHandle) {     
            let newPortConnected = null
            let oldPortRemoved = null
    
            while (true) {
                // find newport
                this.serialPorts = await this.listSerialPorts()
                
                while (true) {
                    await delay(100)
                    let currentSerialPorts = await this.listSerialPorts()
                    // console.log("currentSerialPorts: ", currentSerialPorts)
                    if (this.serialPorts.length < currentSerialPorts.length) { // new port connect
                        this.serialPortConnecting = arr_diff(currentSerialPorts, this.serialPorts)[0]
                        if (this.autoConnectEsp) {
                            // get the last serial port found for connect   
                            newPortConnected  = arr_diff(currentSerialPorts, this.serialPorts)[0]
                            // console.log("detect new port: ", newPortConnected)

                            if (serialPortsEventHandle) {
                                serialPortsEventHandle(newPortConnected, null)
                            }
                        } 
                        this.serialPorts = await this.listSerialPorts()
                    }
                    else if (this.serialPorts.length > currentSerialPorts.length) { // one serial port closed connection
                        console.log("one serial begin remove")
                        oldPortRemoved = await this.findSerialPortClosedConnection(this.serialPorts)
                        this.serialPorts = await this.listSerialPorts()                     
                        if(oldPortRemoved && serialPortsEventHandle) {
                            serialPortsEventHandle(null, oldPortRemoved)
                        }
                    }
                }
            }
        },

        getInfoDevice: async function() {
            let infoDevice = null
            let tryNum = 3
            this.logDebugs = [] 

            while(tryNum && !infoDevice) {
                this.sendSerial('info')
                await this.delay(1000)
                infoDevice = this.logDebugs.find(l => l.indexOf("date") > -1 && l.indexOf('efuse') > -1)

                if(infoDevice) {
                    try {
                        infoDevice = JSON.parse(infoDevice)    
                        console.log("get info Device: ", infoDevice)
                        return infoDevice
                    } catch (error) {
                        console.log("parse info device to json error, infoDevice: ", infoDevice)
                    }
                }

                tryNum -= 1
            }
          
            return false
        },

        getMacAddressDevice: async function() {
            this.logDebugs = []
            let macAddress = null
            // await delay(8000)
            if(this.serialPortObj && this.serialPortObj.isOpen) {
                for (let tryNum=0; tryNum < 5; tryNum++)
                {
                    this.sendSerial("mac")
                    await delay(2000)
                    macAddress = this.logDebugs.find(l => (l.indexOf('MAC: ') > -1))
                    if (macAddress) {
                            macAddress = macAddress.slice(macAddress.indexOf("MAC: ") + "MAC: ".length, macAddress.length)
                            macAddress = macAddress.replace(/(\r|\n|\s)/g, '')
                            macAddress = macAddress.trim()
                            this.macAddress = macAddress
                            return  macAddress
                    }
                }
            }

            return false
        },

        closeSerialPort: async function() {
            if (this.serialPortObj && this.serialPortObj.isOpen) {
                try {
                    this.serialPortObj.close()
                    await this.waitingForSerialPortClose()    
                } catch (error) {
                    console.log("close serial port got error: ", error)
                }    
            }

            return
        },

        serialPortEvent: new events(),

        /* 
            eventHandleFunction is func with arg:
            1. serialData
            2. connectToSerialPortStatus which may be 
               "serialConnectSuccessful"| "serialCloseConnection" | "serialConnectionFail"
        */
        connectEspSerialPort: function(port, eventHandleFunction) {
            // MUST NEED SPACE
            try {
                // window ?
                // this.serialPortObj = new SerialPort(port, { baudRate: 115200, autoOpen:false, rtscts: true})

                this.serialPortObj = new SerialPort(port, {baudRate: 115200, autoOpen:false})

                this.serialPortObj.open((err)=>{
                    if(!err){
                        console.log(">>>>>>>>>>>>>>serial port connect successful")

                        this.serialPortConnecting = port

                        const parser = new Readline()
                        this.serialPortObj.pipe(parser)
                        
                        parser.on('data', data => {                  
                            console.log(data)
                            this.logDebugs.push(data)
                            this.allLogDebugs.push(data)
                            this.serialPortEvent.emit("data", data)
                        })
                        
                        parser.on("close", ()=>{
                            console.log(">>>>>>>>>>>>>>>>serial port closed connection")
                        })

                        parser.on("error", (err)=>{
                            console.log("serial port got error: ", err)
                        })

                    } else {
                         console.log('connect serial error' + err);
                        if (eventHandleFunction) {
                            eventHandleFunction(null, "serialConnectionFail")
                        }
                    }
                })
            } 
            
            catch (error) {
                console.log('connect serial error' + error);
                if (eventHandleFunction) {
                    eventHandleFunction(null, "serialConnectionFail")
                }
            }

            return this.serialPortEvent
        },

        registerCallbackToDataSerialEvent: function(callbackFn) {
            this.serialPortEvent.on("data", callbackFn)
        },

        registerSerialPortClosedEvent: function(callbackFn) {
            this.serialPortEvent.on("close", callbackFn)
        },

        printLabel: function(macAddress, version_code) {
            let macAddressInQRCode = macAddress.replace(/:/g, '')

            let printerPorts = fs.readdirSync('/dev/usb/').map(d=>{return `/dev/usb/${d}`})
            let printerPort = printerPorts.find(printerPort=>{
                return printerPort.indexOf('lp') > -1
            }) 

            version_code = `PN: ${version_code}`
            let macAddressLength = macAddress.length
            let lastMacAddressLetters = macAddress.substring(macAddressLength - 5, macAddressLength)
            console.log(`version_code: ${version_code} macAddress: ${macAddress} macAddressInQRCode: ${macAddressInQRCode} printerPort: ${printerPort} printing command file: ${config.printingLabelCommandFile} lastMacAddressLetters: ${lastMacAddressLetters}`)
            execSync(`sudo sh ${config.printingLabelCommandFile} "${version_code}" ${macAddress} ${macAddressInQRCode} ${printerPort} ${lastMacAddressLetters}`)
        },

        waitingForSerialPortOpen: async function() {
            let TIMEOUT_ERR = 10000
            
            while(TIMEOUT_ERR) {
                await delay(100)
                
                TIMEOUT_ERR -= 100

                if(this.serialPortObj && this.serialPortObj.isOpen) {
                    return true
                } 
            }
            
            return false
        },

        waitingForSerialPortClose: async function() {
            if(this.serialPortObj) {
                let timeoutError = 5000
                while((timeoutError > 0) && this.serialPortObj.isOpen){
                    await delay(100)
                    timeoutError -= 100
                    console.log("waiting for serial port close")
                }
            }

            return 
        },

        burnFirmware: async function(firmwarePath) {
            console.log("firmwarePath: ", firmwarePath)
            this.onDeviceBusy = true
            let r = null
            await this.closeSerialPort()
            await this.waitingForSerialPortClose()
            
            try {
                r = await esp.burnFirmware(this.serialPortConnecting, firmwarePath)
                this.connectEspSerialPort(this.serialPortConnecting);
                await this.waitingForSerialPortOpen()
                // let resetChipResult = await esp.resetChip(this.serialPortConnecting)
                // console.log("resetChipResult: ", resetChipResult)
            } catch (error) {
                console.log("burn firmware error: ", error)
                this.onDeviceBusy = false
                throw error
            } 

            return r
        },

        eraseFirmware: async function(port, firmwarePartition) {
            this.onDeviceBusy = true
            let r = null
            let closeSerialPortResult = await this.closeSerialPort()
            console.log("closeSerialPortResult: ", closeSerialPortResult)
            try {
                if (!firmwarePartition) {
                    console.log("erase all firmware")
                    r = await esp.eraseFirmware(port ? port : this.serialPortConnecting)
                } else {
                    console.log("just erase firmware partition")
                    r = await esp.eraseFirmwarePartition(port ? port : this.serialPortConnecting)
                }
            } catch (error) {
                console.log("eraseFirmware error: ", error.toString())
                throw error
            } finally {
                this.connectEspSerialPort(this.serialPortConnecting)
                await this.waitingForSerialPortOpen()
                this.onDeviceBusy = false   
            }
            return r
        },
 
        runPinActions: async function (pins) {
            let promse = []
            pins.map(pin=>{
                // Run Pin
                promse.push((async () => {
                    for (let i of pin.actions) {
                        this.hardwareManager.setPinLevel(pin.pinNum, i.on ? 1 : 0)
                        await delay(i.timeLength)
                    }
                })());
            })

            await Promise.all(promse).then(result=>{
            })

            return "Done run pin action"
        },

        runCommandActions: async function (commands) {
            for (command of commands) {
                this.sendSerial(command.command)
                await delay(1000)
                // await delay(command.timeLength) 
            }
        },

        sendSerial: function(command) {
            var errorMessage = null
            if (this.serialPortObj && command) {
                this.serialPortObj.write(`${command}\n`, (err, byteWriten)=>{
                    if (err) {
                        console.log(`send command ${command} get error: `, err)
                    } else {
                        console.log(`send command ${command} successful`)
                    }                  
                })
            } 
            
            else {
                errorMessage = "serialPortIsNotAvailable"
                console.log("send serial fail>>>>>>>>>")
            }
        },

        waitingForTestingFirmwareStartSuccessfully: async function() {
            let TIMEOUT_ERR = 10000
            this.logDebugs = []
            while (TIMEOUT_ERR) {
                if (this.logDebugs.find(l => (l.indexOf('Free memory after objects/tasks was stared') > -1))) break
                
                await delay(1000)
                TIMEOUT_ERR -= 1000
            }

            return false
        },

        checkIsManualFirmwareBurned: async function() {
            this.logDebugs = []
            let numTest = 5
            let info = null
            while(numTest) {
                this.sendSerial('info')
                await delay(500)
                
                info = this.logDebugs.find(l => (l.indexOf('FW_Version') > -1 
                                            && l.indexOf('efuse') > -1))
                
                info ? info = JSON.parse(info) : null

                if (info) {
                    console.log("info: ", info)
                    console.log('info["FW Version"]: ', info["FW_Version"])
                    if (info["FW_Version"].indexOf('MANUAL') > -1) {
                        return true
                    }  else {
                        return false
                    }
                }
                numTest -= 1 
            }

            return false        
        },

        expectedLogDebugChecker: async function (expect)  {
            let RESOLUTION_TIMER = 10
            let searchedLogDebugs = []
            let timeoutError = parseInt(expect.timeoutError)
            let lastIndexLogDebugChecked = this.logDebugs.length - 1
            if (lastIndexLogDebugChecked < 0) {
                lastIndexLogDebugChecked = 0 
            }

            let searchedTime = 0

            let resultTesting = {
                error: [],
                pass: []
            }

            expect.logDebugs.map(logDebug=>{
                resultTesting.error.push(logDebug.logDebug)
            })

            // console.log("search for log debug: ", JSON.stringify(expect.logDebugs))

            while (timeoutError) {
                timeoutError -= RESOLUTION_TIMER
                searchedTime += RESOLUTION_TIMER
                await delay(RESOLUTION_TIMER)
                this.checkSerialPortConnection()

                while ((lastIndexLogDebugChecked < this.logDebugs.length)) {
                    expect.logDebugs.map(logDebug=>{
                        if (this.logDebugs[lastIndexLogDebugChecked].indexOf(logDebug.logDebug) > -1) {
                            resultTesting.pass.push({
                                searchString: logDebug.logDebug,
                                afterTime: searchedTime
                            });

                            searchedLogDebugs.push(logDebug.logDebug)

                            if (resultTesting.error.indexOf(logDebug.logDebug) > -1) {
                                resultTesting.error.splice(resultTesting.error.indexOf(logDebug.logDebug), 1)
                            } 

                            if (resultTesting.error === null) {
                                resultTesting.error = []
                            }
                    
                            console.log("searchedLogDebugs: ",logDebug.logDebug, "at String: ", this.logDebugs[lastIndexLogDebugChecked])
                        }
                    });
                    
                    // if one log debug expeced is searched i remove it from the error array
                    // if the error array is empty i know that all log debug has been searched and stop searching
                    if (resultTesting.error.length == 0) {
                        return resultTesting
                    }

                    lastIndexLogDebugChecked += 1   
                }    
                
            }
        
            return resultTesting
        },  

        returnResultsChecking: function(resolve) {    
            if (resolve.error) {
                this.resultTesting.error.push(resolve.error);
            } else {
                this.resultTesting.pass.push(resolve.pass);
            };
        },        
        
        returnResultsChecking: function(resolve) {    
            if (resolve.error) {
                this.resultTesting.error.push(resolve.error);
            } else {
                this.resultTesting.pass.push(resolve.pass);
            };
        },

        manualTestingAction: async function(manualTestingAction) {
            // let TIMEOUT_ERR = parseInt(manualTestingAction.timeoutError)
            console.log("test with action name: ", manualTestingAction.name)
            let result = false
            try {
                this.logDebugs = []
                result = await manualTest[manualTestingAction.name]((restTime)=>{
                
                    if(!this.serialPortObj.isOpen) {
                        throw Error("deviceBroken")
                    }
                })   
            } catch (error) {
                throw Error("deviceBroken") 
            }

            return {
                nameTest: manualTestingAction.name,
                result: result,
                infoName: manualTestingAction.infoName
            }

        },

        // this funtion is not stable in working, by somehow if the previously serial port got remove
        // the new serial path imedialy bind to this.serialPortObj (i checked connectEspSerialPort function to make sure there isn't new connection pawn) 
        // so that this.serialPortObj.isOpen return true :(  so bad !!!
        checkSerialPortConnection: function() {
            if(this.serialPortObj && !this.serialPortObj.isOpen) {
                console.log(">>>>>>>>>>>>>>>>>serial broken is detected")
                throw Error("deviceBroken")
            }
        },

        checkAndBurnEfuse: async function(port, efuseConfig) {
            await this.closeSerialPort()
            await this.waitingForSerialPortClose()
            // await this.getEfuseConfig()
            if (efuseConfig) {
                console.log("burn efuse with info: ", efuseConfig)
                await esp.checkAndBurnEfuse(port, efuseConfig)
            } else {
                console.log("efuse config == null ===> don't burn efuse")
            }
        },

        getFirmwareVersion: async function() {
            let numTry = 5
            let firmwareVersion
            this.logDebugs = []
            while(numTry--) {
                this.sendSerial('version')
                await delay(500)
                firmwareVersion = this.logDebugs.find(l => (l.indexOf('FW Version') > -1))
                if (firmwareVersion) {
                    firmwareVersion = firmwareVersion.substring(firmwareVersion.indexOf('FW Version') + 'FW Version'.length, firmwareVersion.length -1)
                    return firmwareVersion
                }
            }

            return 'unKnown'
        },

        removeDeviceFromTestingDeviceStack: function(serialPort) {
            if (this.testingDevicesStack) {
                var elementDelected = this.testingDevicesStack.splice(this.testingDevicesStack.indexOf(serialPort), 1)
                
                if (!elementDelected) {
                    console.log("can't find device in testingDevicesStack for delecting")
                } else {
                    console.log("removed serial port", elementDelected, "from testingDevicesStack, this.testingDevicesStack: ", this.testingDevicesStack)
                }
            }
        },

        runBoot: async function (scenarioTests, testingName, getScenairoRunningStatusFn , beginRunActionCallBack, afterActionRunCallBack) {
            this.allLogDebugs = []
            let scenarioTestIndex = 0 
            let actionIndex = 0
            let resultStored = []
            scenarioTestResult = []
            try {
                scenarioTests = JSON.parse(scenarioTests)
            } catch (error) {
                
            }

            let scenarioTestResultSummarize = scenarioTests.map(scenarioTest => ({
                scenarioTestName: scenarioTest.name,
                result: false
            }))

            for (scenarioTest of scenarioTests) {
                scenarioTestResult = []
                let isSenarioTestGotError = false
                if(getScenairoRunningStatusFn) getScenairoRunningStatusFn(scenarioTest)

                for (let i = 0; i < parseInt(scenarioTest.numLoop); i++) {
                    
                    for (action of scenarioTest.actions) {
                        
                        if(beginRunActionCallBack) {
                            beginRunActionCallBack(scenarioTestResultSummarize, action.key, action.type)
                        }

                        this.logDebugs = []
                        
                        await this.runAction(action)
                                .then(actionTestingResult => {
                                    scenarioTestResult.push({
                                        logDebugsSearchedResult: JSON.stringify(actionTestingResult),
                                        scenarioTestName: scenarioTest.name,
                                        scenarioTestIndex: scenarioTestIndex,
                                        actionIndex: actionIndex,
                                        atNumLoop: i
                                    })

                                    console.log("actionTestingResult: ", actionTestingResult)
                                    if(actionTestingResult.error.length > 0) {
                                        isSenarioTestGotError = true
                                    } else {
                                            isSenarioTestGotError = false
                                    }

                                    if (afterActionRunCallBack) {
                                        scenarioTestResultSummarize = scenarioTestResultSummarize.map(result=>{
                                            if(result.scenarioTestName == scenarioTest.name) {
                                                console.log('update result for scenarioTest.name: ', scenarioTest.name)
                                                result.result = !isSenarioTestGotError
                                            }
                                            return result
                                        })

                                        afterActionRunCallBack(actionTestingResult,action.key, action.type, scenarioTestResultSummarize, resultStored)
                                    }
                                })
                                .catch(err=>{
                                    console.log("run action throw error: ",err)
                                    throw err
                                })
      
                        actionIndex += 1
                    }
                    actionIndex=0;
                }

                if(getScenairoRunningStatusFn) getScenairoRunningStatusFn(scenarioTest)
                
                resultStored.push(scenarioTestResult)
                scenarioTestIndex += 1
            }

            return resultStored
        },

        getBatteryLevel: async function() {
            let timeoutError = 2000
            let batteryString = ''
            let batteryLevel = null 
            while(timeoutError) {
                this.sendSerial('battery')
                await delay(500)
                timeoutError -= 500
                batteryString = this.logDebugs.find(l=> (l.indexOf('Battery') > -1))
                
                if(batteryString) {
                    batteryLevel = batteryString.substring('Battery:'.length, batteryString.length - 1) 
                    console.log("get battery level: ", batteryLevel)
                    if(batteryLevel) return parseInt(batteryLevel)
                }
            }
        },

        runAction: async function (action) {
            var testingResult = null;
            let ERROR = null

            let typeAction = action.type
            
            if (typeAction === "gpio") {
                console.log("run gpio actions")

                await Promise.all([
                    this.runPinActions(action.pinSettings),
                    this.runCommandActions(action.commandSetting.commands),
                    this.expectedLogDebugChecker(action.expect),
                ]).then(result=>{
                    console.log("runCommandActions Result: ", result[1]);
                    testingResult = result[2] 
                    console.log("expectedLogDebugChecker: ", JSON.stringify(result[2]))
                }).catch(error => {
                    console.log("run action gpio got error: ", error)
                    ERROR = "GPIO Action Error" 
                })
            } else if (typeAction === "eraseFirmware") {
                console.log("run action type erase firmware")
                
                await Promise.all([
                    this.eraseFirmware(this.serialPortConnecting),
                    this.expectedLogDebugChecker(action.expect)
                ]).then(result=>{
                    // console.log(result)
                    testingResult = result[1]
                }).catch(err=>{
                    console.log("eraseFirmware Error: ", err)
                    ERROR = `eraseFirmware Action Error`
                });
            } else if (typeAction === "burnFirmware") {
                // console.log('burfirwame: ', action.chooseFirmwareForBurning.firmwareChoosed)
                await Promise.all([
                    // this.burnFirmware(`./firmwares/${action.chooseFirmwareForBurning.firmwareChoosed}`),
                    this.burnFirmware(path.join(__dirname,'firmwares', action.chooseFirmwareForBurning.firmwareChoosed)),
                    this.expectedLogDebugChecker(action.expect)
                ]).then(result=>{
                    console.log(result)
                    testingResult = result[1]
                }).catch(err=>{
                    console.log("burnFirmware Action error: ", err)
                    ERROR = "burnFirmware Action error"
                })
                
            } else if (typeAction === "command") {
                console.log("run action command: ", action.commandSetting.commands)
                await Promise.all([
                    this.runCommandActions(action.commandSetting.commands),
                    this.expectedLogDebugChecker(action.expect)
                ]).then(resolve=>{
                    console.log("runCommandActions Result: ", resolve[0]);
                    console.log("expectedLogDebugChecker: ", JSON.stringify(resolve[1]))
                    testingResult = resolve[1]
                }).catch(err=>{
                    console.log("run command action err: ", err);
                    ERROR="command Action Error"
                });
            } else if (typeAction === "delay") {
                console.log("run action delay: ", action.delayAction.delayTime)
                await Promise.all([
                    delay(parseInt(action.delayAction.delayTime)),
                    this.expectedLogDebugChecker(action.expect)
                ]).then(resolve=>{
                    console.log("expectedLogDebugChecker: ", JSON.stringify(resolve[1]))
                    testingResult = resolve[1]
                }).catch(err=>{
                    console.log("run delay action error: ", err)
                    ERROR="Delay Action Error"
                })
            }

            if (ERROR) {
                // console.log("run action throw error")
                throw Error(ERROR)
            }

            this.checkSerialPortConnection()
                
            // this.connectEspSerialPort(this.serialPortConnecting);
            console.log(">>>>>>>>>>>>>>>>>>>>>runAction finish\n\n\n ")
            return testingResult
        }
    }
}

