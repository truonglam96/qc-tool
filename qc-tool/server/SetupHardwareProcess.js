// var cluster = require('cluster');
const {fork} = require('child_process')

const AUTOMATIC_TESTING_PROCESS = {
    pidProcess: null,

    processTerminated: true, // killed property in child_process object doesn't indicate process termniate 
    
    forcedStopProcess: false,

    nameProcess: "AUTOMATIC_TESTING_PROCESS",

    connectSocketMessageWithHardwareProcess: function(clientSocket, pidProcess) {
        clientSocket.on("startTest", (sms)=>{                   
            pidProcess.send({
                api: "startTest",
                data: ''
            })
        })
    },

    connectHardwareMessageWithClientSocket: function(clientSocket, pidProcess) {
        //connect client socket with this process
        const listenerHardwareProcess = (processMessage) => {
            if (processMessage.api === null) {
                console.log("message structure error, sms send: ", processMessage)
                return   
            }
            clientSocket.emit(processMessage.api, processMessage.data)
        }
        pidProcess.on("message", listenerHardwareProcess)
        return listenerHardwareProcess
    },

    restartHardwareProcess: function(clientSocket) {
        return (code) => {
            this.processTerminated = true
            console.log("child process exit>>>>>>>>>>>>>>>>>>>>restart")
            let eventsListeningSocket = clientSocket.eventNames()
            clientSocket.removeAllListeners(eventsListeningSocket)

            if(!this.forcedStopProcess) this.registerNewSocketClient(clientSocket)
        }
    },

    /*
        Protocol for register new client: 
            check for init hardware process
            connect socket message with hardware process and vice vesa
    */
    registerNewSocketClient: function(clientSocket) {
        if (this.processTerminated) { //check for whether turn process on    
            console.log(`fork hardware process: ${this.nameProcess}`)
            this.forcedStopProcess = false
            this.pidProcess = fork('./FactoryAutomaticTestProcess')
            this.processTerminated = false
        }

        //connect two type of events
        const listenerHardwareProcess = this.connectHardwareMessageWithClientSocket(clientSocket, this.pidProcess)
        this.connectSocketMessageWithHardwareProcess(clientSocket, this.pidProcess)

        const restartHardwareProcess = this.restartHardwareProcess(clientSocket)
        this.pidProcess.on('exit', restartHardwareProcess);

        console.log("this.pidProcess.listenerCount(message): ",this.pidProcess.listenerCount("message"))
        console.log("this.pidProcess.listenerCount(exit): ",this.pidProcess.listenerCount("exit"))
        
        clientSocket.on("disconnect", ()=>{ // client disconnect ------> remove listeners that involve socket client
            console.log("client dis connect ===> remove listeners to this process")
            this.pidProcess.removeListener("message", listenerHardwareProcess)
            this.pidProcess.removeListener("exit", restartHardwareProcess)
        })

        try {
            this.pidProcess.send({ // issue hardware process for sending back testing status 
                api: "getStatusHardwareProcess",
                data: ''
            })     
        } catch (error) {
            
        }
       
    },
    
    stopProcess: function() {
        if(this.pidProcess) {
            this.pidProcess.kill()
            this.forcedStopProcess = true
            if (!this.pidProcess.killed) {
                console.log("WARNING.....process ", this.nameProcess, " still running")
                return false
            } else { //be carefull this.pidProcess.killed just mean process captured kill signal not mean it already killed
                this.processTerminated = true
                console.log(`>>>>>>>>>>>>>>>>>>>>>Stop ${this.nameProcess}`)
            }
        }
    }
}

