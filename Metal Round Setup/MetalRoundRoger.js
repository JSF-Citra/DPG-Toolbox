//@include "../DPGT-Library.js"

// Metal Rounder v0.1
// Written by Samoe (John Sam Fuchs)
// 8/10/21

// SCRIPT DETAILS
var scriptDeets = {
  name : 'Metal Rounder',
  version : 'v0.1',
}

// INIT DIRECTORY AND ASSETS
var scriptPath = $.fileName
// var folderPath = scriptPath.slice(0,-18)
// var folderPath = getFolderPath($.fileName);
var headerImagePath = assetPath + 'header_metalRounder.jpg';
var templateFilePath = assetPath + 'template_metalRounder.pdf';
var bottomRowImagePath = assetPath + 'tiler_rowBG.jpg';
var templateFile = File(templateFilePath);

// STYLE VARIABLES
var bgColor = colors.dpgPlum;

// INIT VARIABLES
var destination = ''
var filePath = ''
var fileFolder = ''
var quantity = 16
var orderNumber = 00000
var skuNumber = 00000
var itemInfo = {
    order : 00000,
    sku : 00000,
    qty : 4,
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
  [-314, -11],
  [550, -11],
  [-314 , -876],
  [550 , -876],
]
// END INIT VARIABLES
/////////////////////

