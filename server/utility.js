var fs = require('fs')
const { Console } = require('console')
const date = require('date-and-time');
require('dotenv').config();

module.exports = {
    arr_diff: function  (a1, a2) {

        var a = [], diff = [];
    
        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }
    
        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }
    
        for (var k in a) {
            diff.push(k);
        }
    
        return diff;
    },

    jsonToTable: function(json) {
    
        let thThead;
        for (k in json) {
            thThead += `<th>${k}</th>`  
        }
    
        return (
                `table class="table"
            <thead>
                <tr>
                    ${thThead}
                </tr>
            </thead>
            <tbody>
            </tbody>
        `)
    },

    listFolder: function(path) {
        return fs.readdirSync(path).filter(function (file) {
              return fs.statSync(path+'/'+file).isDirectory();
        });  
    },

    consoleToLogger: function(outputFile) {
        if (process.env.MODE !== 'DEV') {
            let errFile = `${outputFile}.error`
            let logger = new Console({stdout: fs.createWriteStream(outputFile), stderr: fs.createWriteStream(errFile)})    
    
            fs.writeFileSync(outputFile, '')
            fs.writeFileSync(errFile, '')

            console.log = function(...args) {
                logger.log(`${date.format(new Date(), 'HH:mm:ss:SSS')}: `, args.join(''))
            }
        }
    },

    hex_to_ascii:  function(hexStr){
        var hex  = hexStr.toString();
        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        return str;
     },

    uuidv4: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    },
    getWeekNumber: function (d) {
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        // Get first day of year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        // Return array of year and week number
        return [d.getUTCFullYear(), weekNo];
    },

    decimalToHexString: function(number) {
        if (number < 0)
        {
          number = 0xFFFFFFFF + number + 1;
        }
      
        return number.toString(16).toUpperCase();
    }
} 