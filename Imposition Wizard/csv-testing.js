// var csv
// const fs = require('fs');
const papa = require('papaparse');
// const file = fs.createReadStream('challenge.csv');
var count = 0; // cache the running count

function parseTheGuy (file){
papa.parse(file, {
    worker: true, // Don't bog down the main thread if its a big file
    step: function(result) {
        // do stuff with result
    },
    complete: function(results, file) {
        console.log('parsing complete read', count, 'records.'); 
    }
});
}

function windowDisplay() {

    // INITIALIZE WINDOW
    var w = new Window("dialog", "Tiler, The Creator");
  
    // BACKGROUND COLOR
    w.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR,
      [0.415, 0.239, 0.345]);

    var myInfoGroupInfo = w.add("group");
    myInfoGroupInfo.alignment = "left";
    myInfoGroupInfo.orientation = "column";

    // SET BACKGROUND COLOR
    var inputPanel = w.add('panel');
    inputPanel.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR,[.4,.4,.4]);

    // FILE BROWSER INPUT
    var myInputGroupSource = w.add("group");
      myInputGroupSource.add("statictext", undefined, "Source: ")
      var sourcePath = myInputGroupSource.add("edittext", undefined, "Source path")
          sourcePath.characters = 22;
          source = sourcePath.text
      var sourceButton = myInputGroupSource.add("button", undefined, "Browse")
          sourceButton.onClick = function() {
      var filePathSelection = File.openDialog("Select the csv file", '*.csv')
      if (filePathSelection) {
        sourcePath.text = decodeURI(filePathSelection.fsName);
        source = Folder(sourcePath.text);
      filePath = filePathSelection
      csvFile = filePath;
      }
    }

    // BOTTOM ROW
    var myButtonGroup = w.add("group");
    myButtonGroup.alignment = "center";
        
      // SUBMIT BUTTON
      var submitButton = myButtonGroup.add("button", undefined, "Submit");
      submitButton.alignment = "right";
      submitButton.onClick = function() {
        parseTheGuy(csvFile);
        return w.close();
    }

    // COPYRIGHT TEXT
    var copyrightText = w.add("statictext", undefined, "© Delta Print Group 2021")
    copyrightText.alignment = "left";
  
    // CANCEL BUTTON
    var cancelButton = myButtonGroup.add("button", undefined, "Cancel");
      cancelButton.alignment = "right";
    w.show();
}

// // function csvToArray(csvFile) {

//   // const myForm = document.getElementById("myForm");
//   // const csvFile = document.getElementById("csvFile");

//   function csvToArray(str, delimiter) {

//     // slice from start of text to the first \n index
//     // use split to create an array from string by delimiter
//     const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

//     // slice from \n index + 1 to the end of the text
//     // use split to create an array of each csv value row
//     const rows = str.slice(str.indexOf("\n") + 1).split("\n");

//     // Map the rows
//     // split values from each row into an array
//     // use headers.reduce to create an object
//     // object properties derived from headers:values
//     // the object passed as an element of the array
//     const arr = rows.map(function (row) {
//       const values = row.split(delimiter);
//       const el = headers.reduce(function (object, header, index) {
//         object[header] = values[index];
//         return object;
//       }, {});
//       return el;
//     });

//     // return the array
//     return arr;
//   }

//   // var arrData = $.csv.toArrays(csvFile);

// // const csvStringToArray = csv =>
// {
//     // const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"),"gi");
//     // var arrMatches = null;
//     // var arrData = [[]];
//     // while (arrMatches = objPattern.exec(csv)){
//     //     if (arrMatches[1].length && arrMatches[1] !== ",")arrData.push([]);
//     //     arrData[arrData.length - 1].push(arrMatches[2] ? 
//     //         arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"") :
//     //         arrMatches[3]);
//     // }
//     // return arrData;
// }


windowDisplay();