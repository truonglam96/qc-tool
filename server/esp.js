var childProcess = require("child_process");
var fs = require("fs");
var path = require("path");
var utility = require("./utility");
var arr_diff = utility.arr_diff;
var delay = require("delay");
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);
var config = require("../config");
const { throws } = require("assert");

module.exports = {
  esp: {
    efuseConfig: null,

    burnFirmware: async function (port, firmwareFolder) {
      // childProcess.execSync('ls').toString()
      let descriptionFile = path.join(firmwareFolder, "description.json");

      let cmd = JSON.parse(fs.readFileSync(descriptionFile)).commandBurn;
      // cmd = cmd.replace('python', '')
      cmd = cmd.replace("esptool.py", "../../tool/esptool.py");
      cmd = cmd.replace("/dev/ttyUSB0", port);
      let cmdArgs = cmd.replace("python", "");
      cmdArgs = cmdArgs.trim();
      cmdArgs = cmdArgs.split(" ");
      console.log(cmdArgs);
      cmd = cmd.trim();
      let r = null;
      try {
        r = await execFile(config.pythonPath, cmdArgs, { cwd: firmwareFolder });
      } catch (error) {
        console.log("burn firmware fail: ", error);
        throw error;
      }

      console.log("after execFile: ", r.stdout);

      return r.stdout;
    },

    eraseFirmware: async function (port) {
      let r = await execFile(config.pythonPath, [
        "tool/esptool.py",
        "--chip",
        "auto",
        "--port",
        port,
        "erase_flash",
      ]);
      return r.stdout.toString();
    },

    eraseFirmwarePartition: async function (port) {
      //esptool.py erase_region 0x20000 0x4000
      let r = await execFile(config.pythonPath, [
        "tool/esptool.py",
        "--chip",
        "auto",
        "--port",
        port,
        "erase_region",
        "0xd000",
        "0xdf3000",
      ]);
      return r.stdout.toString();
    },

    checkAndBurnEfuse: async function (port, efuseConfig) {
      if (!efuseConfig) return;

      if (
        !efuseConfig.model ||
        !efuseConfig.productionLine ||
        !efuseConfig.productionCode
      )
        return;

      console.log("config.pythonPath: ", config.pythonPath);
      let r =
        childProcess.execSync(`${config.pythonPath} -c "from tool.esp_utility import check_and_burn_efuse; check_and_burn_efuse(port='${port}',  \
                            model='${efuseConfig.model}', production_line='${efuseConfig.productionLine}', version_code='${efuseConfig.productionCode}')"`);
      console.log(r.toString());
    },

    readHPI: async function (port) {
      try {
        a = childProcess.execSync(
          `${config.pythonPath} -c "from tool.esp_utility import read_efuse; read_efuse(usb_port='${port}')"`
        );
        a = a.toString();
        console.log("read efuse output: ", a);
  
        if (a.indexOf("Empty Efuse") > -1) {
          console.log("efuse empty");
          // throw new Error('Throw makes it go boom!')
          return undefined
        } else {
          let indexOfEfusePrintOut = a.indexOf("efuse in device: ");
          let HPI = a.substring(
            indexOfEfusePrintOut + "efuse in device: ".length,
            a.indexOf("\n", indexOfEfusePrintOut)
          );
          console.log("hpi found: ", HPI);
          return HPI;
        }
      } catch (error) {
        console.log('Exception in readHPI():',error.message);
        return undefined
      }
    },
    readMac: async function (port) {
      try {
        let a = childProcess.execSync(
          `${config.pythonPath} -c "from tool.esp_utility import read_mac_esp32; read_mac_esp32(usb_port='${port}')"`
        );
        a = a.toString();
        let p = a.indexOf("macAddress: ");
        let mac = a.substring(p + "macAddress: ".length, a.indexOf("\n", p));
        return mac.toUpperCase();
      } catch (error) {
        console.log('Exception in readMac()',error.message);
        return undefined
      }
    },

    resetChip: async function (port) {
      try {
        let a = childProcess.execSync(
          `${config.pythonPath} ${__dirname}/tool/esptool.py --chip auto --port ${port} --after hard_reset run`
        );
        return a.toString();
      } catch (error) {
        console.log('Exception in resetChip()',error.message);
        return undefined
      }
    },

    readDeviceSerial: async function (port) {
      let HPI = await this.readHPI(port);

      if (!HPI) return "";

      // example type of efuse: 2019-11-23:SBO2_3c3e1947_ARE5FAG
      let serial = HPI.split(":")[1].split("_")[2];

      if (serial.length < 7) return "";

      serial = serial.substring(1, 7);
      console.log("Serial:", serial);
      return serial;
    },
  },
};
