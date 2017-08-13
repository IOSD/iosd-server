// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var eventScheme = mongoose.Schema({

    name : String ,
    author : String,
    year : String ,
    description : String ,
    image : String ,
    link : String , 
    category : String , 
    color : String
});

// create the model for Evetns and expose it to our app
module.exports = mongoose.model('Book', eventScheme);
