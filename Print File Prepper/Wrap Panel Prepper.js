//@include "../DPGT-Library.js"

// Wrap Panel Print File Prepper v1.1
// Written by Samoe (John Sam Fuchs)
// 8/3/21
// 
// Takes selected elements, asks for a file name, creates print file
// Print file to include label, .25" bleed on every side, and a cut line

// WISHLIST
// - Automatically detect how many panels
// - Auto layout panels?
// - Process all panels at once
// --- Loop through all PerfCutContour paths
// --- Remember original file location


var scriptVersion = "v1.1"

// Init variables
var doc1 = app.activeDocument;
var height = 0
var width = 0
var abs = []
var box = [0, 0, 0, 0]
var cutbox = []
var scriptPath = getFolderPath($.fileName)
var folderPath = scriptPath.slice(0,-25)
var headerImagePath = folderPath + '/assets/wrapGod_header.jpg';
// var footerImagePath = folderPath + '/assets/wrapGod_footer.jpg';
///////////////////////

// Define Main Function
function PreparePrintFile(label) {

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
        printLabel.position = [(artbox[0]+1.9), (artbox[1]-1.9)]
        whiteCMYK = new CMYKColor();
            whiteCMYK.cyan = 0;
            whiteCMYK.magenta = 0;
            whiteCMYK.yellow = 0;
            whiteCMYK.black = 0;
        printLabel.textRange.fillColor = whiteCMYK;

return;
}

function showWindow() {
// Window Setup
var w = new Window("dialog", "Wrap Panel File Prepper");
    

    // SET MARGINS
    w.margins = [0, 0, 0, 0];
    // BACKGROUND COLOR
    w.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR,
        [0.415, 0.239, 0.345]);
    
    // HEADER IMAGE
    var headerImage = w.add("image", undefined, File(headerImagePath));

    // LABEL INPUT
    var myEditGroup = w.add("group")
    myEditGroup.add("statictext", undefined, "Print Label: ")
    var printLabelText = myEditGroup.add("edittext", undefined, "PANEL ")
        printLabelText.characters = 20

    // BUTTON PANEL
    var myButtonGroup = w.add("group")

    // SUBMIT BUTTON
    var submitButton = myButtonGroup.add("button", undefined, "OK");
        submitButton.alignment = "center";
        submitButton.onClick = function() {
            PreparePrintFile(printLabelText.text);
        }

    // destination = filePath.fsName.slice(0,-62);

    // CANCEL BUTTON
    var cancelButton = myButtonGroup.add("button", undefined, "Cancel");
    cancelButton.alignment = "center";

    // FOOTER IMAGE
    var footerImage = w.add("image", undefined, File(footerImagePath));

    w.show();
    return;
}

// Execute Main Function
showWindow();