const MANUAL_TESTING_PROCESS = {
    pidProcess: null,
    
    nameProcess: "MANUAL_TESTING_PROCESS",

    IN_TESTING_DEVICE: {
        macAddress: null
    },

    processTerminated: true,

    forcedStopProcess: false,

    connectSocketMessageWithHardwareProcess: function(clientSocket, pidProcess) {
        clientSocket.on("userConfirmQuestion", sms=>{
            pidProcess.send({
                api: "userConfirmQuestion",
                data: sms
            })
        })

        clientSocket.on("newQctoolGetEfuseConfig", d=>{
            console.log("setupHardwareProcessGet Socket Event newQcTooGetEfuseConfig")
            pidProcess.send({
                api: "newQctoolGetEfuseConfig",
                data: ''
            })
        }) 
            
        clientSocket.on("sendSerial", serialCommand=>{
            console.log("get serial command: ", serialCommand)
            pidProcess.send({
                api: "sendSerial",
                data: serialCommand
            })
        });

        clientSocket.on("runManualTest", sms=>{
            pidProcess.send({
                api: "runManualTest",
                data: sms
            })
        })

        clientSocket.on("printLabel", sms=>{
            pidProcess.send({
                api: "printLabel",
                macAddress: sms.macAddress
            })
        })
    },

    connectHardwareMessageWithClientSocket: function(clientSocket, pidProcess) {
        //connect client socket with this process
        const listenerHardwareProcess = (processMessage) => {
            if (processMessage.api === null) {
                console.log("message structure error, sms send: ", processMessage)
                return   
            }

            if (processMessage.api==='inTestingDeviceStatus'){
                console.log("inTestingDeviceStatus")
                this.IN_TESTING_DEVICE = {
                    macAddress: processMessage.data.macAddress
                }
                clientSocket.emit(processMessage.api, processMessage.data)
            }
            
            // console.log("listeners get messages: ", processMessage)
            // TODO how about if this client socket being remove ?
            clientSocket.emit(processMessage.api, processMessage.data)
        }
        pidProcess.on("message", listenerHardwareProcess)
        return listenerHardwareProcess
    },

    restartHardwareProcess: function(clientSocket) {
        return (code) => {
            this.processTerminated = true
            console.log("child process exit>>>>>>>>>>>>>>>>>>>>restart")
            let eventsListeningSocket = clientSocket.eventNames()
            clientSocket.removeAllListeners(eventsListeningSocket)
            if(!this.forcedStopProcess) this.registerNewSocketClient(clientSocket)
        }
    },

    /*
        Protocol for register new client: 
            check for init hardware process
            connect socket message with hardware process and vice vesa
    */
    registerNewSocketClient: function(clientSocket) {
        if (this.processTerminated) { //check for whether turn process on    
            console.log(`fork hardware process: ${this.nameProcess}`)
            this.pidProcess = fork('./FactoryManualTestProcess')
            this.forcedStopProcess =false
            this.processTerminated = false
        }

        //connect two type of events
        const listenerHardwareProcess = this.connectHardwareMessageWithClientSocket(clientSocket, this.pidProcess)
        this.connectSocketMessageWithHardwareProcess(clientSocket, this.pidProcess)

        const restartHardwareProcess = this.restartHardwareProcess(clientSocket)
        this.pidProcess.on('exit', restartHardwareProcess);

        console.log("this.pidProcess.listenerCount(message): ",this.pidProcess.listenerCount("message"))
        console.log("this.pidProcess.listenerCount(exit): ",this.pidProcess.listenerCount("exit"))
        
        clientSocket.on("disconnect", ()=>{ // client disconnect ------> remove listeners that involve socket client
            console.log("client dis connect ===> remove listeners to this process")
            this.pidProcess.removeListener("message", listenerHardwareProcess)
            this.pidProcess.removeListener("exit", restartHardwareProcess)
        })

        try {
            this.pidProcess.send({ // issue hardware process for sending back testing status 
                api: "getStatusHardwareProcess",
                data: ''
            })  
        } catch (error) {
            this.pidProcess.send({
                api: "turnQctoolToPoductionMode",
                data: ''
            })    
        }

        
    },

    stopProcess: function() {
        if(this.pidProcess) {
            this.pidProcess.kill()
            this.forcedStopProcess = true
            if (!this.pidProcess.killed) {
                console.log("WARNING.....process ", this.nameProcess, " still running")
                return false
            } else { //be carefull this.pidProcess.killed just mean process captured kill signal not mean it already killed
                this.processTerminated = true
                console.log(`>>>>>>>>>>>>>>>>>>>>>Stop ${this.nameProcess}`)
            }
        }
    }
}

