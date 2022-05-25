const {theBoot} = require('./boot')
const { listFolder, consoleToLogger, uuidv4, getWeekNumber } = require('./utility')
const manualTest = require('./manualTest')
const {automaticTestingResult, manualTestingResult, getLastTestingResult} = require('./models')
const axios = require('axios')
const path = require('path')
const esp = require('./esp').esp
require('dotenv').config();
const conf = require('../config')

const STATUS = {
    IN_CONNECT_TO_SERIAL_PORT:                  0,
    IN_CONNECT_TO_SERIAL_PORT_SUCCESSFUL:       1,
    IN_CONNECT_TO_SERIAL_PORT_FAIL:             2,    
    IN_GET_MAC_ADDRESS:                         3,
    IN_GET_OLD_DATA:                            4,
    IN_TESTING:                                 5,
    TESTING_PASS:                               6,
    TESTING_FAIL:                               7, 
    IN_DATA_SAVE:                               8,
    DATA_SAVED:                                 9
}

const inConnectingDevice = {
    serialPort:                     null,
    macAddress:                     null,
    testImage:                      [],
    lastManualTestingResult:        null,
    lastAutomaticTestingResult:     null,
    status:                         null,
    efuse:                          null,
    batteryLevel:                   null,
    serial:                         null
}
 
function resetInConnectDevice() {
    inConnectingDevice.serialPort =                     null
    inConnectingDevice.macAddress =                     null
    inConnectingDevice.lastAutomaticTestingResult =     null
    inConnectingDevice.lastManualTestingResult =        null
    inConnectingDevice.status =                         null
    inConnectingDevice.infoName =                       null
    inConnectingDevice.testImage =                      []
    inConnectingDevice.efuse    =                       null
    inConnectingDevice.batteryLevel =                   null
    inConnectingDevice.serial =                   null
    SHOULD_PREVENT_TEST_MANUAL = false                  

    process.send({
        api: "shouldPreventTestManual",
        data: {
            status: false,
            reason: ""
        }
    })
}

var ON_RUNNING_MANUAL_TEST = false
var SHOULD_PREVENT_TEST_MANUAL = true

// var QcServerUrl = "http://210.245.120.122"

// if (process.env.MODE === 'DEV') {
//     QcServerUrl = "http://127.0.0.1:8080/QctoolSocket"
// } else { // connect to production server
//     QcServerUrl = "http://210.245.120.122:8080/QctoolSocket"
// }

function getFirmwareName() {
    let logDebugs = theBoot.allLogDebugs
    let infos = logDebugs.find(l => (l.indexOf('efuse') > -1 && l.indexOf('date') > -1))
    if (infos) {
        infos = JSON.parse(infos)
        return infos.FW_Version ? infos.FW_Version : infos['FW Version']
    } else {
        return ''
    }
}

function getFirmwareAfterUpdateOTA() {
    // find by info command
    let firmwareVersion = theBoot.allLogDebugs.find(l=>(l.indexOf('FW Version: ') > -1))
    if (firmwareVersion) {
      firmwareVersion = firmwareVersion.substring(firmwareVersion.indexOf('FW Version: ') + 'FW Version: '.length, firmwareVersion.length-1)
      return firmwareVersion
    } else {
      return ''
    }
}

const qcServerSocket = require('socket.io-client')(conf.qctoolServerSocketUrl);
console.log("start connect to QcServerUrl: ", conf.qctoolServerSocketUrl)

qcServerSocket.on("connect", ()=>{
    console.log("connected to qc server")
    qcServerSocket.on("QCToolSetting", settingData=>{
        console.log("boot get efuse config: ", settingData.efuseConfig)
        theBoot.efuseConfig = settingData.efuseConfig
        process.send({
            api: "efuseSetup",
                data: theBoot.efuseConfig
        })
    })
    
    qcServerSocket.emit("QCToolSetting", '')
})

