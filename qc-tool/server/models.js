var mongoose = require('mongoose');

const fs = require('fs')
const config = require('../config')

require('dotenv').config();

const Schema = mongoose.Schema;

const automaticTestingResultSchema = new Schema({
  date: { type: Date, default: Date.now },
  testingName: String,
  macAddress: String,
  result: [],
  resultsSumarize: [],
  testingTime: Number,
  logDebug: String,
  testImage: String,
  isPass: Boolean,
  HPI: String,
  firmwareTestName: String,
  oldData: Boolean,
  reasonFail: String
}, { minimize: false })

const certificateInfos = new Schema({
  date: { type: Date, default: Date.now },
  dateCreated: Number,
  certificateFileName: String,
  serial: String,
  privateKey: String,
  publicKey: String,
  PEM: String,
  macAddress: String,
  isAllocated: Boolean
})

const manualTestingResultSchema = new Schema({
  date: { type: Date, default: Date.now },
  macAddress: String,
  result: String,
  testingName: String,
  testingTime: Number,
  logDebug: String,
  testImage: [],
  isPass: Boolean,
  oldData: Boolean,
  HPI: String,
  firmwareTestName: String,
  updatedOTAFirmwareName: String
}, { minimize: false })

const testingResultSchema = new Schema({
  date: { type: Date, default: Date.now },
  macAddress: String,
  automaticTestingResult: [{type: Schema.Types.ObjectId, ref: 'automaticTestingResult'}],
  manualTestingResult: manualTestingResultSchema,
  inUsing: {
    status: Boolean,
    reason: String
  },
}, { minimize: false });

manualTestingResultSchema.methods.getManualTestingResult = function() {
  return JSON.parse(this.result)
}

manualTestingResultSchema.methods.isTestingPass = function() {
  for(let i of JSON.parse(this.result)) {
    if (i.result === false) {
      return false
    } 
  }
  return true
}

manualTestingResultSchema.methods.getHPI = function() {
  if (this.HPI) return this.HPI
  // find by info command
  let logDebugs = JSON.parse(this.logDebug)
  let infos = logDebugs.find(l => (l.indexOf('efuse') > -1 && l.indexOf('date') > -1))
  if (infos) {
    infos = JSON.parse(infos)
    return infos.efuse
  } else {
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>manualTestingResult can't get efuse at macAddress", this.macAddress)
    // console.log(">>>>>>>>here is log debug: ", (JSON.parse(this.logDebug).join('\n')))
    return ''
  }

}

manualTestingResultSchema.methods.getFirmwareName = function() {
  // find by info command
  let logDebugs = JSON.parse(this.logDebug)
  // console.log("logDebugs: ", logDebugs)
  let infos = logDebugs.find(l => (l.indexOf('efuse') > -1 && l.indexOf('date') > -1))
  if (infos) {
    infos = JSON.parse(infos)
    return infos.FW_Version ? infos.FW_Version : infos['FW Version']
  } else {
    return ''
  }
}

manualTestingResultSchema.methods.getFirmwareAfterUpdateOTA = function() {
  // find by info command
  let firmwareVersion = JSON.parse(this.logDebug).find(l=>(l.indexOf('FW Version: ') > -1))
  if (firmwareVersion) {
    firmwareVersion = firmwareVersion.substring(firmwareVersion.indexOf('FW Version: ') + 'FW Version: '.length, firmwareVersion.length-1)
    return firmwareVersion
  } else {
    return ''
  }
},

// check if automation test not err
automaticTestingResultSchema.methods.isAutomaticTestingPass = function() {
  let result =  this.getScenarioTestResult()
  let r = null

  r = result.find( scenarioTestResult=>{
                    return scenarioTestResult.result === false 
            }) ? false : true
  return r
}

