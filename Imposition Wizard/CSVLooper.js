//@include "csvParser.js"

// TECHSTYLES PROCESSING BUDDY V1.0
// Written by Dave Blois and John Sam Fuchs
// Delta Print Group 2021
// 
// Usage:
// 1. Add 1up sticker files, sticker infotech files, and order CSV files to a folder
// 2. Run the script and select the folder you'd like to process
// 2a. Stickers will save to a folder within the input folder called "Sheets" unless you enable "Custom Output Location" and specify a location
// 3. Script may take a bit to run, but all sheets will be named and ready to print upon completion.


var scriptVersion = "v0.8"

// INIT DIRECTORY AND ASSETS
var scriptPath = $.fileName
var folderPath = scriptPath.slice(0,-12)
var headerImagePath = folderPath + '/assets/imposition_header.jpg';
var footerImagePath = folderPath + '/assets/imposition_footer.jpg';

//INIT VARIABLES
var infoTechCache = {}
var canvasWidth = 50
var canvasHeight = 25
var maxDocHeight = 36
var sheetsNeeded = 1
var dataLines = []
var sheetIndex = 1
var totalQuantity = 0
/////////////////////

function windowDisplay() {
  //Setting initial window variables
  var spacingOptions = [0, 0.0625, 0.125, 0.25, 0.5]
  var w = new Window("dialog", "Imposition Wizard");
  w.margins = [0, 0, 0, 0];
  
  // BACKGROUND COLOR
  w.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR,
    [0.415, 0.239, 0.345]);
  
  // HEADER IMAGE
  var headerImage = w.add("image", undefined, File(headerImagePath));

  // INITIALIZE PANEL
  var inputPanel = w.add('panel');
    inputPanel.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR,[.35, .35, .35]);
  
    //Adding the Source Folder Path Input
  var myInputGroupSource = inputPanel.add("group");
    myInputGroupSource.alignment = "center";
  myInputGroupSource.add("statictext", undefined, "Source: ")
  var sourcePath = myInputGroupSource.add("edittext", undefined, "")
  sourcePath.characters = 26;
  source = sourcePath.text
  var sourceButton = myInputGroupSource.add("button", undefined, "Browse")
  sourceButton.onClick = function() {
    var folderPath3 = Folder.selectDialog("Select the folder where you'd like to pull files from")
    if (folderPath3) {
      sourcePath.text = decodeURI(folderPath3.fsName);
      source = Folder(sourcePath.text);

      var allCSV = source.getFiles(/\.csv$/i)
      for (i = 0; i < allCSV.length; i++) {

        var textLines = CSV.reader.read_in_txt(allCSV[i]);
        dataLines.push(CSV.reader.textlines_to_data(textLines, ","))
        var listOrderNumber = dataLines[i].fields[0].field_0
        var listEntry = "Order " + listOrderNumber + " // Line Items: " + (textLines.length-1)
        myOrderList.add("item",listEntry)
      } 
    }
  }

  // INFO PANEL - EXTRA QUANTITY AND SPACING
  var myInputGroupInfo = inputPanel.add("group");
    myInputGroupInfo.alignment = "center";

  myInputGroupInfo.add("statictext", undefined, "Extra Stickers: ")
  var extraStickersText = myInputGroupInfo.add("edittext", undefined, "4")
    extraStickersText.characters = 2;
    extraPrints = extraStickersText.text

  myInputGroupInfo.add("statictext", undefined, "Spacing: ")
  var spacingSelection = myInputGroupInfo.add("dropdownlist", undefined, spacingOptions)
    spacingSelection.selection = 2;
    space = spacingSelection.selection

  myInputGroupInfo.add("statictext", undefined, "Max Sheet Length: ")
  var maxLengthText = myInputGroupInfo.add("edittext", undefined, "40")
    maxLengthText.characters = 2;
    maxDocHeight = maxLengthText.text
  
  // DESTINATION PANEL
  var inputPanel2 = w.add("panel");
    inputPanel2.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR,[.35, .35, .35]);
    inputPanel2.alignment = "center";

  var customDestCheck = inputPanel2.add ("radiobutton", undefined, "Custom Output Destination");
    customDestCheck.onClick = function() {
      if (myInputGroupDestination.enabled == true) {
        customDestCheck.value = false;
        myInputGroupDestination.enabled = false;
      }
      else {
        customDestCheck.value = true;
        myInputGroupDestination.enabled = true;
      }
    }

  // OUTPUT DESTINATION FOLDER SELECTION
  var myInputGroupDestination = inputPanel2.add("group");
    myInputGroupDestination.add("statictext", undefined, "Destination: ")
  var destinationPath = myInputGroupDestination.add("edittext", undefined, "")
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
  myInputGroupDestination.enabled = false; // Default value

  // ORDER LIST
  var myListGroup = w.add("group");
    myListGroup.alignment = "center";
  var myOrderList = myListGroup.add("listbox", undefined, [],{multiselect: true})
    myOrderList.minimumSize.width = 450;
    myOrderList.minimumSize.height = 130;

  //Adding the submit and cancel buttons
  var myButtonGroup = w.add("group");
    myButtonGroup.alignment = "center";
  var submitButton = myButtonGroup.add("button", undefined, "Submit");
    submitButton.onClick = function() {
      if (customDestCheck.value == !true) {
        destination = source + "/Sheets";
        var f = new Folder(destination);
        if (!f.exists)
            f.create();
      }
      FolderLooper(source, extraPrints, parseFloat(space.text));
      return w.close();
    }

  myButtonGroup.add("button", undefined, "Cancel");

      // FOOTER IMAGE
      var footerGroup = w.add("group {alignChildren: 'left', orientation: ’stack'}")
      var footerImage = footerGroup.add("image", undefined, File(footerImagePath));
      var versionText = footerGroup.add("statictext", undefined, scriptVersion);
        versionText.alignment = "right";
        versionText.characters = 3
        versionText.text = scriptVersion

  w.show();

  return;
}

