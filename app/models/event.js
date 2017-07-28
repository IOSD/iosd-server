// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var eventScheme = mongoose.Schema({

    college : String ,
    college_name : String ,
    events : [{
        id: {type: String, default: 100},
        title: String,
        url: String,
        class: String,
        start: String,
        end: String
    }]

});


// create the model for Evetns and expose it to our app
module.exports = mongoose.model('Event', eventScheme);