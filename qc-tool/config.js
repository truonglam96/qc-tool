const path = require('path')
const fs = require('fs')

var config = {
   environment: null,
   os: "macOS",
   pythonPath: null,
   mongoDB_URL: null,
   provisioningFile: path.join(__dirname, 'server/provisioningFile') ,
   qcServerEndpoind: 'http://34.142.176.250:8080',
   qctoolServerSocketUrl: 'http://34.142.176.250:8080/QctoolSocket',
   CA_ROOT_KEY: null,
   printingLabelCommandFile: './print_label_26_2_2022/command_print_26_2_2022.sh',
   //production https://api.wecheer.me/device-management/api/Firmware/default-firmware-url
   //statging: https://api.wecheer.me/staging-device-management/api/Firmware/default-firmware-url
   getDefaultFirmwareUrl: 'https://api.wecheer.me/device-management/api/Firmware/default-firmware-url'

}

config.environment = process.argv[2]

if (config.environment === 'production') {
    // config.mongoDB_URL = 'mongodb+srv://QCTool:Livetoride01@cluster0.xqdd5.mongodb.net/qc?retryWrites=true&w=majority'
    config.mongoDB_URL = 'mongodb://qc-server:qc-server%40123@34.142.176.250:27017/qc?directConnection=true&serverSelectionTimeoutMS=2000&authMechanism=DEFAULT&retryWrites=True'
    config.serverSelectionTimeoutMS = 5000
} else {
    // config.qcServerEndpoind = 'http://210.245.120.122:8080'
    // config.qctoolServerSocketUrl = 'http://210.245.120.122:8080/QctoolSocket'
    // config.mongoDB_URL = 'mongodb+srv://QCTool:Livetoride01@cluster0.xqdd5.mongodb.net/qc?retryWrites=true&w=majority'
    config.mongoDB_URL = 'mongodb://qc-server:qc-server%40123@34.142.176.250:27017/qc?directConnection=true&serverSelectionTimeoutMS=2000&authMechanism=DEFAULT&retryWrites=True'
    config.serverSelectionTimeoutMS = 5000
}
//find python3
//check && install dependences

// force for testing
// config.mongoDB_URL = 'mongodb://vn_firmware_user:wecheer%40firmware%23factory%25qc-tool@210.245.120.122/factory_qc_data'

// config.qcServerEndpoind = 'http://127.0.0.1:3000'
config.CA_ROOT_KEY = fs.readFileSync(path.join(config.provisioningFile, 'root-CA.crt')).toString()
config.pythonPath = 'python3'

module.exports = config
