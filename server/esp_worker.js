espProcess = require('./esp_process').espProcess

espProcess.findSerialPorts()

process.on("message", (sms)=>{
    console.log("hi esp worker")
})