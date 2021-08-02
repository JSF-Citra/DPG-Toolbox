// Tiler the Creator v1.4
// Written by Samoe (John Sam Fuchs)
// 7/29/21
// 
// 1. User finds a tile print file (4" x 4" PDF)
// 2. User defines parameters like order, sku, and quantity
// 3. User adds file to queue for processing
// 4. Once finished queueing, user submits queue
// 5. Script lays out sheets needed based on 8 tiles per sheet
// 6. Script takes remainders of all sheets and lays out optimized sheets
//
// UPDATES IN V1.4
// - User can now delete objects from the runlist
// - User can now select previous order numbers from dropdown menu to improve efficiency
// - Default quantity set to 25
// - Visual tweaks and upgrades

// SCRIPT VERSION
var scriptVersion = "v1.5"

// INIT DIRECTORY AND ASSETS
var scriptPath = $.fileName
var folderPath = scriptPath.slice(0,-18)
var templateFilePath = folderPath + '/assets/TILES_TEMPLATE.pdf';
var headerImagePath = folderPath + '/assets/tiler_header.jpg';
var footerImagePath = folderPath + '/assets/tiler_footer.jpg';
var templateFile = File(templateFilePath);

// INIT VARIABLES
var destination = ''
var filePath = ''
var quantity = 25
var orderNumber = 00000
var skuNumber = 00000
var itemInfo = {
    order : 00000,
    sku : 00000,
    qty : 8,
    file : ""
  }
var itemArray = [];
var createMultipleFiles = false;
var sheetsNeeded = 1
var remainderArray = [];
var remainderSheet = false;
var remainder = 0
var ordersTyped = [];
var orderList

// Tile positions are hard-coded. Change in the future to dynamically read positions of objects.
var itemPositions = [
  [67, 438],
  [391, 438],
  [715, 438],
  [1039, 438],
  [67, 114],
  [391, 114],
  [715, 114],
  [1039, 114],
]
// END INIT VARIABLES
/////////////////////

