//@include "csvParser.js"
    
    var main = function(){                
    var textLines = CSV.reader.read_in_txt();        
    if(textLines !== null){            
        // locdata.markers = lines_to_markers(locdata.textLines);            
        var res = CSV.reader.textlines_to_data(textLines,",");          
         alert(res.toSource());                
        alert();
        }};
        
main();
