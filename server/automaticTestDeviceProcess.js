const { theBoot } = require("./boot");
const { telegram } = require("./telegram_service");
const { listFolder, consoleToLogger, uuidv4 } = require("./utility");
const { automaticTestingResult, manualTestingResult } = require("./models");
const axios = require("axios");
const esp = require("./esp").esp;
const { certificateInfos } = require("./models");

// const {TESTING_MODES,  TESTING_STATUS} = require('./FactoryAutomaticTestProcess')
const conf = require("../config");
const delay = require("delay");
const { log } = require("console");

var WAS_ERROR = false;

const TESTING_MODES = {
  AUTOMATIC_TEST: 1,
  MANUAL_TEST: 2,
};

const TESTING_STATUS = {
  IN_WAITING: 1,
  IN_TESTING: 2,
  TESTING_FAIL: 3,
  DEVICE_BROKEN: 4,
  TESTING_PASS: 5,
};

var propertiesTestingProcessTracked = {
  device: {
    testingStatus: null,
    macAddress: null,
    HPI: null,
    serialPort: null,
  },
  theBoot: theBoot,
  bootName: null,
  testingResult: [],
  testingResultSummarize: [],
  reasonFail: null,
};

var beginTestTime = null;

var ParentProcessbroadcaster = {
  pushNotification: function (data) {
    process.send({
      api: "pushNotification",
      data: data,
    });
  },

  sendTestingStatus: function (testingStatus) {
    process.send({
      api: "testingRunningStatus",
      data: testingStatus,
    });
  },
};

// should call after device being init
async function isSerialPortStillAvalable() {
  let gotSerialPortInfos = await theBoot.listSerialPorts();
  serialPortPlugged = gotSerialPortInfos.find(
    (serialPort) =>
      serialPort == propertiesTestingProcessTracked.device.serialPort
  );

  if (!serialPortPlugged) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>captured serial port broken");
    throw Error("Device Broken");
  }
}

// theBoot.registerSerialPortClosedEvent((portClosed)=>{
//     console.log("serial port closed: ", portClosed)
//     // throw Error('Serial Port ')
// })

async function storeTestingResult(device, testingResult) {
  if (!device.macAddress) throw Error("Can't Save with empty macAddress");

  ParentProcessbroadcaster.pushNotification({
    title: "Process Testing Running Status",
    message: "Begin Save Data",
    type: "warning",
    duration: 5000,
  });

  // try {
  //     testingResult = JSON.stringify(testingResult)
  // } catch (error) {
  //     console.log("parse testing result got error: ", error)
  //     console.log("testing result was: ", testingResult)
  //     testingResult = '[]'
  // }

  let t = {
    result: testingResult,
    testingTime: new Date().getTime() - beginTestTime,
    logDebug: JSON.stringify(
      propertiesTestingProcessTracked.theBoot.allLogDebugs
    ),
    macAddress: device.macAddress,
    testingName: propertiesTestingProcessTracked.bootName,
    resultsSumarize: propertiesTestingProcessTracked.testingResultSummarize,
    reasonFail: propertiesTestingProcessTracked.reasonFail,
    HPI: propertiesTestingProcessTracked.device.HPI,
    date: new Date(),
  };

  getFirmwareName = function () {
    let infos = theBoot.allLogDebugs.find(
      (l) => l.indexOf("efuse") > -1 && l.indexOf("date") > -1
    );
    if (infos) {
      infos = JSON.parse(infos);
      return infos.FW_Version ? infos.FW_Version : infos["FW Version"];
    } else {
      return "";
    }
  };

  let isPass = null;
  propertiesTestingProcessTracked.testingResultSummarize.find(
    (result) => result.result == false
  )
    ? (isPass = false)
    : (isPass = true);
  // propertiesTestingProcessTracked.testingResultSummarize.length == 0 ? isPass = false : isPass = true

  t.isPass = isPass;
  t.firmwareTestName = getFirmwareName();

  try {
    console.log("post testing result to qc server");
    let r = await axios.post(
      `${conf.qcServerEndpoind}/api/automaticResult`,
      t,
      {
        timeout: 3000,
      }
    );
    console.log("post automatic testing result got return: ", r.data);
  } catch (error) {
    console.log("post automatic testing result got error");
    theBoot.sendSerial("led 3");
    device.testingStatus = TESTING_STATUS.DEVICE_BROKEN;
    ParentProcessbroadcaster.pushNotification({
      title: "Process Testing Running Status",
      message: "Saving data error",
      type: "danger",
      duration: 20000,
    });
    throw error;
  }

  ParentProcessbroadcaster.pushNotification({
    title: "Process Testing Running Status",
    message: "Data Saved",
    type: "success",
    duration: 10000,
  });
}