function saveAndClose(doc, dest) {
  var saveName = new File(dest);
  saveOpts = new PDFSaveOptions();
  saveOpts.compatibility = PDFCompatibility.ACROBAT7;
  saveOpts.generateThumbnails = false;
  saveOpts.preserveEditability = false;
  doc.saveAs(saveName, saveOpts);
  doc.close();
}


// CREATE NEW FILE
function newFile(quantity, width, height, space, canvasWidth, canvasHeight, filePath, infoPath, dest, batch, columns, sheetCount, qtyPerSheet, rows, order, SKU) {

  var filePath = File(filePath);
  var infoPath = File(infoPath);

  // Loop for however many sheets we need
  for (var i = 0; i < sheetCount; i++) {
    if (i == 0) {
      var columns = Math.floor(points(canvasWidth) / (points(width) + points(space)));
      var docWidth = (columns * points(width + space))

      if (sheetsNeeded > 1) {
        var docHeight = (rows * points(height + space));
      }
     
      else {
        if (sheetsNeeded == 0) {
          return 
        } 
        // If this is the last sheet, crop the height to whatever is necessary
        var docHeight = points((Math.ceil((RemainingPrintQTY + 1) / columns) * (height + space)))
      }

      var doc = app.documents.add(
        DocumentColorSpace.CMYK,
        docWidth,
        docHeight,
        1
      );

      var xPosition = 0;
      var yPosition = docHeight;

      for (var i = 0; i < qtyPerSheet+1; i++) {
        if (i == 0) {
          var thePDF = doc.groupItems.createFromFile(infoPath); // ADD INFOTECH AS FIRST ITEM ON SHEET
        }
        else{
          var thePDF = doc.groupItems.createFromFile(filePath); // ADD PRINT FILES ON SHEET
        }

        if ( i % columns === 0 && i !== 0 ) { // IF WE REACH THE END OF THE ROW, MOVE TO NEXT ROW
          xPosition = 0;
          yPosition = yPosition - (points(height) + points(space));
        }

        thePDF.position = [xPosition, yPosition] // PLACE PDF POSITION
        xPosition = xPosition + points(width) + points(space);
      }
      
      // UPDATE VARIABLES AFTER CREATING SHEET
      RemainingPrintQTY = (RemainingPrintQTY - qtyPerSheet)
      dest = dest + "/" + order + "_" + SKU + "_" + width + "x" + height + "_Qty" + totalQuantity + "_Sheet " + sheetIndex + ".pdf";
      sheetsNeeded = (sheetsNeeded - 1)
      sheetIndex = (sheetIndex + 1)
      saveAndClose(doc, dest);

      // CREATE ANOTHER SHEET IF NEEDED
      if (sheetsNeeded > 0) {
        newFile(RemainingPrintQTY, width, height, space, canvasWidth, canvasHeight, filePath, infoPath, destination, batch, columns, sheetCount, qtyPerSheet, rows, order, SKU)
      }
      else {
        sheetIndex = 1
      }
    }
  }
}

// CONVERT INCHES TO POINTS
function points(inches) {
  return inches * 72;
}