qcServerSocket.on("disconnect", ()=>{
    console.log("boot process disconnect from qctool server")
})

async function sendLastTestingResultToClient(manualTestingResult, automaticTestingResult, macAddress) {
    if (manualTestingResult) {
        let dateCreateManualTest = manualTestingResult.date.toString()
        dateCreateManualTest = dateCreateManualTest.substring(0, dateCreateManualTest.indexOf('GMT'))
        process.send({
            api: "getManualTestingResult",
            data: {
                dayTest:        dateCreateManualTest,
                data:           JSON.parse(manualTestingResult.result),
                result:         manualTestingResult.isTestingPass(),
                testingTime:    `${manualTestingResult.testingTime/1000} S` 
            }
        })
    }
    
    if(automaticTestingResult) {
        let dateCreateAutomaticTest = automaticTestingResult.date.toString()
        dateCreateAutomaticTest = dateCreateAutomaticTest.substring(0, dateCreateAutomaticTest.indexOf('GMT'))
        
        console.log("automaticTestingResult.resultsSumarize: ", automaticTestingResult)

        process.send({
            api: "getAutomaticTestingResult",
            data: {
                scenarioTestResult:     automaticTestingResult.resultsSumarize,
                isAutomaticTestingPass: automaticTestingResult.isPass,
                bootName:               automaticTestingResult.testingName,
                date:                   dateCreateAutomaticTest,   
                testingTime:            `${automaticTestingResult.testingTime/1000} S`
            }
            
        })

        if(automaticTestingResult.logDebug) {
            let logDebug = JSON.parse(automaticTestingResult.logDebug)
            logDebug = logDebug.join('\n')
            console.log(logDebug)
        }
    }
}

async function sendInfoDevice(phaseTesting) {
    // inConnectingDevice.macAddress = await theBoot.getMacAddressDevice()
    // let infoDevice = null
    // inConnectingDevice.efuse = null
    
    await theBoot.getInfoDevice()
            .then(info => {
                if (info) {
                    // inConnectingDevice.efuse = info.efuse
                    inConnectingDevice.serial = info.serial
                } else {
                    SHOULD_PREVENT_TEST_MANUAL = true
                    process.send({
                        api: "automaticTestingResultAlert",
                        data: "Có Thể Đây không phải firmware testing, Hãy Test Lại Automatic"
                    })
                }
            })
    

    

    let batteryLevel = await theBoot.getBatteryLevel()
    inConnectingDevice.batteryLevel = batteryLevel

    process.send({
        api: "inTestingDeviceStatus",
        data: {
            testAtSerialPort:   inConnectingDevice.serialPort,
            macAddress:         inConnectingDevice.macAddress,
            efuse:              inConnectingDevice.efuse,
            batteryLevel:       inConnectingDevice.batteryLevel,
            deviceBroken:       false,
            phaseTesting:       phaseTesting
        }                                   
    })
}

async function runManualTestingAction(manualTestingAction) {
    process.send({
        api: "manualTestingActionStatus",
        data: {
            status:                 "begin",
            manualTestingAction:    manualTestingAction,
            testingResult:          null
        }
    })

    // let TIMEOUT_ERR = parseInt(manualTestingAction.timeoutError)
    console.log("test with action name: ", manualTestingAction.name)
    let result = false

    theBoot.logDebugs = []
    manualTest.inConnectingDevice = {...inConnectingDevice}
    await manualTest[manualTestingAction.name]((restTime)=>{
                theBoot.checkSerialPortConnection()
                process.send({
                    api:    "manualTestingActionStatus",
                    data:   {
                                status: "waitingForActionFromTester",
                                manualTestingAction: manualTestingAction,
                                restTestingTime: restTime
                            }
                });
            })
            .then(resolve => result = resolve)
            .catch(err=>{throw err})
            .finally(() => {
                // just psudo
                process.send({
                    api:    "manualTestingActionStatus",
                    data:   {
                                status: "end",
                                manualTestingAction: manualTestingAction,
                                testingResult: result
                            }
                });
            });

    return {
        nameTest: manualTestingAction.name,
        result: result,
        infoName: manualTestingAction.infoName
    }
}

