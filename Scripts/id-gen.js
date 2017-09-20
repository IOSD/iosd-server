var mongoose = require('mongoose');
var configDB = require('./../config/database.js');
mongoose.connect(configDB.url); // connect to our database
var User = require('../app/models/user');
const fs = require('fs');
var Papa = require('papaparse');

var college = 'MAIT' ;





file = fs.readFileSync('load.csv');

Papa.parse(file.toString(), { delimiter:',', header : true, 
    complete: function(results) {
        // console.log(results);
        results.data.forEach(function(user) {

            // console.log(user);
            var newUser = new User();
            // var newUser = {}
            
            var username = `IOSD/${college}/2K17/${user.RECIEPT}`
            username = username.toLowerCase();
            newUser.username = username;
            newUser.email = user.EMAIL;
            newUser.password = newUser.generateHash(user.PHONE);
            
            newUser.name = user.NAME ;
            newUser.phone = user.PHONE ;
            newUser.college = college ;
            newUser.picture = 'placeholder.png' ;
            
            newUser.isAdmin = false;

            console.log(newUser)
            newUser.save(function (err) {
                if (err)
                    console.log(err);
                
                console.log('Success');
            });            
        });   
    }
});       

