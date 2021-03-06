//@include "../DPGT-Library.js"

// Wrap Panel Print File Prepper v1.2
// Written by Samoe (John Sam Fuchs)
// 8/11/21
// 
// Takes selected elements, asks for a file name, creates print file
// Print file to include label, .25" bleed on every side, and a cut line

// WISHLIST
// - Automatically detect how many panels
// - Auto layout panels?
// - Process all panels at once
// --- Loop through all PerfCutContour paths
// --- Remember original file location

// SCRIPT DETAILS
var scriptDeets = {
    name : 'Wrap Panel Print File Prepper',
    version : 'v1.2',
  }

// Init variables
var doc1 = app.activeDocument;
var height = 0
var width = 0
var abs = []
var box = [0, 0, 0, 0]
var cutbox = []
var headerImagePath = assetPath + 'header_wrapper.jpg';

// Init User History
var historyFile = File(historyPath + 'labelList.txt');
historyFile.encoding = "utf-8";
historyFile.open('r');
historyFileText = historyFile.read();
historyFileText = historyFileText.split(';\n')
historyFileText.length = historyFileText.length-1

var historyFile2 = File(historyPath + 'labelList2.txt');
historyFile2.encoding = "utf-8";
historyFile2.open('r');
historyFileText2 = historyFile2.read();
historyFileText2 = historyFileText2.split(';\n')
historyFileText2.length = historyFileText2.length-1

var historyFile3 = File(historyPath + 'labelList3.txt');
historyFile3.encoding = "utf-8";
historyFile3.open('r');
historyFileText3 = historyFile3.read();
historyFileText3 = historyFileText3.split(';\n')
historyFileText3.length = historyFileText3.length-1

var destinationHistory = File(historyPath + 'destinationHistory.txt');
destinationHistory.encoding = "utf-8";
destinationHistory.open('r');
destinationHistory = destinationHistory.read();
///////////////////////

// Define Main Function
function PreparePrintFile(label, filename) {

////// 1. INITIAL ACTIONS

    // MAKE NEW FILE WITH SELECTION

    app.executeMenuCommand("copy");
    doc = app.documents.add(
        DocumentColorSpace.CMYK,
        (300*72),
        (300*72),
        1
    );
    abs = doc.artboards[0]

    // PASTE SELECTION AND SET UP ARTBOARD
    app.executeMenuCommand("paste");

    for (i = 0; i < doc.pathItems.length; i++) {
        var pathItem = doc.pathItems[i]
        if (pathItem.typename == "PathItem") {
            if (pathItem.strokeColor.typename == "SpotColor") {
                cutbox = pathItem.geometricBounds;
                    pathItem.left = (pathItem.left-1.8);
                    pathItem.top = (pathItem.top+1.8);
                    pathItem.width = (pathItem.width+3.6);
                    pathItem.height = (pathItem.height+3.6);
                artbox = pathItem.geometricBounds;
            }
        }
    }

    // ADJUST ARTBOARD BOUNDS
    abs.artboardRect = artbox;
    height = doc.height;
    width = doc.width;

    // CLIP CONTENTS TO ARTBOARD
    app.executeMenuCommand("makeMask");

    // REMOVE SPOT COLORS IF THEY ALREADY EXIST
    for (i = 0; i < doc.spots.length; i++) {
        if (doc.spots[i].name == 'PerfCutContour' ) {
            doc.spots[i].remove()
        }
    }
    
    // CREATE PERFCUTCONTOUR SPOT COLOR
    var PerfCutSpot = doc.spots.add();
    var spotCMYK = new CMYKColor();
        spotCMYK.cyan = 100;
        spotCMYK.yellow = 100;
        PerfCutSpot.name = "PerfCutContour";
        PerfCutSpot.colorType = ColorModel.SPOT;
        PerfCutSpot.color = spotCMYK;
    var PerfCutContour = new SpotColor();
        PerfCutContour.spot = PerfCutSpot;

    // CREATE CUT LINE
    var cutLine = doc.pathItems.rectangle(0, 0, (width-3.6), (height-3.6));
        cutLine.position = [(artbox[0]+1.8), (artbox[1]-1.8)];
        cutLine.stroked = true;
        cutLine.strokeWidth = 0.2;
        cutLine.strokeColor = PerfCutContour;
        cutLine.fillColor = NoColor;
            
    // CREATE LABEL
    var printLabel = app.activeDocument.textFrames.add("");
        printLabel.contents = label;
        printLabel.position = [(artbox[0]+2), (artbox[1]-2)]
        whiteCMYK = new CMYKColor();
            whiteCMYK.cyan = 0;
            whiteCMYK.magenta = 0;
            whiteCMYK.yellow = 0;
            whiteCMYK.black = 0;
        printLabel.textRange.fillColor = whiteCMYK;

    saveAndClose(doc, destination, filename)

return;
}