async function runManualTesting(manualTestData) {
    ///////////////////////////////////
    ///////BEGIN TEST
    process.send({
        api: "inTestingDeviceStatus",
        data: {
            testAtSerialPort: inConnectingDevice.serialPort,
            phaseTesting: "begin",
            macAddress: inConnectingDevice.macAddress
        }
    })
    
    if (!inConnectingDevice.getBatteryLevel && inConnectingDevice.batteryLevel < 3800) {
        process.send({
                    api: "automaticTestingResultAlert",
                    data: "Mức Pin Quá Thấp, Không Test Manual, Hãy Nạp Pin"
        })
        return
    } else if (!inConnectingDevice.macAddress) {
        process.send({
            api: "automaticTestingResultAlert",
            data: "Không Tìm Tháy MacAddress, KHÔNG TEST MANUAL, Hãy Chắc Bạn Test Automatic Thành Công"
        })

        SHOULD_PREVENT_TEST_MANUAL = true
        process.send({
            api: "shouldPreventTestManual",
            data: {
                status: true,
                reason: "Không Tìm Tháy MacAddress, KHÔNG TEST MANUAL, Hãy Chắc Bạn Test Automatic Thành Công"
            }
        })
        return
    } else if (!inConnectingDevice.efuse) {
        process.send({
            api: "automaticTestingResultAlert",
            data: "Không Tìm Tháy Efuse Trong Thiết Bị Hãy, Không Test Manual, Hãy Chắc bạn test automatic Thành Công"
        })

        SHOULD_PREVENT_TEST_MANUAL = true
        process.send({
            api: "shouldPreventTestManual",
            data: {
                status: true,
                reason: "Không Tìm Tháy Efuse Trong Thiết Bị Hãy, Không Test Manual, Hãy Chắc bạn test automatic Thành Công"
            }
        })
        return
    }

    if (!inConnectingDevice.macAddress) {
        process.send({
            api: "deviceBroken",
            data: `${inConnectingDevice.serialPort} broken`
        })

        process.send({
            api: "automaticTestingResultAlert",
            data: "Không Thể Láy MacAddress để Save Data"
        })
        console.log("can't get macAddress device evethought firmware burned")
        return
    }

    let results = []
    let shouldStopTestManual = null
    for (let i of manualTestData) {
        // await delay(1000)
        // if one of manual test fails ------> decide all checkOTASuccess && changeToUrlDefault failt >>>>>>> don't update OTA
        if (results.find(result => (result.result === false)) && (['checkOTASuccess', 'changeToUrlDefault'].indexOf(i.name) > -1)) {
            results.push({
                        nameTest: i.name,
                        result: false,
                        infoName: i.infoName
            })

            process.send({
                    api:    "manualTestingActionStatus",
                    data:   {
                                status: "end",
                                manualTestingAction: i,
                                testingResult: false
                            }
                });
        } else {
            await runManualTestingAction(i)
                .then(result=>{
                    results.push(result)
                })
                .catch(err=>{
                    console.log("run manual test action get err: ", err)
                    shouldStopTestManual = true
                    process.send({
                        api: "deviceBroken",
                        data: `${inConnectingDevice.serialPort} broken`
                    })

                    throw err
                })
        }
          
    }

    // store provisioning key burned 

    ///////////END TEST
    // let t = new manualTestingResult({
    //     result: JSON.stringify(results),
    //     logDebug: JSON.stringify(theBoot.allLogDebugs),
    //     testImage: inConnectingDevice.testImage,
    //     macAddress: inConnectingDevice.macAddress,
    //     testingTime: (new Date).getTime() - beginTestTime,
    //     HPI: inConnectingDevice.efuse,
    //     isPass: results.find(r => r.result == false) ? false : true
    // })

    // t.firmwareTestName = t.getFirmwareName()
    // t.updatedOTAFirmwareName = t.getFirmwareAfterUpdateOTA()

    // let timerOutTracker = null
    // let p = new Promise((resolve, reject)=>{
    //     timerOutTracker = setTimeout(() => {
    //         reject('Saving Data Error')
    //     }, 5000);
    // })

    // await Promise.race([p, t.save()])
    //             .then(doc=>{
    //                 console.log('saving data successful with _id: ', doc._id)
    //                 process.send({
    //                     api: "message", 
    //                     data: {
    //                         title: "Saving Data Status",
    //                         message: "Data Saved",
    //                         type: "success",
    //                         duration: 5000
    //                     }
    //                 })
    //                 clearTimeout(timerOutTracker)
    //             })
    //             .catch((error)=>{
    //                 console.log('save data error: ', error)
    //                 process.send({
    //                     api: "message", 
    //                     data: {
    //                         title: "Saving Data Status",
    //                         message: "Save Data Get Error",
    //                         type: "danger",
    //                         duration: 20000
    //                     }
    //                 })
    //                 throw error
    //             })     
    return results
}

