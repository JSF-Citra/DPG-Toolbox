//@include "../DPGT-Library.js"

// Wrap Panel Print File Prepper v1.5
// Written by Samoe (John Sam Fuchs)
// 8/16/21
// 

// SCRIPT DETAILS
var scriptDeets = {
    name : 'Wrap Panel Print File Prepper',
    version : 'v1.5',
}

// Init variables
var doc1 = app.activeDocument;
var height = 0
var width = 0
var abs = []
var box = [0, 0, 0, 0]
var cutbox = []
var headerImagePath = assetPath + 'header_wrapper.jpg';
var panelPaths = [];
var autoPanel = true;
var enablePrintLabel = true;

// User History
var historyFile1 = readHistFile('labelList.txt');
var historyFile2 = readHistFile('labelList2.txt');
var historyFile3 = readHistFile('labelList3.txt');
var destinationHistory = readHistFile('destinationHistory.txt');
///////////////////////

// CREATE SCRIPT WINDOW
function showWindow() {
    var w = new Window("dialog", "Wrap Panel File Prepper");

    // SET MARGINS
    w.margins = [0, 0, 0, 0];
    // BACKGROUND COLOR
    w.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR,dpgPlum);
    
    // HEADER IMAGE
    var headerImage = w.add("image", undefined, File(headerImagePath));

    // LABEL INPUT
    var groupLabelInput = w.add("group")
        groupLabelInput.add("statictext", undefined, "Label Part 1: ")
            var group = groupLabelInput.add ("group {alignChildren: 'left', orientation: ’stack'}");
                labelList = group.add ("dropdownlist", undefined, historyFile1);
                var printLabelText = group.add ("edittext");
                    printLabelText.text = historyFile1[historyFile1.length-1];
                    printLabelText.preferredSize.width = 320; printLabelText.preferredSize.height = 24;
                    labelList.preferredSize.width = 340; labelList.preferredSize.height = 24;
                    labelList.onChange = function () {
                        printLabelText.text = labelList.selection.text;
                        printLabelText.active = true;
                    }
    var groupLabelInput2 = w.add("group")
        groupLabelInput2.add("statictext", undefined, "Label Part 2: ")
            var soup = groupLabelInput2.add ("group {alignChildren: 'left', orientation: ’stack'}");
                labelList2 = soup.add ("dropdownlist", undefined, historyFile2);
                var printLabelText2 = soup.add ("edittext");
                    printLabelText2.text = historyFile2[historyFile2.length-1];
                    labelList2.preferredSize.width = 340; labelList2.preferredSize.height = 24;
                    printLabelText2.preferredSize.width =  320; printLabelText2.preferredSize.height = 24;
                    labelList2.onChange = function () {
                        printLabelText2.text = labelList2.selection.text;
                        printLabelText2.active = true;
                    }
    var groupLabelInput3 = w.add("group")
        groupLabelInput3.add("statictext", undefined, "Label Part 3: ")
            var loup = groupLabelInput3.add ("group {alignChildren: 'left', orientation: ’stack'}");
                labelList3 = loup.add ("dropdownlist", undefined, historyFile3);
                var printLabelText3 = loup.add ("edittext");
                    printLabelText3.text = historyFile3[historyFile3.length-1];
                    labelList3.preferredSize.width = 340; labelList3.preferredSize.height = 24;
                    printLabelText3.preferredSize.width =  320; printLabelText3.preferredSize.height = 24;
                    labelList3.onChange = function () {
                        printLabelText3.text = labelList3.selection.text;
                        printLabelText3.active = true;
                    }

    var groupDestination = w.add("group");
  
    groupDestination.add("statictext", undefined, "Destination: ")
    var destinationPath = groupDestination.add("edittext", undefined, destinationHistory)
        destinationPath.characters = 24;
        destination = destinationPath.text
    var destinationButton = groupDestination.add("button", undefined, "Browse")
    destinationButton.onClick = function() {
      var folderPath3 = Folder.selectDialog("Select the folder where you'd like your generated sheets to save")
      if (folderPath3) {
        destinationPath.text = decodeURI(folderPath3.fsName);
        destination = Folder(destinationPath.text);
      }
    }

    var groupOptionButtons = w.add("group")
    var autoPanelButton = groupOptionButtons.add ("checkbox", undefined, "AutoPanel");
    autoPanelButton.value = true;
    
    var enableLabelButton = groupOptionButtons.add ("checkbox", undefined, "Generate Label");
    enableLabelButton.value = true;
    
    // BUTTON PANEL
    var groupButtons = w.add("group")

    // SUBMIT BUTTON
    var submitButton = groupButtons.add("button", undefined, "OK");
        submitButton.alignment = "center";
        submitButton.onClick = function() {
            autoPanel = autoPanelButton.value;
            enablePrintLabel = enableLabelButton.value;
            var label = printLabelText.text + " - " + printLabelText2.text + " - " + printLabelText3.text
            var filename = printLabelText.text + " - " + printLabelText2.text + " - " + printLabelText3.text
            destination = destinationPath.text
            prepareToStart(label, filename);

            // UPDATE HISTORY
            if (!arrayContains(historyFile1,printLabelText.text)) {
                var JFile = new File(historyPath + encodeURI("/labelList.txt"));
                var content = printLabelText.text + ";\n";
                writeFile(JFile, content);
            }
            if (!arrayContains(historyFile2,printLabelText2.text)) {
                var JFile = new File(historyPath + encodeURI("/labelList2.txt"));
                var content = printLabelText2.text + ";\n";
                writeFile(JFile, content);
            }
            if (!arrayContains(historyFile3,printLabelText3.text)) {
                var JFile = new File(historyPath + encodeURI("/labelList3.txt"));
                var content = printLabelText3.text + ";\n";
                writeFile(JFile, content);
            }
            var destFile = new File(historyPath + encodeURI("/destinationHistory.txt"))
            var content = destinationPath.text
            writeFile(destFile,content, "w");

        return w.close(); // CLOSE SCRIPT WINDOW WHEN FINISHED
        }

    // CANCEL BUTTON
    var cancelButton = groupButtons.add("button", undefined, "Cancel");
    cancelButton.alignment = "center";

    // FOOTER IMAGE
    createFooter(w, scriptDeets.version)
    w.show();
}

