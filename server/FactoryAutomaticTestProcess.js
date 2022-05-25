const {theBoot} = require('./boot')
const { listFolder, consoleToLogger, uuidv4 } = require('./utility')
const {automaticTestingResult, manualTestingResult} = require('./models')
const axios = require('axios')
const {fork} = require('child_process')
// var cluster = require('cluster')
const esp = require('./esp').esp
const delay = require('delay')


const conf = require('../config')

var THE_BOOT_DATA = null 


const TESTING_STATUS = {
    IN_WAITING: 1,
    IN_TESTING: 2,
    TESTING_FAIL: 3,
    DEVICE_BROKEN: 4,
    TESTING_PASS: 5,
}

module.exports = {
    TESTING_STATUS
}

var TESTING_MODE_CHOOSED = null
var TESTING_DEVICES_STACK = []
var IN_TESTING_PROCESS = false

function removeDeviceFromTestingDeviceStack(serialPort, testingDevicesStack) {
    let elementDelected = null
    let deviceToRemoveIndex = null

    deviceToRemoveIndex = testingDevicesStack.findIndex((device)=>{
        return device.serialPort.substring(device.serialPort.length-6,device.serialPort.length-1) === serialPort.substring(serialPort.length-6, serialPort.length-1)
    })

    if (deviceToRemoveIndex > -1) {
        // elementDelected = testingDevicesStack.splice(deviceToRemoveIndex, 1)
    }
     
    if (!elementDelected) {
        console.log("can't find device in testingDevicesStack for delecting")
    } else {
        console.log("removed serial port", elementDelected[0].serialPort)
    }

    return testingDevicesStack
}

function sendTestingRunningStatusToClient() {
    let sendBackToClient = JSON.parse(JSON.stringify(TESTING_DEVICES_STACK))
    sendBackToClient = sendBackToClient.map(d=>{
        delete d.workerProcess
        return d
    })
    process.send({
        api: "testingRunningStatus", 
        data: sendBackToClient
    })
}

function startTestingDevice() {
    TESTING_DEVICES_STACK = TESTING_DEVICES_STACK.map(deviceForTesting=>{
        if (deviceForTesting.testingStatus == TESTING_STATUS.IN_WAITING) {
            let worker = fork('./automaticTestDeviceProcess.js')
            console.log(`forked testing process at serial port: `, deviceForTesting.serialPort)
            worker.on("message", async sms => { // forward testing process to parent process
                if(sms.api == "testingRunningStatus") {
                    updateTestingDeviceStack(sms.data)
                    sendTestingRunningStatusToClient()
                } else {
                    process.send(sms)
                }
            }) 
    
            worker.on("exit", ()=>{
                console.log(">>>>>>>>>>>>>>>>>>one testing process close")
                checkAllDevicesTested(TESTING_DEVICES_STACK)
            })
    
            worker.send({ // send command for running testing
                api: "runTesting",
                data: {
                    device: deviceForTesting,
                    theBootData: THE_BOOT_DATA,
                    bootName: THE_BOOT_NAME,
                    efuseConfig: theBoot.efuseConfig
                }
            })
    
            deviceForTesting.workerProcess = worker
        }

        return deviceForTesting
    })
}

function updateTestingDeviceStack(deviceIntestingProcess) {
    let idDeviceInTestingProcess = TESTING_DEVICES_STACK.findIndex(device => {return device.key === deviceIntestingProcess.key})
    if (idDeviceInTestingProcess > -1) {
        delete deviceIntestingProcess.workerProcess
        TESTING_DEVICES_STACK[idDeviceInTestingProcess] = {...TESTING_DEVICES_STACK[idDeviceInTestingProcess], ...deviceIntestingProcess} 
    } else {
        // console.log("event handle can't find intestingDevice in testingDevicesStack-----> device being remove")
    }
}