function InfoCut(width, height, positionX, positionY, infoPath, batch) {
  // Adds the batch number to a list for easy look up later
  infoTechCache[batch] =  infoPath;
  var infoPath = File(infoPath);
  open(infoPath);
  var width = points(width) - points(0.2)
  var height = points(height) - points(0.2)
  var positionX = points(positionX) + points(0.1)
  var positionY = points(positionY) - points(0.1)

  var accDoc = app.activeDocument;

  // Remove spot color if already exists
  for (i = 0; i < accDoc.spots.length; i++) {
    if (app.activeDocument.spots[i].name == 'PerfCutContour' ) {
      accDoc.spots[i].remove()
    }
  }
  
  // CREATE PERFCUTCONTOUR SPOT COLOR
  var spotCMYK = new CMYKColor();
    spotCMYK.cyan = 100;
    spotCMYK.magenta = 0;
    spotCMYK.yellow = 100;
    spotCMYK.black = 0;
  var PerfCutSpot = accDoc.spots.add();
    PerfCutSpot.name = "PerfCutContour";
    PerfCutSpot.colorType = ColorModel.SPOT;
    PerfCutSpot.color = spotCMYK;
  var PerfCutContour = new SpotColor();
    PerfCutContour.spot = PerfCutSpot;

  // DRAW CUT LINE
  var newRect = accDoc.pathItems.rectangle(positionY, positionX, width, height)
    newRect.stroked = true;
    newRect.strokeWidth = 0.25;
    newRect.strokeColor = PerfCutContour
    newRect.fillColor = NoColor;

  accDoc.close( SaveOptions.SAVECHANGES );
  return infoTechCache;
}

function fileNameParser(filename) {
  var itemSpecs = {}
  // try {

    // FIND BATCH NUMBER IN FILE NAME
    var BatchNumber = String(filename).match(/Batch%20\d{5}/)
    var BatchNumber = String(BatchNumber).match(/(.{0,5})$/g)

    // Get Order and SKU numbers from CSV
    for (var i = 0; i < dataLines.length; i++) {
      for (var j = 0; j < dataLines[i].fields.length; j++) {
        var csvEntryData = dataLines[i].fields[j]
        if (BatchNumber == csvEntryData.field_3.slice(0, -4)) {
          itemSpecs.Order = csvEntryData.field_0;
          itemSpecs.SKU = csvEntryData.field_1; 
        }
      }
    }

    // FIND WIDTH, HEIGHT, AND QUANTITY IN FILE NAME
    var width = String(filename).match(/TS_(\d)/g)
    var width = String(width).match(/(\d)/g)
    var width = parseInt(width)
    var height = String(filename).match(/TS_(\d)x(\d)/g)
    var height = String(height).match(/x(\d)/g)
    var height = String(height).match(/(\d)/g)
    var height = parseInt(height)
    var quantity = String(filename).match(/(qty-)(\d{1,5})/g)
    var quantity = String(quantity).match(/(\d{1,5})/g)
    var quantity = parseInt(quantity)

    itemSpecs.Batch = BatchNumber;
    itemSpecs.Width = width;
    itemSpecs.Height = height;
    itemSpecs.Quantity = quantity;

    totalQuantity = quantity;

    return itemSpecs;
  } 
    // catch (e) {
    //   alert(filename + " Shows invalid file name")
    // } 
    // finally {}

// }


// LOOPER - EXECUTES THE MAIN FUNCTION FOR EVERY FILE IN THE FOLDER
function FolderLooper(srcFolder, extraPrints, space) {

  var allPrintPDFs = srcFolder.getFiles(/PRINT\.pdf$/i);
  var allInfoPDFs = srcFolder.getFiles(/TICKET\.pdf$/i);

  // RUN THE INFOCUT FUNCTION ON ALL INFOTECH FILES
  for (var i = 0; i < allInfoPDFs.length; i++) {
    var itemSpecs = fileNameParser(allInfoPDFs[i]);
    InfoCut(itemSpecs.Width, itemSpecs.Height, 0, itemSpecs.Height, allInfoPDFs[i], itemSpecs.Batch);
  }

  //OPEN AND PARSE ALL PRINT FILES
  for (var i = 0; i < allPrintPDFs.length; i++) {
    var itemSpecs = fileNameParser(allPrintPDFs[i]);
    var printQuantity = itemSpecs.Quantity + parseInt(extraPrints);

    var rows = Math.floor(maxDocHeight / (itemSpecs.Height + space))
    var columns = Math.floor(canvasWidth / (itemSpecs.Width + space))

    qtyPerSheet = (rows * columns)
    if (qtyPerSheet >= printQuantity) {
      qtyPerSheet = printQuantity
    }
    sheetsNeeded = Math.ceil(printQuantity / qtyPerSheet)
    RemainingPrintQTY = printQuantity

    newFile(printQuantity, itemSpecs.Width, itemSpecs.Height, space, canvasWidth, canvasHeight, allPrintPDFs[i], allInfoPDFs[i], destination, itemSpecs.Batch, columns, sheetsNeeded, qtyPerSheet, rows, itemSpecs.Order, itemSpecs.SKU)

  }
  return;
}

windowDisplay();
