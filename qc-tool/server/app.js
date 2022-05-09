/*
    Scope:
        1. realtime, independence with network latency 
        2. optimize, as most as possible 
        3. make all things simplest.
*/
var express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var cluster = require('cluster');
const fs = require('fs')
var os = require('os');
var { execSync, fork } = require('child_process')
const Stream = require('stream');
const axios = require('axios')
const {readdirSync} = require('fs')
const config = require('../config')
const {listFolder} = require('./utility')

const { AUTOMATIC_TESTING_PROCESS, MANUAL_TESTING_PROCESS,  DIANOGIS_PROCESS} = require('./SetupHardwareProcess')

// consoleToLogger(logPath)

require('dotenv').config();

var linkToUpdateOTAWithApi = null  

var {boot, testingResult} = require('./models');

var IN_TESTING_DEVICE = {
    macAddress: null,
    imgPost: null
}

URL_UPDATE_OTA = "\/fws\/fw_1559200681.bin"

/*
#####################################################################################################################################
                                                    MAIN PROGRAM 
##################################################################################################################################### 
*/
if (cluster.isMaster) {
    var app = express();
    var server = require('http').createServer(app);
    var bootSocket = require('socket.io')(server, {
        pingTimeout: 60000
        // pingInterval: 25000
    }).of('/bootSocket');
    var automaticTestingProcess = null
    var manualTestingProcess = null
    var SERVER_PORT = process.env.PORT||3000;
/*
#####################################################################################################################################
                                                    Start The Server 
##################################################################################################################################### 
*/  
    app.use(bodyParser.json({limit: '10mb', extended: true}));
    app.use(express.static('static'))
    app.use(bodyParser.urlencoded({ extended: false }));

    // set the view engine to ejs
    app.set('view engine', 'ejs');
    if(process.env.VERSION === "OLD_VERSION") {
        app.use(express.static(path.join(__dirname, '../templates')));
        app.get('/', async (req, res) => {
            // // query obj have then method but it is not fully promse without exec()
            // let r =  await boot.find({}).exec();
            res.render(path.join(__dirname, '../templates/html', 'base'), {path: 'partials/dashboard'});
        });
    
        app.get('/create_boot', function (req, res) {
            res.render( path.join(__dirname, '../templates/html', 'base'), {path: 'partials/create_boot'});
        });
    } 
    
    else {
        console.log("use new versions")
        app.use(express.static(path.join(__dirname, '../templates/build')));
        app.get('/', (req, res)=>{
            res.sendFile(path.join(__dirname, '../templates/build/index.html'))
        })

        app.get('/manual-test', (req, res)=>{
            res.sendFile(path.join(__dirname, '../templates/build/index.html'))
        })

        app.get('/automatic-test', (req, res)=>{
            res.sendFile(path.join(__dirname, '../templates/build/index.html'))
        })
    }

    app.post('/boot_save', async (req, res) => {
        let b = boot({
                data:  JSON.stringify(req.body.data),
                bootName: JSON.stringify(req.body.bootName),
                description: JSON.stringify(req.body.description)
            });

        b.save();
        res.send({
            ms: "boot created",
            id: b._id
        })
    });

    app.get('/boot', async function (req, res) {
        console.log(req.param('id'));
        let id = req.param('id')
        var tr = await boot.findById(id).exec()
        tr = tr.htmlString
        
        res.render(path.join(__dirname, '../templates/html', 'base'), {
            path: '',
            string: tr
        });
    })
 

    app.get('/api/getFactoryDefaultBoot', async (req, res)=>{
        let r =  await boot.find({description: /factoryDefaultBoot/}).select('bootName description data date _id').exec();
        r = r ? r[0] : []
        res.json({
            data: r
        }) 
    })

    app.get('/api/getAutomaticTesingResult', async (req, res)=>{
            let macAddress = req.param('macAddress')
            let testingResults = await testingResult.find({macAddress: macAddress}).exec()
            let lastTestinResult = testingResults[testingResults.length - 1]
            
            if (!lastTestinResult) {
                res.json({
                    lastTestinResult: lastTestinResult,
                    isAutomaticTestingPass: false
                })
                return    
            }

            res.json({
                lastTestinResult: lastTestinResult,
                isAutomaticTestingPass: lastTestinResult.isAutomaticTestingPass()
            })
    })

    var imgNum = 0
    app.post("/api/getTestingImage", async (req, res)=>{  
        console.log(req.body)
        if (req.body.boxId===MANUAL_TESTING_PROCESS.IN_TESTING_DEVICE.macAddress) {
            console.log("get post img from device: ", MANUAL_TESTING_PROCESS.IN_TESTING_DEVICE.macAddress)
            if (req.body.imageB64) {
                imgNum += 1
                execSync(`python3 ConvertB64ToImg.py ${req.body.imageB64} ${req.body.boxId}_${imgNum}.png`)
                bootSocket.emit("testingImageCreated", `/static/testImages/${req.body.boxId}_${imgNum}.png`)
                console.log("testingImageCreated: ", `/static/testImages/${req.body.boxId}_${imgNum}.png`)
            } else { 
                // bootSocket.emit("testingImageCreated", `/static/test_upload.png`)
            }
            
            if(req.body.requireOTA === true) {
                /*
                await axios.get("https://raw.wecheer.io/api/firmware-links")
                        .then(r=>{
                            if (r.status === 200) {
                                let key = Object.keys(r.data)[0]
                                linkToUpdateOTAWithApi = r.data[key]
                                console.log("array links to update OTA API return: ", r.data)
                                console.log("get link update OTA: ", linkToUpdateOTAWithApi)
                            }
                        })
                        .catch(e=>{
                            console.log("can't get link binary to serve OTA process")
                        })

                res.send({
                    "result": "success",
                    "image": `\""`,
                    "brand": "test",
                    "doUpdate": true,
                    "doReset": false,
                    "fwUrl": `https://raw.wecheer.io${linkToUpdateOTAWithApi}`,
                    "timeUTC": parseInt(new Date().getTime()/1000),
                    "do_format": false
                })
                */

                let configHeaders = {
                    'x-rest-api-key': '707B09F0-7BAD-4AED-AD9C-6B86736A5DF1'
                }
            
                let defaultFirmwareUrl = null
                await axios.get(config.getDefaultFirmwareUrl, {headers: configHeaders})
                    .then(response => {
                        defaultFirmwareUrl = response.data
                    })
                    .catch(error => {
                        defaultFirmwareUrl = `got error when request get default firmware url`
                        console.log("get defaul firmware got error: ", error)
                    })

                res.send({
                    "result": "success",
                    "image": `\""`,
                    "brand": "test",
                    "doUpdate": true,
                    "doReset": false,
                    "fwUrl": defaultFirmwareUrl,
                    "timeUTC": parseInt(new Date().getTime()/1000),
                    "do_format": false
                })
                return
            }

            IN_TESTING_DEVICE.imgPost = req.body
            
            MANUAL_TESTING_PROCESS.pidProcess.send({
                api: "testImage",
                data: req.body
            })

            res.send({
                "result": "success",
                "image": `\"/assets/img/testImages/${req.body.boxId}_${imgNum}.png\"`,
                "brand": "test",
                "doUpdate": false,
                "doReset": false,
                "fwUrl": "",
                "timeUTC": parseInt(new Date().getTime()/1000),
                "do_format": false
               })
        } else {
            res.send({
                "result": "success",
                "image": "",
                "brand": "test",
                "doUpdate": false,
                "doReset": false,
                "fwUrl": "",
                "timeUTC":  parseInt(new Date().getTime()/1000),
                "do_format": false
               })
        }
        
    })

    app.get('/api/get_boot_infos', async (req, res) => {
        // query obj have then method but it is not fully promse without exec()
        let r =  await boot.find({}).select('bootName description data date _id').exec();
        res.json({
            data: r
        })
    });

    app.get('/api/deleteBoot', async (req, res) => {
        boot.findByIdAndRemove(req.param('id'), function(error, removedBoot) {
            if (error) {
                return res.status(500).send(`can't delect boot<br>error ms: ${error}`)
            } else {
                if (removedBoot) {
                    console.log(`bootId: ${removedBoot.id} deleted`)
                    return res.status(200).redirect('/')
                } else {
                    console.log("can't see any boot")
                }      
            }
        })
    })

    app.get('/api/reTest', async (req, res)=>{
        console.log("req.param('macAddress'): ", req.param('macAddress'))
        
        if (!req.param('macAddress')) {
            console.log("none macAddress For Searching")
            res.status(404).send("none macAddress For Searching")
            return
        }
        
        let lastTestinResult = await getLastTestingResult(req.param('macAddress'))
        
        if (lastTestinResult) {
            lastTestinResult.inUsing = {
                status: false,
                reason: "user press re-test button"
            }
            lastTestinResult.save((doc,err)=>{
                console.log("retest lastTestinResult.inUsing.status: ", lastTestinResult.inUsing.status)
            })
            res.json({
                ms: `setted retest for device with macAddress: ${lastTestinResult.macAddress}`
            })
        } else {
            res.status(404).send("can't find document for reTest")
        }
    })

    app.get('/api/getStoredFirmwareVersions', async (req, res)=>{
        let r =  listFolder('./firmwares')
        // res.send(r)
        res.json({
            firmwareVersions: r
        });
    })

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'static', 'index.html'))
    })

    // SERVER_PORT = 8000 // JUST FOR TEST
    const s = server.listen(SERVER_PORT, (client) => {
        console.log(`server is running on :  http://localhost:${s.address().port}`);
    });

    bootSocket.on('connection', (clientBoot) => {
//////////////////////////////////////////////////////////////////////////////////////////
        clientBoot.on("turnQctoolToPoductionMode", sms=>{
            AUTOMATIC_TESTING_PROCESS.stopProcess()
            DIANOGIS_PROCESS.stopProcess()
            MANUAL_TESTING_PROCESS.registerNewSocketClient(clientBoot)
            // MANUAL_TESTING_PROCESS.connectSocketClientWithThisProcess(clientBoot)
        });

///////////////////////////////////////////////////////////////////////////////////////////
        clientBoot.on("turnQctoolToDiagnosisMode", sms=>{
            MANUAL_TESTING_PROCESS.stopProcess()
            AUTOMATIC_TESTING_PROCESS.stopProcess()
            DIANOGIS_PROCESS.registerNewSocketClient(clientBoot)
        })
/////////////////////////////////////////////////////////////////////////////////////////////////////
        clientBoot.on("runAutomaticFactoryQcTool", ()=>{
            MANUAL_TESTING_PROCESS.stopProcess()
            DIANOGIS_PROCESS.stopProcess()
            console.log("runAutomaticFactoryQcTool")
            AUTOMATIC_TESTING_PROCESS.registerNewSocketClient(clientBoot)
         })

    });
}