async function testDeviceProcess(device, theBootData) {
  beginTestTime = new Date().getTime();
  let macAddress = null;

  // Set timer for count time testing
  propertiesTestingProcessTracked.device = device;

  propertiesTestingProcessTracked.device.testingStatus =
    TESTING_STATUS.IN_TESTING;
  theBoot.connectEspSerialPort(
    device.serialPort,
    (serialData, connectToSerialPortStatus) => {}
  );

  await theBoot.waitingForSerialPortOpen().then((isDeviceOpenSuccessful) => {
    if (isDeviceOpenSuccessful) {
      propertiesTestingProcessTracked.device.testingStatus =
        TESTING_STATUS.IN_TESTING;
    } else {
      propertiesTestingProcessTracked.device.testingStatus =
        TESTING_STATUS.DEVICE_BROKEN;
    }
  });

  let testingFail = false;
  let isRunBootError = false;
  await theBoot
    .runBoot(
      theBootData,
      null,
      (getScenairoRunningStatusFn = () => {}),
      (testingResultSummarize) =>
        (propertiesTestingProcessTracked.testingResultSummarize =
          testingResultSummarize),

      (afterActionRunCallBack = (
        actionResult,
        actionKey,
        actionType,
        testingResultSummarize,
        allTestingResult
      ) => {
        if (actionResult.error.length > 0) {
          console.log("device fail");
          theBoot.sendSerial("led 3");
          testingFail = true;

          // if(testingFail &&
          //     (propertiesTestingProcessTracked.device.testingStatus != TESTING_STATUS.TESTING_FAIL)) propertiesTestingProcessTracked.device.testingStatus = TESTING_STATUS.TESTING_FAIL
        }
        propertiesTestingProcessTracked.testingResultSummarize =
          testingResultSummarize;
        propertiesTestingProcessTracked.testingResult = allTestingResult;
      })
    )
    .catch((err) => {
      console.log(">>>>>>>>>>>>>>>>>run boot error: ", err);
      propertiesTestingProcessTracked.device.testingStatus =
        TESTING_STATUS.DEVICE_BROKEN;
      throw err;
    });
  if (!testingFail) {
    propertiesTestingProcessTracked.device.testingStatus =
      TESTING_STATUS.TESTING_PASS;
  } else {
    propertiesTestingProcessTracked.device.testingStatus =
      TESTING_STATUS.TESTING_FAIL;
  }
}

class HardwareErrorChecking {
  constructor(maxinumErrorAllow, checker, reasonFail) {
    this.maxinumErrorAllow = maxinumErrorAllow;
    this.failNum = 0;
    this.checker = checker;
    this.reasonFail = reasonFail;
  }

  runCheck(logDebug) {
    if (!this.checker(logDebug)) this.failNum += 1;
    if (this.failNum > this.maxinumErrorAllow) {
      propertiesTestingProcessTracked.reasonFail = this.reasonFail;
      throw Error(this.reasonFail);
    }
  }
}

const resetChecker = new HardwareErrorChecking(
  5,
  (logDebug) => {
    return !logDebug.match(/SPI_FAST_FLASH_BOOT/i);
  },
  "Reset Continuously"
);

const backTraceTracker = new HardwareErrorChecking(
  2,
  (logDebug) => {
    return !logDebug.match(/backtrace/i);
  },
  "Backtrace Detected"
);

const brownoutChecker = new HardwareErrorChecking(
  5,
  (logDebug) => {
    return !logDebug.match(/brownout/i);
  },
  "brownout Detected"
);

