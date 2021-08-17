// INIT
var toolboxPath = getFolderPath($.fileName)
var assetPath = toolboxPath + "/assets/"
var historyPath = assetPath + "/history/"

// IMAGES
var footerImagePath = assetPath + "footer.jpg"

// COLOR LIBRARY
var colors = {
    dpgPlum : [0.415, 0.239, 0.345],
    dpgBlue : [0.098, 0.153, 0.317]
}
var dpgPlum = [0.415, 0.239, 0.345];
var dpgBlue = [0.098, 0.153, 0.317];
var lightBlue = [0.376, 0.396, 0.49]
var dpgWhite = [0.886, 0.894, 0.918];

// PDF FILE SAVE OPTIONS
var saveOpts = new PDFSaveOptions();
saveOpts.compatibility = PDFCompatibility.ACROBAT7;
saveOpts.generateThumbnails = false;
saveOpts.preserveEditability = false;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// FUNCTIONS

// GET FOLDER THAT FILE IS IN
function getFolderPath(filePath) {
    var fileFolderArray = []
    fileFolderArray = filePath.split("\\")
    if (fileFolderArray.length == 1) {
        var forSlash = true
        fileFolderArray = filePath.split("/")
    }
    fileFolderArray.length = (fileFolderArray.length-1)
    fileFolder = ''
    for (i = 0; i < fileFolderArray.length; i++) {
        if (forSlash == true) {
            fileFolder = fileFolder + (fileFolderArray[i] + '/')
        }
        else {
            fileFolder = fileFolder + (fileFolderArray[i] + '\\')
        }
    }
    return fileFolder
}

// ARRAY CONTAINS ORDER NUMBER (SPECIFICALLY FOR IMPOSITION WIZARD)
function containsOrder(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i].fields[0].field_0 == obj.fields[0].field_0) {
            return true;
        }
    }
    return false;
}

// ARRAY CONTAINS OBJECT
function arrayContains(a, obj){
    for (var i = 0; i < a.length; i++) {
        if (a[i] == obj) {
            return true;
        }
    }
    return false;
}

// CONVERT INCHES TO POINTS
function points(inches) {
    return inches * 72;
  }

// UI ELEMENTS
function createFooter(w,version) {
    var footerGroup = w.add("group {alignChildren: 'left', orientation: ’stack'}")
    footerGroup.spacing = 0;
    var footerImage = footerGroup.add("image", undefined, File(footerImagePath));
    var versionText = footerGroup.add("statictext", undefined, version);
      versionText.alignment = "right";
      versionText.characters = 4;
    return footerGroup;
}

