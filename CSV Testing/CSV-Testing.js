// Hello
//@include "csvParser.js"

var CSVpath = "C:/Users/jfuchs/Documents/DPG-Toolbox/CSV Testing/23837.csv"
var results = {}

var textLines = CSV.reader.read_in_txt();
var data = CSV.reader.textlines_to_data(textLines, ",")

for (i = 0; i < textLines.length; i++) {
    // $.writeln(textLines[i]);
    $.writeln(textLines[i]);
    if (i !== 0) {
    var csvEntryData = data.fields[i-1];
    $.writeln("Order Number: " + csvEntryData.field_0);
    $.writeln("SKU Number: " + csvEntryData.field_1);
    }
}
// var textLines = CSV.reader.textlines_to_data();        

// CSV.readFile();

// if (typeof Object.create === 'undefined') {
//     Object.create = function (o) { 
//         function F() {} 
//         F.prototype = o; 
//         return new F(); 
//     };
// }