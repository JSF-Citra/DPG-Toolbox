// Nugget Sandwich Placard Print File Prepper v1
// Written by Samoe (John Sam Fuchs)
// 7/23/21
// 
// 1. Creates required spot colors in document
// 2. Deletes extra data, ungroups, unclips, etc
// 3. Change items in document to correct colors
// 4. Draws a cut path around the artboard bounds
// 5. Extends artboard in all directions for bleed

// Init variables
var doc = app.activeDocument;
var height = doc.height
var width = doc.width
var abs = doc.artboards
///////////////////////

// Define Main Function
function PreparePrintFile() {

// 1. INITIAL ACTIONS

    // Remove spot colors if they already exist
    if (app.activeDocument.spots[0].name == 'PerfCutContour' ) {
        doc.spots[0].remove()
    }
    if (app.activeDocument.spots[0].name == 'Spot1' ) {
        doc.spots[0].remove()
    }

    // Create CUT LINE spot color
    var PerfCutSpot = doc.spots.add();
        var spotCMYK = new CMYKColor();
        spotCMYK.cyan = 100;
        spotCMYK.yellow = 100;
        PerfCutSpot.name = "PerfCutContour";
        PerfCutSpot.colorType = ColorModel.SPOT;
        PerfCutSpot.color = spotCMYK;
        var PerfCutContour = new SpotColor();
    PerfCutContour.spot = PerfCutSpot;

    // Create WHITE INK spot color
    var WhiteSpot = doc.spots.add();
        var spotWhite = new CMYKColor();
        spotWhite.cyan = 69;
        spotWhite.magenta = 14;
        WhiteSpot.name = "Spot1";
        WhiteSpot.colorType = ColorModel.SPOT;
        WhiteSpot.color = spotWhite;
        var Spot1 = new SpotColor();
    Spot1.spot = WhiteSpot;

    // Create BLACK swatch
    var blackSwatch = new CMYKColor();
        blackSwatch.black = 100;


// 2. DELETE UNNECCESSARY OBJECTS, CHANGE COLORS

    // Delete all invisible objects (clipping masks)
    var tmpBlank = app.activeDocument.pathItems.rectangle(0,0,10,10);
        tmpBlank.fillColor = NoColor
    app.executeMenuCommand("Find Fill Color menu item"); // Select same fill color
    app.executeMenuCommand("clear"); // Delete selection

    $.sleep (100);

    // Ungroup everything
    app.executeMenuCommand("selectall");
    app.executeMenuCommand("ungroup");
    app.executeMenuCommand("deselectall");

    $.sleep (100);

    // Remove black background
    var tmpBlock = app.activeDocument.pathItems.rectangle(0,0,10,10); // Create black square
    tmpBlock.fillColor = blackSwatch
    app.executeMenuCommand("Find Fill Color menu item"); // Select same fill color
    app.executeMenuCommand("clear"); // Delete selection
    app.executeMenuCommand("deselectall"); // Deselect all (just in case)

    // Convert circles to PerfCutContour
    for (i = 0; i < doc.pathItems.length; i++) {
        doc.pathItems[i].fillColor = PerfCutContour
    }

    // Change all text color to Spot1
    for (i = 0; i < doc.textFrames.length; i++) {
        doc.textFrames[i].textRange.characterAttributes.fillColor = Spot1
    }



// 3. CREATE CUT LINES, ADD ARTBOARD BLEED

    for (i = 0; i < abs.length; i++) {
        app.executeMenuCommand("deselectall");
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

// Execute Main Function
PreparePrintFile();