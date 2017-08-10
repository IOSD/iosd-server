const TEMPLATE = 'templates/member.jpg';
var loadedImage;
var Jimp = require("jimp");
var PDFDocument = require('pdfkit');
var fs = require('fs');


function topng(name , year , type, callback) {

    Jimp.read(TEMPLATE)
        .then(function (image) {
            loadedImage = image;
            return Jimp.loadFont('font/name/font.fnt');
        })
        .then(function (font) {
            // console.log(font);
            loadedImage.print(font, 1330, 820, name)
            return loadedImage;
        })
        .then(function(loadedImage) {
            return Jimp.loadFont('font/year/font.fnt');
        })
        .then(function (font) {
            // console.log(font);
            loadedImage.print(font, 1850, 1040, year);
            if(type=='base64'){
                loadedImage.getBase64( loadedImage.getMIME(), function(err, data){
                    callback(data);
                });
            } else if(type=='file') {
                var fileName = `media/output.png` ;
                loadedImage.write(fileName);
                // console.log(fileName);
                callback(fileName);
            }
            
            // topdf(fileName);
        })
        .catch(function (err) {
            console.error(err);
        });
};

function topdf(view , callback){

    // console.log('view' , view);
    var output =  `media/output.pdf` ;
    // var output = "file:///" + process.cwd() + `/media/${view.name}-output.pdf` ;

    topng(view.name, view.year, 'file' , function(fileName){

        doc = new PDFDocument() ;
        doc.pipe(fs.createWriteStream(output));
        doc.image( fileName, {
            fit: [500, 500],
            align: 'center',
            valign: 'center'
        });
        doc.end();
        setTimeout(function(){
            callback({
                fileName: process.cwd() + '/' + output
            });
        } , 1000);        
        
    })
};


module.exports = {
    'topdf' : topdf ,
    'topng' : topng
}