function checkAllDevicesTested(testingDevicesStack) {
    let deviceWaitingForTest = testingDevicesStack.find(device => (device.testingStatus == TESTING_STATUS.IN_WAITING))
    if (!deviceWaitingForTest) {
        IN_TESTING_PROCESS = false
        process.send({
                api: "onTestingProcessRunning",
                data: IN_TESTING_PROCESS
        })
    }
}
function createTestingDevice(newSerialPortConnected) {
    return {
        testingStatus: TESTING_STATUS.IN_WAITING,
        serialPort: newSerialPortConnected,
        serialData: '',
        macAddress: '',
        timeTestingRunning: 0,
        HPI: null,
        key: uuidv4(),
        workerProcess: null
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const qcServerSocket = require('socket.io-client')(conf.qctoolServerSocketUrl);

qcServerSocket.on("connect", ()=>{
    console.log(`automatic testing process connected to ${conf.qctoolServerSocketUrl} socket`)
        
    qcServerSocket.on("QCToolSetting", settingData => {
    
    console.log("boot get efuse config: ", settingData.efuseConfig)
    console.log("boot executed: ", settingData.bootExecuted.bootName)
    
    THE_BOOT_NAME = settingData.bootExecuted.bootName
    theBoot.efuseConfig = settingData.efuseConfig
    THE_BOOT_DATA = JSON.parse(settingData.bootExecuted.data)
    
    process.send({
        api: "efuseConfig",
        data: theBoot.efuseConfig
        })
    })
    
    qcServerSocket.emit("QCToolSetting", '')
})


qcServerSocket.on("disconnect", ()=>{
    console.log("boot process disconnect from qctool server")
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
theBoot.findSerialPorts((newSerialPortConnected, oldSerialPortRemoved)=>{
    if(newSerialPortConnected) {     
        let newDevice = createTestingDevice(newSerialPortConnected)
        TESTING_DEVICES_STACK.push(newDevice) // pawn testing process here ?

        if (IN_TESTING_PROCESS) startTestingDevice() 
        console.log("get new port connected: ", newSerialPortConnected)  
    } else if (oldSerialPortRemoved) {  
        console.log("serial port closed connection: ", oldSerialPortRemoved)
        let indexTestingDeviceRemoved = TESTING_DEVICES_STACK.findIndex(device => (device.serialPort === oldSerialPortRemoved))
        
        if(indexTestingDeviceRemoved > -1 && TESTING_DEVICES_STACK[indexTestingDeviceRemoved].testingStatus != TESTING_STATUS.TESTING_PASS) {
            TESTING_DEVICES_STACK[indexTestingDeviceRemoved].testingStatus = TESTING_STATUS.DEVICE_BROKEN
            // TESTING_DEVICES_STACK[indexTestingDeviceRemoved].testingStatus = TESTING_STATUS.DEVICE_BROKEN
            // TESTING_DEVICES_STACK[indexTestingDeviceRemoved].workerProcess.send('serialPortClosedConnection') // emit signal for turn testing process off
        }
        
        // TESTING_DEVICES_STACK = removeDeviceFromTestingDeviceStack(oldSerialPortRemoved, TESTING_DEVICES_STACK)
        checkAllDevicesTested(TESTING_DEVICES_STACK)
    }

    sendTestingRunningStatusToClient(TESTING_DEVICES_STACK)
});


process.on("message", async (sms) => {
    if (sms.api==="startTest") {
        let macAddress = null
        let timerHandle = null
        let waitingForTestingDeviceStill = true
        // just run one testing process at one time
        if (IN_TESTING_PROCESS) {
            console.log("IN_TESTING_PROCESS === true =====> return")
            return
        } else {
            IN_TESTING_PROCESS = true
            process.send({
                api: "onTestingProcessRunning",
                data: IN_TESTING_PROCESS
            })

            // REMOVE DEVICES Broken at previous testing
            TESTING_DEVICES_STACK = TESTING_DEVICES_STACK.filter((device, id)=>{
                return device.testingStatus == TESTING_STATUS.IN_WAITING
            })

            //FORK TESTING PROCESS
            startTestingDevice()
        } 
    }
    else if (sms.api==="newQctoolGetEfuseConfig") {
        console.log("automatic testing process get ms newQctoolGetEfuseConfig")
        qcServerSocket.emit("QCToolSetting", '')
    } else if (sms.api == "getStatusHardwareProcess") {
        process.send({
            api: "onTestingProcessRunning",
            data: IN_TESTING_PROCESS
        })

        sendTestingRunningStatusToClient()
    }
     
})


