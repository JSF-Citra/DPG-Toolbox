// Hello
//@include "papaparse.js"

var CSVpath = "C:/Users/jfuchs/Documents/DPG-Toolbox/CSV Testing/23837.csv"
var results = {}


startEngine(CSVpath);


function startEngine(CSVfile) {
    Papa.parse(CSVfile)
    return results;
}

print(results);

if (typeof Object.create === 'undefined') {
    Object.create = function (o) { 
        function F() {} 
        F.prototype = o; 
        return new F(); 
    };
}