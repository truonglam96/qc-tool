path = require('path')
theBoot = require('./boot').theBoot
manualTest = require('./manualTest')

const fs = require('fs')

const QcServerUrl = "http://210.245.120.122"
const qcServerSocket = require('socket.io-client')(QcServerUrl);

qcServerSocket.on("connect", ()=>{
    console.log("connected to qc server")
})

qcServerSocket.on("getEfuseConfig", d=>{
    console.log("boot get efuse config: ", d)
    theBoot.efuseConfig = d
    process.send({
        api: "efuseSetup",
        data: theBoot.efuseConfig
    })
})

qcServerSocket.on("disconnect", ()=>{
    console.log("boot process disconnect from qctool server")
})

var DEVICE_STATUS = {
    isDeviceBusy: false,
    reason: ''
}

theBoot.findSerialPorts(async (newSerialPortConnected, oldSerialPortRemoved)=>{
    if (newSerialPortConnected) {
        theBoot.connectEspSerialPort(newSerialPortConnected, null)
        let isDeviceOpenSuccessful = await theBoot.waitingForSerialPortOpen()
        if (isDeviceOpenSuccessful) {
                // let macAddress = await theBoot.getMacAddressDevice()
            process.send({
                        api: "connectToDeviceStatus",
                        data: {
                            type: "successful",
                            port: newSerialPortConnected
                        }
                    });
        } else {
            process.send({
                        api: "connectToDeviceStatus",
                        data: {
                            type: "connectionFail",
                            port: `fail connect to port: ${newSerialPortConnected}`
                        }
                    });
        }    
    } else if (oldSerialPortRemoved) {
        process.send({
                    api: "connectToDeviceStatus",
                    data: {
                            type: "closedConnection",
                            port: `${oldSerialPortRemoved} closed connection`
                        }
                    });
    }
    
})

theBoot.registerCallbackToDataSerialEvent((serialData)=>{
    process.send({
            api: "serialData",
            data: serialData
        });
})

process.on("message", async (sms)=> {
    // console.log("bootWorker Get Request: ", sms.api)
    if (sms.api === "runBoot") {
        if (!DEVICE_STATUS.isDeviceBusy) {
            DEVICE_STATUS.isDeviceBusy = true
            theBoot.onRunningAutomaticTesting = true

            await theBoot.runBoot(
                    sms.data.scenarioTests, 
                    sms.data.testingName,
                    null,
                    beginRunActionCallBack=(scenarioTestResultSummarize, actionKey, typeAction) => {
                        console.log("begin run action")
                        process.send({
                            api: "bootBeginRunAction",
                            data: actionKey
                        });
                    },
                    afterActionRunCallBack=(testingResult, actionKey, typeAction)=>{
                        process.send({
                            api: "bootDoneRunAction",
                            data: {
                                key: actionKey,
                                type: typeAction
                            }
                        });
                        console.log("end run action")
                    } 
                )
                .then(resolve => {
                    console.log("boot done run>>>>>>>>>>>>>")
                })
                .catch(err=>{
                    throw err
                })
                .finally(()=>{
                    DEVICE_STATUS.isDeviceBusy = false
                    process.send({
                            api: "bootDoneRunTestAutomation",
                            data: ''
                    })
                })
           
            theBoot.hardwareManager.unexportAllPins();
            theBoot.logDebugs = []
        }
    }
    else if (sms.api === "requestGetlistFirmware") {
        let r = theBoot.getFirmwaresList();
        if (sms.data) {
            process.send({
                api: sms.data.returnTo,
                data: r
            })
        }
    }

    else if (sms.api === "clientRequestBurnFirmware") {
        process.send({
                    api: "statusBurnFirmware",
                    data: "beginBurnFirmware"
        })

        await theBoot.burnFirmware(`./firmwares/${sms.data}`).catch(err=>{
            console.log("burn burn firmware fail")
            process.send({
                api: "statusBurnFirmware",
                data: "burnFirmwareFail"
            })
        })

        process.send({
                api: "statusBurnFirmware",
                data: "burnFirmwareSuccessFull"
        })
    } 

    else if (sms.api === "eraseFirmware") {
        process.send({
            api: "eraseFirmwareStatus",
            data: "beginEraseFirmware"
        })
        
        console.log("get command erase firmware: ", sms)
        await theBoot.eraseFirmware(theBoot.serialPortConnecting, sms.data).catch(err=>{
            console.log("Erase Firmware Error: ", err)
            process.send({
                api: "eraseFirmwareStatus",
                data: "eraseFirmwareError"
            })
        })

        process.send({
                api: "eraseFirmwareStatus",
                data: "eraseFirmwareDone"
        })
    }

    else if (sms.api === "requestStatusDevice") {
        console.log("requestStatusDevice")
    } 


    else if (sms.api === "printLabel") {
        try {
            theBoot.printLabel(sms.macAddress, theBoot.efuseConfig.version_code)    
        } catch (error) {
            console.log("printLabel Error: ", error)
        } 
    }

    else if (sms.api === "sendSerial") {
        theBoot.sendSerial(sms.data)
    } 
    
    else if (sms.api == 'sendKeys') {
        let info = await theBoot.getInfoDevice()

        if (info) {
            let inConnectingDevice = {}
            inConnectingDevice.efuse = info.efuse
            inConnectingDevice.serial = info.serial
            manualTest.inConnectingDevice =  inConnectingDevice

            try {
                var sendKeyResult = await manualTest.sendKey()
            } catch (error) {
                process.send({
                    api: "sendKeysStatus",
                    data: "SendKeyError"
                })      
            }

            process.send({
                api: "sendKeysStatus",
                data: sendKeyResult ? "SendKeysSuccessFull" : "SendKeysFail"
            })

        } else {
            process.send({
                api: "sendKeysStatus",
                data: "GetInfoError"
            })
        }
    }
});


process.on('exit', (code)=>{
    theBoot.hardwareManager.unexportAllPins();
    console.log(`bootWorker exit\nexit code: ${code}`);
})

process.on('unhandledRejection', async error => {
    // Will print "unhandledRejection err is not defined"
    console.log('>>>>>>>>>>>>>>unhandledRejection', error.message);
    process.exit()
});
