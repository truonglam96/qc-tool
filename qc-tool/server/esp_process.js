var childProcess = require('child_process')
var fs = require('fs')
var path = require('path')
var utility = require('./utility');
var arr_diff = utility.arr_diff
var delay = require('delay')
module.exports = {
    espProcess: {
        
        func: function() {
            console.log('just for funny !')
        },

        isEspBusy: false,

        process: NaN,

        autoConnectEsp: true,

        serialPort: [],

        serialPortConnecting: '',

        test: async function () {
            console.log('autoConnectEsp: ' + this.autoConnectEsp)
        },

        // the @arg ms is message send for front-end. that control view and show nofication as well
        pawnEspProcess: async function (childProcess, cmd, args, ms = { "begin": { "controlView": "block", "ms": "" }, "done": {}, "error": {} }, callback=null) {
            console.log('args: ' + args)
            // debugger;
            // at oneTime, there sould be 1 serial process can run    
            if (this.isEspBusy) {
                console.log("esp is busy now!!!!!!!!!")
                // turn current process of ?
                return
            }

            console.log("pawn new process " + cmd + ' ' + args);
            // need replace pawn with execSync ?
            this.process = childProcess.spawn('python3', args, { encoding: 'utf8' })
            this.isEspBusy = true;

            process.send({
                from: process.pid,
                data: ms.begin,
                api: 'statusEspProcessRunning'
            });
            
            // there is need make event emmiter for split hardware threading to network threading ?
            // thinking about there is a stuck on network 
            this.process.stdout.on('data', (data) => {
                let d = data.toString()
                
                // send to father process
                // TODO: WHEN IT SHOULD DO ?
                process.send({
                    from: process.pid,
                    data: d,
                });

                // console.log(d);
            })

            this.process.stderr.on('data', (data) => {
                ms.error.ms = data.toString()

                process.send({
                    from: process.pid,
                    data: ms.error,
                    api: 'statusEspProcessRunning'
                    
                });

                // console.log(data.toString())
                this.isEspBusy = false
                this.process.kill('SIGHUP')
            });

            this.process.on('close', (data) => {
                console.log(data);


                process.send({
                    from: process.pid,
                    data: ms.done,
                    api: 'statusEspProcessRunning'
                    
                });

                this.isEspBusy = false;
                console.log("process close>>>>>>>>>>>>>>>>>>>>>>>");
                this.process.kill('SIGHUP');
                
                if (callback) {
                    callback
                }
            });

            this.process.on('error', (err) => {
                console.log("process error>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                // espProcess.process.terminate()
                ms.error.ms = err.toString();


                process.send({
                    from: process.pid,
                    data: ms.error,
                    api: 'statusEspProcessRunning'
                    
                });

                this.process.kill('SIGHUP');
                console.log('child process fail.' + err);
            })

        },

        findSerialPorts: async function () {
            
            function listSerialPorts() {
                var a = []
                var b = []
                try {
                    var a = files = fs.readdirSync('/dev');
                } catch (error) {
                    console.log("error on list comport")
                }

                a.forEach((e) => {
                    if (e.indexOf('USB') > -1 || e.indexOf('usb') > -1 && e.indexOf('tty') > -1) {
                        b.push(e)
                    }
                })
                return b
            }

            while (true) {
                // find newport
                this.serialPort = listSerialPorts()

                while (true) {
                    await delay(100)

                    if (this.serialPort.length < listSerialPorts().length) {
                        // new port connect
                        if (this.autoConnectEsp) {
                            // get the last serial port found for connect
                            console.log("open serial at port: " + arr_diff(listSerialPorts(), this.serialPort)[0])
                            this.serialPortConnecting = '/dev/' + arr_diff(listSerialPorts(), this.serialPort)[0]
                            this.serialPort = listSerialPorts()
                            this.connectEspSerialPort(this.serialPortConnecting)
                        } else {
                            // waiting for specific connection from server 
                        }
                    }
                    else if (this.serialPort.length > listSerialPorts().length) {
                        try {
                            this.process.kill('SIGHUP')
                        } catch (error) {
                            console.log('process.kill error' + error)
                        }
                        this.serialPort = listSerialPorts()
                    }
                }
            }
        },

        // find the last serial port 
        // and connect it, how to use this function automatically and get command from server ?
        connectEspSerialPort: async function (port) {
            // MUST NEED SPACE
            try {
                this.pawnEspProcess(childProcess, 'python3 ', ['read_serial.py', port],
                    ms = {
                        "begin": { "type": "begin", "controlView": "inline", "ms": "Esp Connect To Serial" },
                        "done": { "type": "done", "controlView": "inline", "ms": "Esp Disconneted" },
                        "error": { "type": "error", "controlView": "inline", "ms": "Esp Disconneted" }
                    }
                );
            } catch (error) {
                console.log('connect serial error' + error);
            }
        },

        eraseFirmware: async function () {
            await espProcess.terminateEspProcess();
            
            espProcess.pawnEspProcess(childProcess, 'python3 ',
                ['esp_utility.py', 'erase_firmware', espProcess.serialPortConnecting, '115200'],
                ms = {
                    "begin": { "type": "begin", "controlView": "block", "ms": "Esp Begin Erase Firmware" },
                    "done": { "type": "done", "controlView": "inline", "ms": "Done Erase Frimware" },
                    "error": { "type": "error", "controlView": "inline", "ms": "" }
                }
            );
            // start python process
        },

        burnFirmware: async function (cmd, folder) {
            cmd = cmd.replace('python', '')
            cmd = cmd.replace('/dev/ttyUSB0', this.serialPortConnecting)
            cmd = cmd.replace('esptool.py', 'tool/esptool.py')
            cmd = cmd.replace('bootloader.bin', folder + '/bootloader.bin')
            cmd = cmd.replace('box-plus.bin', folder + '/box-plus.bin')
            cmd = cmd.replace('partitions.bin', folder + '/partitions.bin')
            cmd = cmd.trim()
            console.log("cmd for burn firmware: " + cmd)
            espProcess.pawnEspProcess(childProcess, 'python', cmd.split(' '),
                ms = {
                    "begin": { "type": "begin", "controlView": "block", "ms": "Esp Begin Burn Firmware" },
                    "done": { "type": "done", "controlView": "inline", "ms": "Eps Done Burn Frimware" },
                    "error": { "type": "error", "controlView": "inline", "ms": "" }
                },
            )
        },

        readLogDebug: async function () {
        },

        terminateEspProcess: async function () {
            try {
                this.process.kill('SIGHUP')
            } catch (error) {

            }

            while (this.isEspBusy) {
                console.log("waiting espProcessStop")
                await delay(100)
            }
        }

    }
}
