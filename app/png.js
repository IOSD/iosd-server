const TEMPLATE = 'templates/member.jpg';
var loadedImage;
var Jimp = require("jimp");
var PDFDocument = require('pdfkit');
var fs = require('fs');


function topdf(fileName){
    doc = new PDFDocument() ;
    doc.pipe(fs.createWriteStream('output.pdf'));
    doc.image(fileName, {
            fit: [500, 500],
            align: 'center',
            valign: 'center'
            });
        doc.end();
}

function topng(name , year , callback) {

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
            loadedImage.getBase64( loadedImage.getMIME(), function(err, data){
                callback(data);
            } );
            // topdf(fileName);
        })
        .catch(function (err) {
            console.error(err);
        });
};

module.exports = {
    'topdf' : topdf ,
    'topng' : topng
}