function showWindow() {
    // Window Setup
    var w = new Window("dialog", "Wrap Panel File Prepper");
    
    // SET MARGINS
    w.margins = [0, 0, 0, 0];
    // BACKGROUND COLOR
    w.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR,dpgPlum);
    
    // HEADER IMAGE
    var headerImage = w.add("image", undefined, File(headerImagePath));

    historyFile = File(historyFile);

    // LABEL INPUT
    var myEditGroup = w.add("group")
        myEditGroup.add("statictext", undefined, "Label Part 1: ")
            var group = myEditGroup.add ("group {alignChildren: 'left', orientation: ???stack'}");
                labelList = group.add ("dropdownlist", undefined, historyFileText);
                var printLabelText = group.add ("edittext");
                    printLabelText.text = historyFileText[historyFileText.length-1];
                    labelList.preferredSize.width = 340; labelList.preferredSize.height = 24;
                    printLabelText.preferredSize.width = 320; printLabelText.preferredSize.height = 24;
                    labelList.onChange = function () {
                        printLabelText.text = labelList.selection.text;
                        printLabelText.active = true;
                    }
    var myEditGroup2 = w.add("group")
        myEditGroup2.add("statictext", undefined, "Label Part 2: ")
            var soup = myEditGroup2.add ("group {alignChildren: 'left', orientation: ???stack'}");
                labelList2 = soup.add ("dropdownlist", undefined, historyFileText2);
                var printLabelText2 = soup.add ("edittext");
                    printLabelText2.text = historyFileText2[historyFileText2.length-1];
                    labelList2.preferredSize.width = 340; labelList2.preferredSize.height = 24;
                    printLabelText2.preferredSize.width =  320; printLabelText2.preferredSize.height = 24;
                    labelList2.onChange = function () {
                        printLabelText2.text = labelList2.selection.text;
                        printLabelText2.active = true;
                    }
    var myEditGroup3 = w.add("group")
        myEditGroup3.add("statictext", undefined, "Label Part 3: ")
            var loup = myEditGroup3.add ("group {alignChildren: 'left', orientation: ???stack'}");
                labelList3 = loup.add ("dropdownlist", undefined, historyFileText3);
                var printLabelText3 = loup.add ("edittext");
                    printLabelText3.text = historyFileText3[historyFileText3.length-1];
                    labelList3.preferredSize.width = 340; labelList3.preferredSize.height = 24;
                    printLabelText3.preferredSize.width =  320; printLabelText3.preferredSize.height = 24;
                    labelList3.onChange = function () {
                        printLabelText3.text = labelList3.selection.text;
                        printLabelText3.active = true;
                    }

    var myInputGroupDestination = w.add("group");
  
    myInputGroupDestination.add("statictext", undefined, "Destination: ")
    var destinationPath = myInputGroupDestination.add("edittext", undefined, destinationHistory)
    destinationPath.characters = 24;
    destination = destinationPath.text
    var destinationButton = myInputGroupDestination.add("button", undefined, "Browse")
    destinationButton.onClick = function() {
      var folderPath3 = Folder.selectDialog("Select the folder where you'd like your generated sheets to save")
      if (folderPath3) {
        destinationPath.text = decodeURI(folderPath3.fsName);
        destination = Folder(destinationPath.text);
      }
    }

    // BUTTON PANEL
    var myButtonGroup = w.add("group")

    // SUBMIT BUTTON
    var submitButton = myButtonGroup.add("button", undefined, "OK");
        submitButton.alignment = "center";
        submitButton.onClick = function() {
            var label = printLabelText.text + " - " + printLabelText2.text + " - " + printLabelText3.text
            var filename = printLabelText.text + "_" + printLabelText2.text + "_" + printLabelText3.text
            destination = destinationPath.text
            PreparePrintFile(label, filename);
            if (!arrayContains(historyFileText,printLabelText.text)) {
                var JFile = new File(historyPath + encodeURI("/labelList.txt"));
                var content = printLabelText.text + ";\n";
                writeFile(JFile, content);
            }
            if (!arrayContains(historyFileText2,printLabelText2.text)) {
                var JFile = new File(historyPath + encodeURI("/labelList2.txt"));
                var content = printLabelText2.text + ";\n";
                writeFile(JFile, content);
            }
            if (!arrayContains(historyFileText3,printLabelText3.text)) {
                var JFile = new File(historyPath + encodeURI("/labelList3.txt"));
                var content = printLabelText3.text + ";\n";
                writeFile(JFile, content);
            }
            var destFile = new File(historyPath + encodeURI("/destinationHistory.txt"))
            var content = destinationPath.text
            writeFile(destFile,content, "w");
        return w.close();
        }

    // CANCEL BUTTON
    var cancelButton = myButtonGroup.add("button", undefined, "Cancel");
    cancelButton.alignment = "center";

    // FOOTER IMAGE
    createFooter(w, scriptDeets.version)

    w.show();
    return;
}

function writeFile(fileObj, fileContent, mode, encoding) {
    encoding = encoding || "utf-8";
    if (mode == null) {
        mode = "a"
    }
    if (!fileObj.exists) {
        fileObj = (fileObj instanceof File) ? fileObj : new File(fileObj);
    }
    fileObj.encoding = encoding;
    fileObj.open(mode, fileContent);
    fileObj.write(fileContent);
    fileObj.close();
    return fileObj;
}

// SAVE AND CLOSE FILE
function saveAndClose(doc, dest, name) {
    fileNameSave = ("/" + name + '.pdf')
    var saveName = new File(destination + fileNameSave);
    doc.saveAs(saveName, saveOpts);
    doc.close();
  }

// Execute Main Function
showWindow();