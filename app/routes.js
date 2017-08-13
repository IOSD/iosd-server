var path = require('path');
var eventsdata = require('./demodata');
var Event = require('./models/event');
var Books = require('./models/book');
// var pdfGen = require('./../pdf.js');
var idcard = require('./png');
var fs = require('fs');

module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    
    app.get('/admin', isLoggedIn , function(req, res) {
        res.render('admin' , {user : req.user} );
    });

    

    // Events Routes
    
    app.get('/events' ,isLoggedIn ,  function(req, res) {
        res.render('events' , {user : req.user});
    });

    app.get('/events-admin' , function(req, res) {
        res.render('event-admin');
    });

    app.post('/events-admin' , function(req, res) {
        console.log(req.body);
        // require('./enterdata');
        Event.update( { college : req.body.college }, req.body, { upsert : true }).then(function(doc) {
            res.json(doc);
        } , function(err) {
            res.status(400).send(err);
        });
        var event = new Event(req.body);
        event.save().then(function(doc) {
            res.json(doc);
        } , function(err) {
            res.status(400).send(err);
        })
    });

    app.get('/getevents/:college' , function(req, res) {
        var college = req.params.college
        console.log(college);
        if(college == 'search'){
            Event.find().then(function(data) {
                di = {}
                // console.log(data);
                data.forEach(function(item) {
                    di[item.college] = item.college_name
                })
                res.json(di);
            } , function(err) {
                res.status(400).send(err);
            });
        } else { 
            Event.find({college: college}).then(function(data) {
                console.log('Found')
                // console.log(data[0]);
                console.log(typeof data[0] , 'type')
                var di = {
                    'college' : data[0].college ,
                    'college_name' : data[0].college_name ,
                    'success' : 1 ,
                    'events' : data[0].events ,
                    'result' : data[0].events ,
                }
                console.log('di' , di)
                // console.log(JSON.stringigy(di , null ,4))
                res.json(di);
            } , function(err) {
                console.log('Error')
                res.status(400).send(err);
            })

        }
    });

    app.get('/library' , isLoggedIn , function(req ,res){
        Books.find().then(function(data) {    
            console.log(data);
            // console.log({user : req.user , books : data});
            var category  = []
            data.forEach((book) => {
                console.log('book');
                if ( category.indexOf(book.category) == -1 ) {
                    category.push(book.category);
                }
            })
            console.log(category);
            res.render('library', {user : req.user , books : data , categories : category});
        } , function(err) {
            console.log('Err');
            console.log(err);
        });
        // res.render('library', {user: req.user});
    });

    app.get('/library-admin'  , isLoggedIn  , function(req ,res){
        Books.find().then(function(data) {    
            console.log(data);
            console.log({user : req.user , books : data});
            res.render('libraryAdmin', {user : req.user , books : data});
        } , function(err) {
            console.log('Err');
            console.log(err);
        });
        // res.render('libraryAdmin', {user : req.user , });
    });

    app.get('/books/delete/:id' , isLoggedIn ,function(req , res) {
        var id = req.params.id;
        Books.find({ _id:id }).remove().exec();
        console.log(id);
        res.send('ok');
    })

    app.get('/books/:id' , isLoggedIn ,function(req , res) {
        var id = req.params.id;
        console.log(id);
        Books.find({ _id:id }).then(function(data){
            res.render('Book' , { 'book' : data[0] , user : req.user})
        } , function (err) {

        });
    })

    app.post('/books/:id' , isLoggedIn ,function(req , res) {
        var id = req.params.id;
        console.log(id);
        console.log(req.body);
        Books.update({ _id: id }, req.body ).then(function(data){
            res.send(data);
        } , function (err) {
            console.error(err);
        });
    })


    app.get('/addbook'  , isLoggedIn ,function(req ,res){
        res.render('newBook', {user : req.user});
    });
    
    app.post('/addbook'  , function(req ,res){
        // res
        console.log(req.body);
        Books.create(req.body , function(err  , result) {
            if (err) {
                console.log(err) ;
                return 
            } 
            console.log(result);
            res.send(result);
        })
    });

    // PROFILE SECTION =========================
    app.get('/dashboard', isLoggedIn, function(req, res) {
        idcard.topng('DhruvRamdev' , '2016' ,'base64' ,function(data){
            // console.log(data);
            res.render('dashboard', {
                user : req.user , 
                idcard : data
            });
        });   
    });

    app.post('/profile/pdf',function(req,res){
        var view = req.body ;
        // console.log(view);
        idcard.topdf(view , function(response){
            console.log(response.fileName);
            fs.readFile(response.fileName , function(err , data){
                res.setHeader('Content-type', 'application/pdf');
                console.log(data.toString('base64'));
                res.end(data.toString('base64') , 'binary')
            });
            // var filename = "idcard.pdf"; 
            // Be careful of special characters

            // filename = encodeURIComponent(filename);
            // Ideally this should strip them

            // res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
            

            // stream.pipe(res);
            // console.log(response);
            // console.log(process.cwd());
            // var file = fs.createReadStream(process.cwd()+ '/' + response.fileName);
            // var stat = fs.statSync(process.cwd()+ '/' + response.fileName);
            // res.setHeader('Content-Length', stat.size);
            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
            // file.pipe(res);
            // res.end();
        });
        
    });


    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    app.get('/firstlogin' , function(req,res){
        res.send('OK');
    });

    app.post('/firstLogin' , function(req,res){
        res.send('OK');
    });





    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/dashboard', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            console.log(req.body);
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/dashboard', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