// INITIALIZE USER HISTORY
function readHistFile(histFile) {
    var historyFile = File(historyPath + histFile)
        historyFile.encoding = "utf-8";
        historyFile.open('r');
        historyFileText = historyFile.read();
        historyFileText = historyFileText.split(';\n')
        if (historyFileText.length > 1) {
            historyFileText.length = historyFileText.length-1
        }
        return historyFileText;
}

// WRITE TO .TXT FILES
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

// PRE-MAIN FUNCTION
function prepareToStart(label, filename) {
    if (autoPanel == true) {
        for (i = 0; i < doc1.pathItems.length; i++) {
            var pathItem = doc1.pathItems[i]
            if (pathItem.typename == "PathItem") {
                if (pathItem.strokeColor.typename == "SpotColor") {
                    panelPaths.push(pathItem);
                }
            }
        }
        // No PerfCutContour failsafe
        if (panelPaths.length<1) {
            alert("No PerfCutContour paths found.")
            return
        }
        for (j = 0; j < panelPaths.length; j++) {
            app.executeMenuCommand("deselectall");
            if (app.activeDocument.layers.length<2) {
                alert("Only one layer found. Move cut lines to top layer, artwork to bottom layer.")
                return
            }
            else {
                app.activeDocument.activeLayer = app.activeDocument.layers[app.activeDocument.layers.length-1];
                app.activeDocument.activeLayer.hasSelectedArtwork = true;
                panelPaths[j].selected = true;
                PreparePrintFile(label, filename, j+1)
            }
        }
    }
    else {
        PreparePrintFile(label, filename)
    }
}

// MAIN FUNCTION
function PreparePrintFile(label, filename, panelInteger) {

    // MAKE NEW FILE WITH SELECTION
    app.executeMenuCommand("copy");
    doc = app.documents.add(DocumentColorSpace.CMYK, (300*72), (300*72), 1);
    abs = doc.artboards[0]

    // PASTE SELECTION AND SET UP ARTBOARD
    app.executeMenuCommand("paste");

    // CREATE ARTBOARD WITH EXACT BLEED
    for (i = 0; i < doc.pathItems.length; i++) {
        var pathItem = doc.pathItems[i]
        if (pathItem.strokeColor.typename == "SpotColor") {
            cutbox = pathItem.geometricBounds;
                pathItem.left = (pathItem.left-1.8);
                pathItem.top = (pathItem.top+1.8);
                pathItem.width = (pathItem.width+3.6);
                pathItem.height = (pathItem.height+3.6);
            artbox = pathItem.geometricBounds;
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
    if (enablePrintLabel == true) {
        var printLabel = app.activeDocument.textFrames.add("");
            printLabel.contents = label + " " + panelInteger;
            printLabel.position = [(artbox[0]+2), (artbox[1]-2)]
            whiteCMYK = new CMYKColor();
                whiteCMYK.cyan = 0;
                whiteCMYK.magenta = 0;
                whiteCMYK.yellow = 0;
                whiteCMYK.black = 0;
            printLabel.textRange.fillColor = whiteCMYK;
    }

    saveAndClose(doc, destination, filename, panelInteger)

return;
}

// SAVE AND CLOSE FILE
function saveAndClose(doc, dest, name, panelInteger) {
    if (autoPanel == true) {
        fileNameSave = ("/" + name + " " + panelInteger + ".pdf")
    }
    else {
        fileNameSave = ("/" + name + ".pdf")
    }
    var saveName = new File(destination + fileNameSave);
    doc.saveAs(saveName, saveOpts);
    doc.close();
    return;
}

// Execute Main Function
showWindow();