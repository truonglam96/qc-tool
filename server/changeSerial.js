const { theBoot } = require('./boot')
const { esp } = require('./esp')
const { certificateInfos } = require('./models')
const fs = require('fs')

var devicesOverlapSerial = fs.readFileSync('./devicesOverLapSerial.json')
devicesOverlapSerial = JSON.parse(devicesOverlapSerial) 

function text2Binary(string) {
    return string.split('').map(function (char) {
        return char.charCodeAt(0).toString(2);
    }).join(' ');
}

function binaryStringToASCII2String(str) {
    var binString = '';

    str.split(' ').map(function(bin) {
        binString += String.fromCharCode(parseInt(bin, 2));
    });
    return binString;
}

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) +
     replacement+ this.substr(index + replacement.length);
}

function getSerialFromHPI(HPI) {
    let serial = HPI.split(':')[1]
                    .split('_')[2]

    if (serial.length < 7) return ''

    serial = serial.substring(1,7)
    return serial
};

var SERIALS_ALLOCATED = [];

(async ()=>{
    for (let devicesOverLapSerialGroup of devicesOverlapSerial) { // allocate new serial for device
        if (devicesOverLapSerialGroup.length == 1) continue
        
        console.log("find serial at group: ", devicesOverLapSerialGroup)
        for (let i = 1; i < devicesOverLapSerialGroup.length; i++) { // reuse the first one
            let serial = getSerialFromHPI(devicesOverLapSerialGroup[i].HPI)
            let binaryConvertedFromSerial = text2Binary(serial)
            
            for (let i = 0; i < binaryConvertedFromSerial.length; i++) { //turn bit 0 to 1
                if (
                    (binaryConvertedFromSerial[i] != '1') &&
                    (binaryConvertedFromSerial[i] != ' ')
                ) {
                    let binarySerialChanged = binaryConvertedFromSerial.replaceAt(i, '1')
                    
                    let serialChanged = binaryStringToASCII2String(binarySerialChanged)
                    
                    let serialChangedArr = serialChanged.split('') 
                    let lowercaseCharacterInString = serialChangedArr.find(character => ((
                                                                    character.toLowerCase() == character) &&
                                                                    !parseInt(character)
                    ))

                    if (lowercaseCharacterInString) continue

                    let _certificateInfo = await certificateInfos.findOne({
                        serial: serialChanged
                    }).exec()
                    
                    if (!_certificateInfo && !SERIALS_ALLOCATED.find(serial => (serial == serialChanged))) {
                        console.log("old serial overlaped: ", serial)
                        console.log("this serial is not avalable in database: ", serialChanged)
                        devicesOverLapSerialGroup[i].newSerial = serialChanged
                        SERIALS_ALLOCATED.push(serialChanged)
                        break
                    }
                }
            }
        }
    }

    fs.writeFileSync('./newSerial.json',JSON.stringify(devicesOverlapSerial))

})();


/////////////////////////////////////////////////////////////////////////////////////////////////
/*
theBoot.findSerialPorts(async (newPortConnected, oldPortRemoved)=>{
    if (newPortConnected) {
        let serial = await esp.readDeviceSerial(newPortConnected)
        console.log("serial got from device: ", serial)

        let binaryConvertedFromSerial = text2Binary(serial)

        bitPositionToChange = 0
        for (let i = 0; i < binaryConvertedFromSerial.length; i++) {
            if (
                (binaryConvertedFromSerial[i] != '1') &&
                (binaryConvertedFromSerial[i] != ' ')
            ) {
                let binarySerialChanged = binaryConvertedFromSerial.replaceAt(i, '1')
                
                let serialChanged = binaryStringToASCII2String(binarySerialChanged)

                let _certificateInfo = await certificateInfos.findOne({
                    serial: serialChanged
                }).exec()
                
                console.log("certificate info got: ", _certificateInfo)

                if (!_certificateInfo) {
                    console.log("binaryConvertedFromSerial: ", binaryConvertedFromSerial)
                    console.log("binarySerialChanged: ", binarySerialChanged)
                    console.log("changed at position: ", i)
                    console.log("this serial is not avalable in database: ", serialChanged)
                    break
                }
            }
        }
    }
})
*/