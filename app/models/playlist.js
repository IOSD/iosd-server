var mongoose = require('mongoose');

var playlistScheme = mongoose.Schema({
    title : String ,
    image : String
});

module.exports = mongoose.model('Playlist', playlistScheme);
