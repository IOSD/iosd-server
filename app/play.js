
var mongoose = require('mongoose');
var configDB = require('./../config/database.js');
mongoose.connect(configDB.url); // connect to our database
// console.log(data);
let Videos = require('./models/video');
var data = require('./../data.json');

for( let i = 0 ; i < data.length ; i++ ){

    let record = data[i] ;
    record.playlist = '5a3d0b1923c42f19688af8ae';
    // console.log(record) ;

    let video = new Videos(record);
    video.save().then(function (res) {
        console.log(res);
        console.log('Success');
    } , function (err) {
        console.log(err);
    })

}