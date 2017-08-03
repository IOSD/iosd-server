var Jimp = require("jimp");

var fileName = 'member.jpg';
var outputFile = 'test.png' ;
// var output1File = 'test1.png' ;
var name = 'Dhruv Ramdev';
var year = '2016' ;
var loadedImage;

function topdf(fileName){
    doc.image(fileName, {
            fit: [500, 500],
            align: 'center',
            valign: 'center'
            });
        doc.end();
}

PDFDocument = require('pdfkit');
fs = require('fs');
doc = new PDFDocument() ;
doc.pipe(fs.createWriteStream('output.pdf'));

Jimp.read(fileName)
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
        loadedImage.print(font, 1850, 1040, year)
                    .write(outputFile);

        topdf(fileName);
    })
    .catch(function (err) {
        console.error(err);
    });

        
    //     Jimp.read(outputFile)
    //         .then(function (image) {
    //             loadedImage = image;
    //             return Jimp.loadFont('font-1/font.fnt');
    //         })
    //         .then(function (font) {
    //             loadedImage.print(font, 1850, 1040, year)
    //                     .write(output1File);
    //         })
    //         .catch(function (err) {
    //             console.error(err);
    //         });

    // })
    


// doc.image('test.png', 0, 15, width=300);

// doc.pipe(fs.createWriteStream('output.pdf'));