const hardwareCheckers = [resetChecker, backTraceTracker, brownoutChecker];

/*
    check for: 
        1. device hang
        2. device reset in continuous 
    and  try to:
        1. get efuse
        2. get macAddress device 
        3. store log debug and all checking results 
*/
async function trackingTestingProcess() {
  let runningTime = 0;
  let delayTime = 1000;
  let timeoutError = 300000; //maximun testing time should be 5 minutes
  let indexLogDebugFound = -1;
  while (timeoutError > 0) {
    await delay(delayTime);
    timeoutError -= delayTime;

    propertiesTestingProcessTracked.device.timeTestingRunning += 1;

    if (theBoot.allLogDebugs.length > indexLogDebugFound) {
      // check hardware fault

      for (
        let i = indexLogDebugFound + 1;
        i < theBoot.allLogDebugs.length;
        i++
      ) {
        for (let hardwareChecker of hardwareCheckers) {
          hardwareChecker.runCheck(theBoot.allLogDebugs[i]);
        }

        indexLogDebugFound += 1;
      }
    }

    await isSerialPortStillAvalable();
    ParentProcessbroadcaster.sendTestingStatus(
      propertiesTestingProcessTracked.device
    );
  }

  propertiesTestingProcessTracked.reasonFail = "timeout Error";

  throw Error("Timeout Error");
}

/*
    {
        api: <>,
        data: {
            device,
            theBootData,
            efuseConfig
        }
    }
*/

