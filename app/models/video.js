// load the things we need
var mongoose = require('mongoose');

var videoScheme = mongoose.Schema({
    link : String ,
    image : String,
    title : String ,
    playlist : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist'
    }
});

module.exports = mongoose.model('Video', videoScheme);