function windowDisplay() {

    // INITIALIZE WINDOW
    var w = new Window("dialog", "Tiler, The Creator");
    w.margins = [0, 0, 0, 0];
  
    // BACKGROUND COLOR
    w.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR,
      [0.415, 0.239, 0.345]);
    
    // HEADER IMAGE
    var headerImage = w.add("image", undefined, File(headerImagePath));

    // INSTRUCTIONS
    var myInfoGroupInfo = w.add("group");
    var instr1 = myInfoGroupInfo.add("statictext", undefined, "1. Type in the Order, SKU number, and desired Quantity")
      instr1.alignment = "left"
    var instr2 = myInfoGroupInfo.add("statictext", undefined, "2. Click BROWSE to select the tile print file")
      instr2.alignment = "left"
    var instr3 = myInfoGroupInfo.add("statictext", undefined, "3. Click ADD TO QUEUE")
      instr3.alignment = "left"
    var instr4 = myInfoGroupInfo.add("statictext", undefined, "4. Repeat the above steps until you are ready to process the entire batch")
      instr4.alignment = "left"
    var instr5 = myInfoGroupInfo.add("statictext", undefined, "5. Click Submit and WAIT until all the files have processed!")
      instr5.alignment = "left"

    myInfoGroupInfo.alignment = "center";
    myInfoGroupInfo.orientation = "column";

    // INITIALIZE PANEL
    var inputPanel = w.add('panel');
    inputPanel.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR,[.35, .35, .35]);


    // ORDER NUMBER INPUT
    var myInputGroupInfo = inputPanel.add("group");
      myInputGroupInfo.add("statictext", undefined, "Order: ")
      var group = myInputGroupInfo.add ("group {alignChildren: 'left', orientation: ’stack'}");
      orderList = group.add ("dropdownlist", undefined, ordersTyped);
      var orderNumberText = group.add ("edittext");
      orderList.preferredSize.width = 100; orderList.preferredSize.height = 24;
      orderNumberText.preferredSize.width = 80; orderNumberText.preferredSize.height = 24;
      orderList.onChange = function () {
         orderNumberText.text = orderList.selection.text;
         orderNumberText.active = true;
      }

    // SKU NUMBER INPUT
    myInputGroupInfo.add("statictext", undefined, "SKU: ")
      var skuNumberText = myInputGroupInfo.add("edittext", undefined, "")
          skuNumberText.characters = 8;                  
          skuNumber = skuNumberText.text

    // QUANTITY INPUT
    myInputGroupInfo.add("statictext", undefined, "Quantity: ")
      var QuantityText = myInputGroupInfo.add("edittext", undefined, "25")
          QuantityText.characters = 4;                  
          quantity = QuantityText.text
      
    // FILE BROWSER INPUT
    var myInputGroupSource = inputPanel.add("group");
      myInputGroupSource.add("statictext", undefined, "Print File: ")
      var sourcePath = myInputGroupSource.add("edittext", undefined, "Source path")
          sourcePath.characters = 25;
          source = sourcePath.text
      var sourceButton = myInputGroupSource.add("button", undefined, "Browse")
          sourceButton.onClick = function() {
      var filePathSelection = File.openDialog("Select the tile file you'd like to print", '*.pdf')
      if (filePathSelection) {
        sourcePath.text = decodeURI(filePathSelection.fsName);
        source = Folder(sourcePath.text);
      filePath = filePathSelection
      }
    }
  
    // REMOVED CODE FOR CUSTOM DESTINATION FOLDER - LEFT HERE JUST IN CASE

    // var myInputGroupDestination = w.add("group");
  
    // myInputGroupDestination.add("statictext", undefined, "Destination: ")
    // var destinationPath = myInputGroupDestination.add("edittext", undefined, "Destination path")
    // destinationPath.characters = 40;
    // destination = destinationPath.text
    // var destinationButton = myInputGroupDestination.add("button", undefined, "Browse")
    // destinationButton.onClick = function() {
    //   var folderPath3 = Folder.selectDialog("Select the folder where you'd like your generated sheets to save")
    //   if (folderPath3) {
    //     destinationPath.text = decodeURI(folderPath3.fsName);
    //     destination = Folder(destinationPath.text);
    //   }
    // }
  
    // ADD TO QUEUE BUTTON
    var myButtonGroup1 = w.add("group");
    var addToListButton = myButtonGroup1.add("button", undefined, "Add to Queue", {name: "ok"});
      addToListButton.onClick = function() {
        itemInfo = {
          order: orderNumberText.text,
          sku: skuNumberText.text, 
          qty: QuantityText.text, 
          file: filePath
        }
      itemArray[itemArray.length] = itemInfo
      orderList.add('item', itemInfo.order);
      myList.add("item", "Order: " + itemInfo.order + " // SKU: " + itemInfo.sku + " // QTY: " + itemInfo.qty);
      orderNumberText.text = ""
      }

    //DELETE SELECTION BUTTON
    var deleteButton = myButtonGroup1.add("button", undefined, "Delete");
      deleteButton.onClick = function() {
        // remember which line is selected
        if (myList.selection === null) {}
        else {
        var sel = myList.selection[0].index;
        for (var i = myList.selection.length-1; i > -1; i--)
          myList.remove (myList.selection[i]);
        }
      }

    // LIST BOX
    var myListBox = w.add("group");
    myListBox.alignment = "center";
      var myList = myListBox.add ("listbox", undefined, [],{multiselect: true});
      myList.minimumSize.width = 440;
      myList.minimumSize.height = 180;

    // BOTTOM ROW
    var myButtonGroup = w.add("group");
    myButtonGroup.alignment = "center";

      // TOGGLE MULTI-SHEET VS SINGLE SHEET
      var toggleMultiSheet = myButtonGroup.add("checkbox", undefined, "Create Multiple Sheet Files");
        toggleMultiSheet.value = false;
        
      // SUBMIT BUTTON
      var submitButton = myButtonGroup.add("button", undefined, "Submit");
      submitButton.alignment = "right";
      submitButton.onClick = function() {
        if (toggleMultiSheet.value == true) {
          createMultipleFiles = true
        }
        destination = filePath.fsName.slice(0,-62);

        for (k = 0; k < itemArray.length; k++) {
          itemInfo = itemArray[k]
          sheetIndex = 1
          CreateJig(itemInfo);
        }
        if (remainderArray.length > 0) {
          remainderSheet = true;
          sheetIndex = 1
          createJigRemainder();
        }
        return w.close();
    }
  
      // CANCEL BUTTON
      var cancelButton = myButtonGroup.add("button", undefined, "Cancel");
        cancelButton.alignment = "right";
    
    // FOOTER IMAGE
    var footerGroup = w.add("group {alignChildren: 'left', orientation: ’stack'}")
    var footerImage = footerGroup.add("image", undefined, File(footerImagePath));
    var versionText = footerGroup.add("statictext", undefined, scriptVersion);
      versionText.alignment = "right";
      versionText.text = scriptVersion + " '"
    w.show();
    return;
}