theBoot.registerCallbackToDataSerialEvent((serialData)=>{
    process.send({
        api: "serialData",
        data: serialData
    });
})

theBoot.findSerialPorts(async (newSerialPortConnected, oldSerialPortRemoved)=>{
    if(newSerialPortConnected) {
        resetInConnectDevice()

        inConnectingDevice.status = STATUS.IN_CONNECT_TO_SERIAL_PORT     
        inConnectingDevice.efuse =  await esp.readHPI(newSerialPortConnected)
        inConnectingDevice.macAddress = await esp.readMac(newSerialPortConnected)
        inConnectingDevice.serialPort = newSerialPortConnected

        process.send({
            api: "hardwareBusy",
            data: true
        })

        if (!inConnectingDevice.efuse | !inConnectingDevice.macAddress) {
            process.send({
                api: "automaticTestingResultAlert",
                data: "Không Lấy Được Thông Tin Con Hàng, Vui Lòng Không Test Chờ Kỹ thuật Viên Kiểm Tra"
            })
            SHOULD_PREVENT_TEST_MANUAL = true
        }

        theBoot.connectEspSerialPort(newSerialPortConnected)

        await theBoot.waitingForSerialPortOpen()
                .then(async isSuccessFul=>{
                    if (!isSuccessFul) {
                        process.send({
                            api: "deviceBroken",
                            data: `${newSerialPortConnected} broken`
                        })

                        process.send({
                            api: "message", 
                            data: {
                                title: "Connect To Device Status",
                                message: "Connect Fail :(",
                                type: "danger",
                                duration: 5000
                            }
                        })
                        return
                    }

                    inConnectingDevice.serialPort = newSerialPortConnected
                    process.send({
                        api: "message", 
                        data: {
                            title: "Connect To Device Status",
                            message: "Device Connected",
                            type: "success",
                            duration: 5000
                        }
                    })

                    process.send({
                        api: "message", 
                        data: {
                            title: "Get Info Device Status",
                            message: "Waiting For Device Stable",
                            type: "success",
                            duration: 5000
                        }
                    })
                    
                    await delay(5000)
            
                    await sendInfoDevice(phaseTesting="begin")

                    if (!inConnectingDevice.serial) {
                        process.send({
                            api: "automaticTestingResultAlert",
                            data: "Không Lấy Được Thông Tin Con Hàng, Vui Lòng Không Test Chờ Kỹ thuật Viên Kiểm Tra"
                        })
                    }
           
                    let manualTestingResultReturn = await getLastTestingResult(manualTestingResult, inConnectingDevice.macAddress)
                    let automaticTestingResultReturn = await getLastTestingResult(automaticTestingResult, inConnectingDevice.macAddress)
                    
                    // if getAndSendInfoDevice can't get efuse ===> try to get it from old data base
                    if (!inConnectingDevice.efuse) {
                        console.log("getAndSendInfoDevice can't get efuse>>>>>>get it from oldDB: ", 
                        automaticTestingResultReturn.getHPI())
                        inConnectingDevice.efuse =  automaticTestingResultReturn.getHPI()
                        if (!inConnectingDevice.efuse) throw Error("Can't get efuse from testing result")
                    }

                    if(!automaticTestingResultReturn) {
                        process.send({
                            api: "automaticTestingResultAlert",
                            data: "Không Tìm Tháy Kết Quả AutomaticTest, KHÔNG TEST MANUAL, Vui Lòng Test Automatic Trước"
                        })


                        process.send({
                            api: "shouldPreventTestManual",
                            data: {
                                status: true,
                                reason: "Không Tìm Tháy Kết Quả AutomaticTest, KHÔNG TEST MANUAL, Vui Lòng Test Automatic Trước"
                            }
                        })
                        SHOULD_PREVENT_TEST_MANUAL = true
                    } else if (!automaticTestingResultReturn.isAutomaticTestingPass()) {
                        process.send({
                            api: "automaticTestingResultAlert",
                            data: "Kết Quả Test Automatic Không Pass Vui Lòng, KHÔNG TEST MANUAL, Test Automatic Lại Hoặc Chờ Kỹ Thuật Viên Kiểm Tra"
                        })

                        process.send({
                            api: "shouldPreventTestManual",
                            data: {
                                status: true,
                                reason: "Kết Quả Test Automatic Không Pass Vui Lòng, KHÔNG TEST MANUAL, Test Automatic Lại Hoặc Chờ Kỹ Thuật Viên Kiểm Tra"
                            }
                        })
                        SHOULD_PREVENT_TEST_MANUAL = true
                    }

                    sendLastTestingResultToClient(manualTestingResultReturn, automaticTestingResultReturn, inConnectingDevice.macAddress)
                })
                .catch(err=>{
                    console.log("error: ", err)
                    process.send({
                            api: "automaticTestingResultAlert",
                            data: "Không Thể Láy Thông Tin Thiết Bị, KHÔNG TEST MANUAL, Test Automatic Lại Hoặc Chờ Kỹ Thuật Viên Kiểm Tra"
                    })
                    process.send({
                            api: "shouldPreventTestManual",
                            data: {
                                status: true,
                                reason: "Không Thể Láy Thông Tin Thiết Bị, KHÔNG TEST MANUAL, Test Automatic Lại Hoặc Chờ Kỹ Thuật Viên Kiểm Tra"
                            }
                        })

                    SHOULD_PREVENT_TEST_MANUAL = true
                })
                process.send({
                    api: "hardwareBusy",
                    data: false
                })
        // Connect status
        // Get Old Data 
        // Get Mac   
    } else if (oldSerialPortRemoved) {  
        process.send({
            api: "deviceBroken",
            data: `${newSerialPortConnected} broken`
        })

        SHOULD_PREVENT_TEST_MANUAL = false
    }

    process.send({
        api: "newTestingDeviceAppear",
        data: inConnectingDevice
    })
});


