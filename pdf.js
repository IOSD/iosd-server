var fs = require('fs');
var pdf = require('html-pdf');
var Mustache = require('mustache');
// var html = fs.readFileSync('./invoice.html.html', 'utf8');
var options = {
	base: "file:///" + __dirname + '/member.resized.jpg'
};

console.log("file:///" + __dirname + "/member.resized.jpg")

var generatePdf = function(view , callback) {
	var output = Mustache.render(fs.readFileSync( __dirname + '/invoice.html.html', 'utf8'), view);

	// console.log("file:///" + __dirname + '/template.jpg');
	console.log(__dirname + '/invoice.html.html');
	var fileName = `./static/${view.name}.pdf` ;
	pdf.create(output, options).toFile(fileName , function(err, res) {
		if (err) return console.log(err);
		console.log(res);
		callback(res);
	});
}

module.exports = {
	generatePdf : generatePdf
}