// CREATE EXTRA SHEETS AT THE END
function createJigRemainder () {
  open (templateFile);

  var doc = app.activeDocument;
  var loopIndex = 0

  var remainderOrders = [];

  for (g = 0; g < remainderArray.length; g++) {
      var filePath = remainderArray[g].file
      var thePDF = doc.groupItems.createFromFile(filePath);
      thePDF.position = itemPositions[g];
      loopIndex = loopIndex + 1
      var sku2 = remainderArray[g].sku

      // Store Order Number for Naming Sheet at End
      var contains = false

      for (i = 0; i < remainderOrders.length; i++) {
        if (remainderArray[g].order == remainderOrders[i]) {
          contains = true
        }
      }

      if (contains == false) {
        remainderOrders[remainderOrders.length] = remainderArray[g].order
      }

      if (loopIndex >= 8) {
        break;
      }
    }

    remainderArray.splice(0,(g+1));

  if (remainderArray.length > 0) {
    saveAndClose(doc, destination, remainderOrders, "", sheetIndex)
    sheetIndex++
    createJigRemainder();
  }
  else {
    if (remainderOrders.length == 1) {sku2 = '_' + sku2}
    else {sku2 = ""}
    saveAndClose(doc, destination, remainderOrders, sku2, sheetIndex)
  }
}

// MAIN FUNCTION - CREATE SHEETS
function CreateJig(itemInformant) {
    var filePath = itemInformant.file
    var remainingQty = itemInformant.qty
    var order = itemInformant.order
    var sku = itemInformant.sku
    remainder = Math.ceil(remainingQty % 8)
    sheetsNeeded = Math.floor(remainingQty / 8)
    if (sheetsNeeded == 0) {
      sheetsNeeded = 1
    }

    var filePath = File(filePath);
    open(templateFile);

    var doc = app.activeDocument;
    // Reset position index
    var loopIndex = 0

    for (i = 0; i < remainingQty; i++) {
      var thePDF = doc.groupItems.createFromFile(filePath);
      thePDF.position = itemPositions[i];
      loopIndex++
      // Break the loop after 8 tiles
      if (loopIndex >= 8) {
        break;
      }
    }

    // Substract the tiles we just put on a sheet from the total qty
    remainingQty = remainingQty - loopIndex;
    itemInfo.qty = remainingQty

    if (remainingQty >= 1) {
      saveAndClose(doc, destination, order, sku, sheetIndex);
      sheetIndex++;
      if (createMultipleFiles == true) {
          if (remainingQty < 8) {
            if (itemArray.length == 1) {
              CreateJig(itemInfo);
            }
            else {
              for (i = 0; i < remainder; i++) {
                remainderArray[remainderArray.length] = itemInfo
              }
            }
          }
          else {
            CreateJig(itemInfo);
          }
      }
      else {
        if (remainder > 0){
          for (i = 0; i < remainder; i++) {
            remainderArray[remainderArray.length] = itemInfo
          }
        }
      }
    }
    else {
      saveAndClose(doc, destination, order, sku, sheetIndex)
      sheetIndex++
    }
}

// SET ITEM OBJECT DETAILS
function itemParser (item) {
  itemInfo = {
    order: orderNumber,
    sku: skuNumber,
    qty: quantity,
    file: filePath
  }
}

// SAVE SHEET AND CLOSE FILE
function saveAndClose(doc, dest, order, sku, sheetIndex) {
  // Dynamically name the output file based on user-inputted info and sheet number
  if (createMultipleFiles == true) {
    var destiny = "/TILES_" + order + "_" + sku + "_" + sheetIndex + '.pdf'
  }
  else {

    if (sheetsNeeded == 1) {var sheets = ' SHEET.pdf'}
    else {var sheets = ' SHEETS.pdf'}

    var destiny = "/TILES_" + order + "_" + sku + "_" + "PRINT " + sheetsNeeded + sheets
  }
  if (remainderSheet == true) {
    var destiny = "/TILES_" + order + sku + "_EXTRAS_" + sheetIndex + ".pdf"
  }
  var saveName = new File(dest + destiny);
  saveOpts = new PDFSaveOptions();
  saveOpts.compatibility = PDFCompatibility.ACROBAT7;
  saveOpts.generateThumbnails = false;
  saveOpts.preserveEditability = false;
  doc.saveAs(saveName, saveOpts);
  doc.close();
}

// BEGIN EXECUTE
windowDisplay();