const DIANOGIS_PROCESS = {
    pidProcess: null,
    
    nameProcess: "DIANOGIS_PROCESS",

    processTerminated: true,
    
    forcedStopProcess: false,    

    connectSocketMessageWithHardwareProcess: function(clientSocket, pidProcess) {
        clientSocket.on('runBoot', (data) => {
            pidProcess.send({
                api: "runBoot",
                data: data
            }) 
        })

        clientSocket.on("qctoolRequestGetlistFirmware", data=>{
            console.log("qc tool request get list firmware")
            pidProcess.send({
                api: "requestGetlistFirmware",
                data: {
                    returnTo: "storedFirmwareVersionsForQctool"
                }
            })
        })

        clientSocket.on("requestStatusDevice", sms=>{
            pidProcess.send({
                api: "requestStatusDevice",
                data: ""
            })      
        });


        clientSocket.on("clientRequestBurnFirmware", firmwareVersion=>{
            pidProcess.send({
                api: "clientRequestBurnFirmware",
                data: firmwareVersion
            })
        })

        clientSocket.on("eraseFirmware", sms=>{
            pidProcess.send({
                api: "eraseFirmware",
                data: sms
            })
        })

        clientSocket.on('sendKeys', () => pidProcess.send({
            api: 'sendKeys'
        }))

        clientSocket.on("sendSerial", serialCommand=>{
            pidProcess.send({
                api: "sendSerial",
                data: serialCommand
            })
        });

        clientSocket.on("printLabel", sms=>{
            pidProcess.send({
                api: "printLabel",
                macAddress: sms.macAddress
            })
        })

    },

    connectHardwareMessageWithClientSocket: function(clientSocket, pidProcess) {
        //connect client socket with this process
        const listenerHardwareProcess = (processMessage) => {
            if (processMessage.api === null) {
                console.log("message structure error, sms send: ", processMessage)
                return   
            }

            if (processMessage.api==='inTestingDeviceStatus'){
                console.log("inTestingDeviceStatus")
                IN_TESTING_DEVICE = {
                    macAddress: processMessage.data.macAddress
                }
                clientSocket.emit(processMessage.api, processMessage.data)
            } 
            

            // console.log("listeners get messages: ", processMessage)
            // TODO how about if this client socket being remove ?
            clientSocket.emit(processMessage.api, processMessage.data)
        }
        pidProcess.on("message", listenerHardwareProcess)
        return listenerHardwareProcess
    },

    restartHardwareProcess: function(clientSocket) {
        return (code) => {
            this.processTerminated = true
            console.log("child process exit>>>>>>>>>>>>>>>>>>>>restart")
            let eventsListeningSocket = clientSocket.eventNames()
            clientSocket.removeAllListeners(eventsListeningSocket)
            if(!this.forcedStopProcess) this.registerNewSocketClient(clientSocket)
        }
    },

    /*
        Protocol for register new client: 
            check for init hardware process
            connect socket message with hardware process and vice vesa
    */
    registerNewSocketClient: function(clientSocket) {
        if (this.processTerminated) { //check for whether turn process on    
            console.log(`fork hardware process: ${this.nameProcess}`)
            this.pidProcess = fork('./boot_worker.js')
            this.processTerminated = false
            this.forcedStopProcess = false
        }

        //connect two type of events
        const listenerHardwareProcess = this.connectHardwareMessageWithClientSocket(clientSocket, this.pidProcess)
        this.connectSocketMessageWithHardwareProcess(clientSocket, this.pidProcess)

        const restartHardwareProcess = this.restartHardwareProcess(clientSocket)
        this.pidProcess.on('exit', restartHardwareProcess);

        console.log("this.pidProcess.listenerCount(message): ",this.pidProcess.listenerCount("message"))
        console.log("this.pidProcess.listenerCount(exit): ",this.pidProcess.listenerCount("exit"))
        
        clientSocket.on("disconnect", ()=>{ // client disconnect ------> remove listeners that involve socket client
            console.log("client dis connect ===> remove listeners to this process")
            this.pidProcess.removeListener("message", listenerHardwareProcess)
            this.pidProcess.removeListener("exit", restartHardwareProcess)
        })

        // this.pidProcess.send({ // issue hardware process for sending back testing status 
        //     api: "getStatusHardwareProcess",
        //     data: ''
        // })
    },

    stopProcess: function() {
        if(this.pidProcess) {
            this.pidProcess.kill()
            if (!this.pidProcess.killed) {
                this.forcedStopProcess = true
                console.log("WARNING.....process ", this.nameProcess, " still running")
                return false
            } else { //be carefull this.pidProcess.killed just mean process captured kill signal not mean it already killed
                this.processTerminated = true
                console.log(`>>>>>>>>>>>>>>>>>>>>>Stop ${this.nameProcess}`)
            }
        }
    }
}


module.exports = {
    AUTOMATIC_TESTING_PROCESS: AUTOMATIC_TESTING_PROCESS,
    MANUAL_TESTING_PROCESS: MANUAL_TESTING_PROCESS,
    DIANOGIS_PROCESS: DIANOGIS_PROCESS
}