process.on("message", async sms=>{
    if (sms.api==="runManualTest") {
        console.log("ON_RUNNING_MANUAL_TEST", ON_RUNNING_MANUAL_TEST)
        if(ON_RUNNING_MANUAL_TEST || SHOULD_PREVENT_TEST_MANUAL) return
        
        process.send({
            api: "hardwareBusy",
            data: true
        })
        
        manualTest.userConfirmRBGLedOk = null
        manualTest.userConfirmImageQualityOk = null
        
        ON_RUNNING_MANUAL_TEST = true
        theBoot.allLogDebugs = []
        manualTest.inConnectingDevice = inConnectingDevice
        let beginTestTime = (new Date).getTime()
        await runManualTesting(manualTestData=sms.data)
            .then(async results => {
                let t = {
                        result: JSON.stringify(results),
                        logDebug: JSON.stringify(theBoot.allLogDebugs),
                        testImage: inConnectingDevice.testImage,
                        macAddress: inConnectingDevice.macAddress,
                        testingTime: (new Date).getTime() - beginTestTime,
                        HPI: inConnectingDevice.efuse,
                        isPass: results.find(r => r.result == false) ? false : true,
                        date: new Date()
                    }

                t.firmwareTestName = getFirmwareName()
                t.updatedOTAFirmwareName = getFirmwareAfterUpdateOTA()
                
                let response = await axios.post(`${conf.qcServerEndpoind}/api/testManualResult`, t, {
                    timeout: 3000
                })

                await axios.post(`${conf.qcServerEndpoind}/api/setDeviceCertificated`, {
                    serial: inConnectingDevice.serial,
                    macAddress: inConnectingDevice.macAddress
                })
                .then(r => {
                    console.log("/api/setDeviceCertificated?serial return: ", r.data)
                })
                .catch(err =>{
                    process.send({
                        api: "message", 
                        data: {
                            title: "Connect To Device Status",
                            message: `Can't Save Certificate Info, message from backend: ${err.response.message}`,
                            type: "danger",
                            duration: 10000
                        }
                    })
                    console.log("/api/setDeviceCertificated?serial get error: ", err)
                    throw err
                })

                console.log("post testing data to server and got response: ", response.data)

                theBoot.logDebugs = []

                process.send({
                    api: "hardwareBusy",
                    data: false
                })
            })
            .catch(err=>{
                console.log("runManualTest err: ", err)
                process.send({
                    api: "deviceBroken",
                    data: `${theBoot.serialPortConnecting} broken`
                })
                
            })
            .finally(()=>{
                console.log("done manual test here>>>>>>>>>>>>>>>>>>>")
                ON_RUNNING_MANUAL_TEST = false
                process.send({
                    api: "hardwareBusy",
                    data: false
                })
                theBoot.allLogDebugs = []
            })
    }

    else if (sms.api==="userConfirmQuestion") {
        if (sms.data.type === 'confirmRGBLedQuality') {
            manualTest.userConfirmRBGLedOk = sms.data.answer
        } else if (sms.data.type === 'confirmImageQuality') {
            manualTest.userConfirmImageQualityOk = sms.data.answer
        }
    }
       
    else if (sms.api === "printLabel") {
        try {
            let versionCode = inConnectingDevice.efuse.split(':')[1].split('_')[1]
            let dayRelease = inConnectingDevice.efuse.split(':')[0]
            console.log("versionCode: ", versionCode)
            
            if(versionCode.length < 5) {
                let [y, w] = getWeekNumber(new Date(dayRelease))
                y = String(y).substring(2, y.length)
                        versionCode = `${versionCode}${y}${w}`
                        console.log("version code printed: ", versionCode)
            }
            // theBoot.printLabel(sms.macAddress, theBoot.efuseConfig.version_code)
            theBoot.printLabel(sms.macAddress, versionCode)    
        } catch (error) {
            console.log("printLabel Error: ", error)
        } 
    }

    else if (sms.api === "testImage") {
        inConnectingDevice.testImage.push(sms.data)
    } 
    else if (sms.api === "newQctoolGetEfuseConfig") {
        qcServerSocket.emit("newQctoolGetEfuseConfig", '')
    } else if (sms.api === "sendSerial") {
        theBoot.sendSerial(sms.data)
    }
    
})

process.on('exit', (code)=>{
    console.log(`bootWorker exit\nexit code: ${code}`);
})

process.on('unhandledRejection', async error => {
    // Will print "unhandledRejection err is not defined"
    console.log('>>>>>>>>>>>>>>unhandledRejection', error.message);
    process.exit()
});
