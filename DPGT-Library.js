// INIT
var toolboxPath = getFolderPath($.fileName)
var assetPath = toolboxPath + "/assets/"

// IMAGES
var footerImagePath = assetPath + "footer.jpg"

// COLOR LIBRARY
var dpgPlum = [0.415, 0.239, 0.345];

// FUNCTIONS
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

// UI ELEMENTS
function createFooter(w,version) {
    var footerGroup = w.add("group {alignChildren: 'left', orientation: ’stack'}")
    var footerImage = footerGroup.add("image", undefined, File(footerImagePath));
    var versionText = footerGroup.add("statictext", undefined, version);
      versionText.alignment = "right";
      versionText.characters = 3;
}

// PDF FILE SAVE OPTIONS
var saveOpts = new PDFSaveOptions();
saveOpts.compatibility = PDFCompatibility.ACROBAT7;
saveOpts.generateThumbnails = false;
saveOpts.preserveEditability = false;