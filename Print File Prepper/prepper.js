// DPG Print File Prepper v0.02
// Written by Samoe (John Sam Fuchs)
// 7/7/21
// 
// 1. Creates a spot color called PerfCutContour in the document
// 2. Creates a rectangle the same size as the artboard
// 3. Expands artboard 0.25" in all directions

// Init variables
var doc = app.activeDocument;
var height = doc.height
var width = doc.width
var abs = doc.artboards
///////////////////////

// Main Function
function PreparePrintFile() {
    // Remove spot color if already exists
    if (app.activeDocument.spots[0].name == 'PerfCutContour' ) {
        doc.spots[0].remove()
    }

    // Create spot color
    var PerfCutSpot = doc.spots.add();
        var spotCMYK = new CMYKColor();
        spotCMYK.cyan = 100;
        spotCMYK.yellow = 100;
        PerfCutSpot.name = "PerfCutContour";
        PerfCutSpot.colorType = ColorModel.SPOT;
        PerfCutSpot.color = spotCMYK;
        var PerfCutContour = new SpotColor();
    PerfCutContour.spot = PerfCutSpot;

    // For each artboard, create cut line and expand artboard bounds 0.25" in each direction
    for (i = 0; i < abs.length; i++) {

        var r = abs[i].artboardRect;
        
        // Create cut line
        var cutLine = doc.pathItems.rectangle(0, 0, width, height);
        cutLine.position = [r[0], r[1]]
        cutLine.stroked = true;
        cutLine.strokeWidth = 1;
        cutLine.strokeColor = PerfCutContour
        cutLine.fillColor = NoColor;

        // Adjust artboard bounds
        var box = [r[0]-18, r[1]+18, r[2]+18, r[3]-18];
        abs[i].artboardRect = box;
    }
}

// Execute the script
PreparePrintFile();