process.on("message", async (sms) => {
  if (sms.api === "runTesting") {
    propertiesTestingProcessTracked.device = sms.data.device;
    propertiesTestingProcessTracked.bootName = sms.data.bootName;

    //begin check
    try {
      // read HPI OUT
      ParentProcessbroadcaster.pushNotification({
        title: "Box Running Status",
        message: "Begin Burn Efuse",
        type: "warning",
        duration: 5000,
      });
      let port = sms.data.device.serialPort;

      let HPI = await esp.readHPI(sms.data.device.serialPort);
      //X27KRR, M4KPAD, FDE77U
      if (HPI) {
        //*******************************************************/
        try {
          let _serial = HPI.split("_A")[1];
          let _check = await certificateInfos
            .count({
              serial: _serial,
              isAllocated: true,
            })
            .exec();
          if (_check === 0) {
            let dataJson = require("./4001_5000.json");
            let _privateKey = dataJson.filter((fil) => fil.Serial == _serial)[0]
              .PrivateKey;
            let _PEM = dataJson.filter((fil) => fil.Serial == _serial)[0].PEM;
            //add certificateInfos
            await certificateInfos
              .create({
                dateCreated: 1654844400000,
                certificateFileName:
                  "SBO02_2022_Mar_Production_10300_4001_5000.csv",
                serial: _serial,
                privateKey: _privateKey,
                PEM: _PEM,
                macAddress: "",
                isAllocated: true,
                date: "2022-06-10T07:00:00.000Z",
                __v: 0,
              })
              .then(async function () {
                telegram.sendMessageToChannel(
                  `Imported certificate key to certificateInfo, Serial: ` +
                    _serial
                );
                console.log("OK OK OK OK OK OK OK OK OK OK");
              });
          }
        } catch (error) {
          console.log("LAMNTTTTTTTTTTTTTTTT: ", error);
        }
        //*******************************************************/
      } else {
        propertiesTestingProcessTracked.device.testingStatus =
        TESTING_STATUS.DEVICE_BROKEN;
        throw Error("Can't get HPI");
      }

      // telegram.sendMessageToChannel(`Running testing on port: ` + port)
      // propertiesTestingProcessTracked.device.HPI = HPI;
      // if (!HPI) {
      //   // if not efuse, query serial info and burn it
      //   let certificateInfo = await axios.get(
      //     `${conf.qcServerEndpoind}/api/getCertificateInfoHaveNotUsedYet`
      //   );

      //   console.log("certificateInfo.status: ", certificateInfo.status);
      //   if (certificateInfo.status !== 200) {
      //     telegram.sendMessageToChannel(
      //       `Can't get certificate file, status code: ` + certificateInfo.status
      //     );
      //     theBoot.sendSerial("led 3");
      //     sms.data.device.serialPort = "";
      //     throw Error(
      //       `Can't Get Certificate File, STOP opener process on port ` + port
      //     );
      //   }
      //   certificateInfo = certificateInfo.data;
      //   let efuseConfigWithSerialNumber = sms.data.efuseConfig;
      //   efuseConfigWithSerialNumber.productionLine += certificateInfo.serial;

      //   await theBoot.checkAndBurnEfuse(
      //     sms.data.device.serialPort,
      //     efuseConfigWithSerialNumber
      //   );
      //   propertiesTestingProcessTracked.device.testingStatus =
      //     TESTING_STATUS.IN_TESTING;

      //   ParentProcessbroadcaster.pushNotification({
      //     title: "Box Running Status",
      //     message: "Burn Efuse Done",
      //     type: "success",
      //     duration: 5000,
      //   });

      //   await delay(5000);

      //   HPI = await esp.readHPI(sms.data.device.serialPort);
      //   propertiesTestingProcessTracked.device.HPI = HPI;
      // } else {
      //   ParentProcessbroadcaster.pushNotification({
      //     title: "Box Running Status",
      //     message: `Device Already have HPI: ${HPI}`,
      //     type: "success",
      //     duration: 15000,
      //   });
      // }
    } catch (error) {
      console.log("read info device got error: ", error);
      ParentProcessbroadcaster.pushNotification({
        title: "Box Running Status",
        message: `Burn Efuse Fail\n reason: ${error.message}`,
        type: "danger",
        duration: 15000,
      });
    }

    let macAddress = null;
    try {
      // read macAddress
      macAddress = await esp.readMac(sms.data.device.serialPort);
      propertiesTestingProcessTracked.device.macAddress = macAddress;
      console.log("macAddress: ", macAddress);
    } catch (error) {
      console.log("read macAddress out got error: ", error);
    }

    if (macAddress) {
      // everything ok. Run testing.....
      trackingTestingProcess();
      await delay(12000);
      await testDeviceProcess(sms.data.device, sms.data.theBootData);
      await storeTestingResult(
        propertiesTestingProcessTracked.device,
        propertiesTestingProcessTracked.testingResult
      );

      if (
        propertiesTestingProcessTracked.device.testingStatus ==
        TESTING_STATUS.TESTING_PASS
      ) {
        await delay(1000);
        console.log(
          "test sucessful>>>>>>>>>>>>>>>>send led 6 command to set led to green color"
        );
        theBoot.sendSerial("led 6");
      } else {
        theBoot.sendSerial("led 3");
      }
      await delay(1000);
      // theBoot.sendSerial('led 6')
      process.exit();
    } else {
      propertiesTestingProcessTracked.device.testingStatus =
        TESTING_STATUS.DEVICE_BROKEN;
      throw Error("Can't get macAddress");
    }
  } else if (sms.api == "serialPortClosedConnection") {
    throw Error("serialPortClosedConnection");
  }
});

process.on("unhandledRejection", async (error) => {
  // Will print "unhandledRejection err is not defined"
  if (WAS_ERROR) {
    console.log(">>>>>>>>>>>>>>unhandledRejection", error.message);
    process.exit();
    return;
  }

  console.log(">>>>>>>>>>>>>>unhandledRejection", error.message);
  WAS_ERROR = true;
  propertiesTestingProcessTracked.device.testingStatus =
    TESTING_STATUS.DEVICE_BROKEN;
  await storeTestingResult(
    propertiesTestingProcessTracked.device,
    propertiesTestingProcessTracked.testingResult
  );
  theBoot.sendSerial("led 3");
  await delay(1000);
  process.exit();
});

process.on("exit", (code) => {
  ParentProcessbroadcaster.sendTestingStatus(
    propertiesTestingProcessTracked.device
  );
  console.log(
    `exited process testing device at serial port: ${propertiesTestingProcessTracked.device.serialPort}`
  );
});