function windowDisplay() {

    // INITIALIZE WINDOW
    var w = new Window("dialog", scriptDeets.name, undefined,);
    w.margins = [0, 0, 0, 0];
    w.spacing = 16;

    // BACKGROUND COLOR
    w.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR,bgColor);
    
    // HEADER IMAGE
    var headerImage = w.add("image", undefined, File(headerImagePath));

    // COLUMN 1
    var column1 = w.add("group");
      column1.orientation = "row";
      var masterGroup = column1.add("group");
        masterGroup.orientation = "column";
        masterGroup.spacing = 12;
      var masterGroup2 = column1.add("group");
        masterGroup2.orientation = "column";
        masterGroup2.spacing = 12;

    // // INSTRUCTIONS
    // var myInfoGroupInfo = masterGroup.add("group");
    // var instr1 = myInfoGroupInfo.add("statictext", undefined, "1. Type in the Order, SKU number, and desired Quantity")
    //   instr1.alignment = "left"
    // var instr2 = myInfoGroupInfo.add("statictext", undefined, "2. Click BROWSE to select the tile print file")
    //   instr2.alignment = "left"
    // var instr3 = myInfoGroupInfo.add("statictext", undefined, "3. Click ADD TO QUEUE")
    //   instr3.alignment = "left"
    // var instr4 = myInfoGroupInfo.add("statictext", undefined, "4. Repeat the above steps until you are ready to process the entire batch")
    //   instr4.alignment = "left"
    // var instr5 = myInfoGroupInfo.add("statictext", undefined, "5. Click Submit and WAIT until all the files have processed!")
    //   instr5.alignment = "left"

    // myInfoGroupInfo.alignment = "center";
    // myInfoGroupInfo.orientation = "column";

    // INITIALIZE PANEL
    var inputPanel = masterGroup.add('panel');
    
    inputPanel.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR,[.35, .35, .35]);


    // ORDER NUMBER INPUT
    var myInputGroupInfo = inputPanel.add("group");
      myInputGroupInfo.orientation = "column";
      myInputGroupInfo.alignChildren = "fill";
      var orderGroup = myInputGroupInfo.add("group");
          var orderStaticText = orderGroup.add("statictext", undefined, "Order: ")
            orderStaticText.characters = 4
          var group = orderGroup.add ("group {alignChildren: 'left', orientation: ’stack'}");
          orderList = group.add ("dropdownlist", undefined, ordersTyped);
          var orderNumberText = group.add ("edittext");
          orderList.preferredSize.width = 100; orderList.preferredSize.height = 24;
          orderNumberText.preferredSize.width = 80; orderNumberText.preferredSize.height = 24;
          orderList.onChange = function () {
            orderNumberText.text = orderList.selection.text;
            orderNumberText.active = true;
          }

    // SKU NUMBER INPUT
    var skuGroup = myInputGroupInfo.add("group");
          skuGroup.alignment = "fill";
        var skuStaticText = skuGroup.add("statictext", undefined, "SKU: ")
          skuStaticText.characters = 4;
      var skuNumberText = skuGroup.add("edittext", undefined, "")
          skuNumberText.characters = 9;                  
          skuNumber = skuNumberText.text

    // QUANTITY INPUT
    var qtyGroup = myInputGroupInfo.add("group");
      qtyGroup.alignment = "fill";
    qtyGroup.add("statictext", undefined, "Quantity: ")
    var QuantityText = qtyGroup.add("edittext", undefined, "16")
        QuantityText.characters = 4;                  
        quantity = QuantityText.text
      
    // FILE BROWSER INPUT
    var myInputGroupSource = inputPanel.add("group");
      myInputGroupSource.add("statictext", undefined, "Print File: ")
      var sourceButton = myInputGroupSource.add("button", undefined, "Browse")
          sourceButton.onClick = function() {
      var filePathSelection = File.openDialog("Select the metal round file you'd like to print", '*.pdf')
      if (filePathSelection) {
        sourcePath.text = decodeURI(filePathSelection.fsName);
        source = Folder(sourcePath.text);
      filePath = filePathSelection
      fileFolder = getFolderPath(sourcePath.text)
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
    var myButtonGroup1 = masterGroup.add("group");
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
      myList.add("item", "Order: " + itemInfo.order + " | SKU: " + itemInfo.sku + " | QTY: " + itemInfo.qty);
      orderNumberText.text = ""
      }

    // LIST BOX
    var myListBox = masterGroup2.add("group");
    myListBox.alignment = "center";
      var myList = myListBox.add ("listbox", undefined, [],{multiselect: true});
      myList.minimumSize.width = 232;
      myList.minimumSize.height = 154;
      myList.onChange = function() {
        if (myList.selection !== null) {
          deleteButton.enabled = true;
        }
        else {
          deleteButton.enabled = false;
        }
      }
      

    //DELETE SELECTION BUTTON
    var deleteButton = masterGroup2.add("button", undefined, "Delete");
    deleteButton.enabled = false;
    deleteButton.onClick = function() {
      // remember which line is selected
      if (myList.selection === null) {}
      else {
      deleteButton.enabled = false;
      for (var i = myList.selection.length-1; i > -1; i--)
        myList.remove (myList.selection[i]);
      }
    }

    w.add("image",undefined,assetPath + 'divider.jpg')

    // BOTTOM ROW
    var myButtonGroup = w.add("group");
    myButtonGroup.spacing = 10;
    myButtonGroup.alignment = "center";

      // TOGGLE MULTI-SHEET VS SINGLE SHEET
      var toggleMultiSheetGroup = myButtonGroup.add("group {orientation:'stack'}");
      var toggleMultiBG = toggleMultiSheetGroup.add("image", undefined, assetPath + 'rowBG_smaller.jpg')
      var toggleMultiSheet = toggleMultiSheetGroup.add("checkbox", undefined, "Create Multiple Sheet Files");
        toggleMultiSheet.value = false;
        
      // SUBMIT BUTTON
      var submitButton = myButtonGroup.add("button", undefined, "Submit");
      submitButton.alignment = "right";
      submitButton.onClick = function() {
        if (toggleMultiSheet.value == true) {
          createMultipleFiles = true
        }
        destination = fileFolder + "/Sheets";
        var f = new Folder(destination);
        if (!f.exists)
            f.create();

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
    

      var sourcePathGroup = w.add("group {alignChildren: 'center', orientation: 'stack'}");
        var sourcePathBG = sourcePathGroup.add("image", undefined, File(bottomRowImagePath))
        sourcePathGroup.alignment = "center";
      var sourcePath = sourcePathGroup.add("statictext", undefined, "Source path")
      sourcePath.characters = 39;
      sourcePath.text.alignment = "center";
      source = sourcePath.text;

    // FOOTER IMAGE
    createFooter(w,scriptDeets.version);
    
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
      var thePDF = doc.placedItems.add()
      thePDF.file = File(filePath);
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

      if (loopIndex >= 4) {
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
    remainder = Math.ceil(remainingQty % 4)
    sheetsNeeded = Math.floor(remainingQty / 4)
    if (sheetsNeeded == 0) {
      sheetsNeeded = 1
    }

    var filePath = File(filePath);
    open(templateFile);

    var doc = app.activeDocument;
    // Reset position index
    var loopIndex = 0

    for (i = 0; i < remainingQty; i++) {
      var thePDF = doc.placedItems.add()
      thePDF.file = File(filePath);
      thePDF.position = itemPositions[i];
      loopIndex++
      // Break the loop after 8 tiles
      if (loopIndex >= 4) {
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
          if (remainingQty < 4) {
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
    var fileNameSave = "/ROUNDS_" + order + "_" + sku + "_" + sheetIndex + '.pdf'
  }
  else {

    if (sheetsNeeded == 1) {var sheets = ' SHEET.pdf'}
    else {var sheets = ' SHEETS.pdf'}

    var fileNameSave = "/ROUNDS_" + order + "_" + sku + "_" + "PRINT " + sheetsNeeded + sheets
  }
  if (remainderSheet == true) {
    var fileNameSave = "/ROUNDS_" + order + sku + "_EXTRAS_" + sheetIndex + ".pdf"
  }
  var saveName = new File(destination + fileNameSave);
  doc.saveAs(saveName, saveOpts);
  doc.close();
}

// BEGIN EXECUTE
windowDisplay();