automaticTestingResultSchema.methods.getHPI = function() {
  // find by info command
  if (this.HPI) return this.HPI

  let logDebugs = JSON.parse(this.logDebug)
  let infos = logDebugs.find(l => (l.indexOf('efuse') > -1 && l.indexOf('date') > -1))
  // console.log("infos: ", infos)
  if (infos) {
    infos = JSON.parse(infos)
    // console.log("manual infos: ", infos)
    return infos.efuse
  } else {
    // console.log("automaticTestingResult can't get efuse, infos: ", infos)
    // console.log(">>>>>>>>here is log debug: ", JSON.parse(this.logDebug).join('\n'))
    return ''
  }
}

automaticTestingResultSchema.methods.getFirmwareName = function () {
  // find by version command
  let logDebugs = JSON.parse(this.logDebug)
  let infos = logDebugs.find(l => (l.indexOf('efuse') > -1 && l.indexOf('date') > -1))
  if (infos) {
    infos = JSON.parse(infos)
    return infos.FW_Version ? infos.FW_Version : infos['FW Version']
  }
}

automaticTestingResultSchema.methods.getScenarioTestResult = function() {
  let scenarioTestResults = []
  let isChecked = false
  let result = null
  var nameScenarioTest = null

  if (this.resultsSumarize) return this.resultsSumarize
  
  try {
    for (let scenarioTestResult of JSON.parse(this.result)) {
      isChecked = false
      result = scenarioTestResult.find(action=>{
        return JSON.parse(action.logDebugsSearchedResult).error.length>0 
      })  ? false : true
      // each scenairo keep a list of actions
      // in action we are store name of scenairoTest
      scenarioTestResults.push({
        scenarioTestName: scenarioTestResult[0].scenarioTestName,
        result: result 
      })
    }  
  } catch (error) {
    console.log("parse scenario test result got error: ", error)
  }
  
  return scenarioTestResults
}

 // create schema class
const bootSchema = new Schema({
  bootName: String,
  data: String,
  description: String,
  date: { type: Date, default: Date.now }
}, { minimize: false });

const qctoolFactoryConfiguration = new Schema({
    date: { type: Date, default: Date.now },
    efuseConfig: {
        model: String,
        productionCode: String,
        productionLine: String
    },
    bootExecuted: bootSchema,
    OTAFirmwareName: String
})

var automaticTestingResult = mongoose.model('automaticTestingResult', automaticTestingResultSchema)
var manualTestingResult = mongoose.model("manualTestingResult", manualTestingResultSchema)

async function getLastTestingResult(collections, macAddress) {
  let lastTestingResult = null
  await collections.find({macAddress: macAddress}).sort({ _id: -1 }).exec()
              .then((docs)=>{
                  lastTestingResult = docs[0]
              })
              .catch(err=>{
                      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>get data error")
                      throw Error('Get Last Testing Resul Error: ', err)
              })
          
  return lastTestingResult
}


// mongoose.set('useFindAndModify', false)
MONGO_URL = config.mongoDB_URL

// console.log("connect to MONGO_URL: ", MONGO_URL)
mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  serverSelectionTimeoutMS: 50000
  }).
  then(()=>{
    console.log("connected to mongoose")
  }).
  catch(error=>{  
    if(error) {
      console.log("can't connect to mongDB: ", error)
      throw error
    }
    console.log("mongoDB connect successful")
  })

mongoose.connection.on('disconnected', function(){console.log('mongoos disconnected')});

mongoose.connection.on('reconnected', ()=>{
  console.log("mongoos reconnected")
})

module.exports = {
  boot:  mongoose.model('boot', bootSchema),
  testingResult: mongoose.model('testingResult', testingResultSchema),
  automaticTestingResult: mongoose.model('automaticTestingResult', automaticTestingResultSchema),
  manualTestingResult: mongoose.model("manualTestingResult", manualTestingResultSchema),
  certificateInfos: mongoose.model("certificateInfos", certificateInfos),
  getLastTestingResult: getLastTestingResult
}