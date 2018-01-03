let multer  = require('multer');
let upload = multer({ dest: 'uploads/thumbnails'});

let path = require('path');
let eventsdata = require('./demodata');


let Event = require('./models/event');
let Books = require('./models/book');
let Videos = require('./models/video');
let Playlists = require('./models/playlist');


// let pdfGen = require('./../pdf.js');
let idcard = require('./png');
let fs = require('fs');

module.exports = function (app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    // app.get('/', function (req, res) {
    //     res.render('index.ejs');
    // });

    app.get('/', function (req, res) {
        res.render('index.ejs');
    });


    app.get('/admin', isLoggedIn, isAdmin, function (req, res) {
        res.render('admin/admin', {user: req.user});
    });

    app.get('/blog', isLoggedIn, function (req, res) {
        res.render('blog', {user: req.user});
    });


    // Events Routes

    app.get('/events', isLoggedIn, function (req, res) {
        res.render('events', {user: req.user});
    });

    app.get('/events-admin', isLoggedIn, isAdmin, function (req, res) {
        res.render('admin/eventAdmin');
    });

    app.post('/events-admin', isAdmin, function (req, res) {
        console.log(req.body);
        // require('./enterdata');
        Event.update({college: req.body.college}, req.body, {upsert: true}).then(function (doc) {
            res.json(doc);
        }, function (err) {
            res.status(400).send(err);
        });
        let event = new Event(req.body);
        event.save().then(function (doc) {
            res.json(doc);
        }, function (err) {
            res.status(400).send(err);
        })
    });


    app.get('/getevents/:college', function (req, res) {
        let college = req.params.college;
        console.log(college);
        if (college === 'search') {
            Event.find().then(function (data) {
                let di = {};
                // console.log(data);
                data.forEach(function (item) {
                    di[item.college] = item.college_name
                });
                res.json(di);
            }, function (err) {
                res.status(400).send(err);
            });
        } else {
            Event.find({college: college}).then(function (data) {
                console.log('Found');
                console.log(typeof data[0], 'type');
                let di = {
                    'college': data[0].college,
                    'college_name': data[0].college_name,
                    'success': 1,
                    'events': data[0].events,
                    'result': data[0].events
                };
                console.log('di', di);
                // console.log(JSON.stringigy(di , null ,4))
                res.json(di);
            }, function (err) {
                console.log('Error');
                res.status(400).send(err);
            })

        }
    });


    app.get('/library', isLoggedIn, function (req, res) {
        Books.find().then(function (data) {
            console.log(data);
            // console.log({user : req.user , books : data});
            let category = [];
            data.forEach((book) => {
                console.log('book');
                if (category.indexOf(book.category) === -1) {
                    category.push(book.category);
                }
            });
            console.log(category);
            res.render('library', {user: req.user, books: data, categories: category});
        }, function (err) {
            console.log('Err');
            console.log(err);
        });
        // res.render('library', {user: req.user});
    });

    app.get('/library-admin', isAdmin, isLoggedIn, function (req, res) {
        Books.find().then(function (data) {
            console.log(data);
            console.log({user: req.user, books: data});
            res.render('admin/libraryAdmin', {user: req.user, books: data});
        }, function (err) {
            console.log('Err');
            console.log(err);
        });
        // res.render('libraryAdmin', {user : req.user , });
    });

    app.get('/books/delete/:id', isLoggedIn, isAdmin, function (req, res) {
        let id = req.params.id;
        Books.find({_id: id}).remove().exec();
        console.log(id);
        res.send('ok');
    });

    app.get('/books/edit/:id', isLoggedIn, isAdmin, function (req, res) {
        let id = req.params.id;
        console.log(id);
        Books.find({_id: id}).then(function (data) {
            res.render('Book', {'book': data[0], user: req.user})
        }, function (err) {

        });
    });

    app.post('/books/edit/:id', isLoggedIn, isAdmin, function (req, res) {
        let id = req.params.id;
        console.log(id);
        console.log(req.body);
        Books.update({_id: id}, req.body).then(function (data) {
            res.send(data);
        }, function (err) {
            console.error(err);
        });
    });


    app.get('/book/new', isLoggedIn, isAdmin, function (req, res) {
        res.render('books/newBook', {user: req.user});
    });

    app.post('/book/new', isLoggedIn, isAdmin, function (req, res) {
        // res
        console.log(req.body);
        Books.create(req.body, function (err, result) {
            if (err) {
                console.log(err);
                return
            }
            console.log(result);
            res.send(result);
        })
    });


    // Videos Sections

    app.get('/videos', isLoggedIn , function (req, res) {

        Playlists.find().then(function (result) {
            res.render('videos', {
                user: req.user,
                playlists: result
            });
        } , function (err) {
            next(err);
        })


        // Playlists.find({}, function (err, playlists) {
        //     if (err)
        //         res.send('Internal Server Error', 500);
        //
        //     let map = {};
        //     playlists.forEach(function (list) {
        //         map[list._id] = list.title;
        //     });
        //
        //     Videos.aggregate([{
        //             $group: {
        //                 _id: "$playlist", videos: {
        //                     $push: {
        //                         title: "$title",
        //                         link: "$link",
        //                         image: "$image",
        //                     }
        //                 }
        //             }
        //         }],
        //         function (err, data) {
        //             if (err)
        //                 console.log(err);
        //             for( let i = 0 ; i < data.length  ; i++){
        //                 data[i].title = map[ data[i]._id ]
        //             }
        //             res.render('videos', {
        //                 user: req.user ,
        //                 playlists : data
        //             });
        //         }
        //     );
        //
        // });

    });

    // Videos

    app.get('/videos/:id' , function (req , res) {
        let _id = req.params.id ;
        Videos.findOne({_id : _id }).then(function (result) {
            res.render('videos/viewVideo' , {
                'user' : req.user,
                'video' : result
            }) ;
        })
    });

    app.get('/videos/new', isLoggedIn, isAdmin, function (req, res) {

        Playlists.find({}, function (err, playlists) {
            if (err)
                res.send('Internal Server Error', 500);

            let map = {};
            playlists.forEach(function (list) {
                map[list._id] = list.title;
            });
            res.render('videos/newVideo', {
                user: req.user,
                playlists: map
            });
        });
    });

    app.post('/videos/new', upload.single('thumbnail') , isLoggedIn, isAdmin, function (req, res) {

        console.log(req.body);
        console.log(req.file);

        let doc = req.body ;
        doc.image = '/thumbnails/' + req.file.filename ;

        Videos.create(req.body, function (err, result) {
            if (err) {
                console.log(err);
                return
            }
            console.log(result);
            res.send(result);
        })
    });

    app.get('/videos/edit/:id', isLoggedIn, isAdmin, function (req, res) {
        let id = req.params.id;
        console.log(id);

        Playlists.find({}, function (err, playlists) {
            if (err)
                res.send('Internal Server Error', 500);

            let map = {};
            playlists.forEach(function (list) {
                map[list._id] = list.title;
            });

            Videos.find({_id: id}).then(function (data) {
                res.render('videos/editVideo', {
                    user: req.user,
                    playlists: map,
                    video: data[0]
                });

            }, function (err) {

            });

        });
    });

    app.post('/videos/edit/:id', isLoggedIn, isAdmin, function (req, res) {
        let id = req.params.id;
        console.log(id);
        console.log(req.body);
        Videos.update({_id: id}, req.body).then(function (data) {
            res.send(data);
        }, function (err) {
            console.error(err);
        });
    });

    app.get('/videos/delete/:id', isLoggedIn, isAdmin, function (req, res) {
        let id = req.params.id;
        Videos.find({_id: id}).remove().exec();
        console.log(id);
        res.send('ok');
    });

    app.get('/videos-admin', isLoggedIn, isAdmin, function (req, res) {

        Videos.find()
            .populate('playlist')
            .then(function (videos) {

                res.render('admin/videoAdmin', {
                    user: req.user,
                    videos: videos
                });
            }, function (err) {
                console.log('Err');
                console.log(err);
                res.send('Server Error.', 500)
            });
    });


    // Playlists
    app.get('/playlist/:id' , function(req , res){
        let _id = req.params.id ;
        Videos.find({playlist : _id }).then(function (results) {
            res.render('playlists/viewPlaylist' , {
                'user' : req.user ,
                'videos' : results
            })
        } , function(err) {

        });
    });

    app.get('/playlist/new', isLoggedIn, isAdmin, function (req, res) {
        res.render('playlists/newPlaylist', {user: req.user});
    });

    app.post('/playlist/new', upload.single('thumbnail') ,isLoggedIn, isAdmin, function (req, res) {

        console.log(req.body);
        // res.send(req.file);

        let doc = req.body ;
        doc.image = '/thumbnails/' + req.file.filename ;

        Playlists.create( doc , function (err, result) {
            if (err) {
                console.log(err);
                return
            }
            console.log(result);
            res.send(result);
        })
    });

    app.get('/playlist/edit/:id', isLoggedIn, isAdmin, function (req, res) {
        let id = req.params.id;
        console.log(id);
        Playlists.find({_id: id}).then(function (data) {
            res.render('playlists/editPlaylist', {'playlist': data[0], user: req.user})
        }, function (err) {

        });
    });

    app.post('/playlist/edit/:id', isLoggedIn, isAdmin, function (req, res) {
        let id = req.params.id;
        console.log(id);
        console.log(req.body);
        Playlists.update({_id: id}, req.body).then(function (data) {
            res.send(data);
        }, function (err) {
            console.error(err);
        });
    });

    app.get('/playlist/delete/:id', isLoggedIn, isAdmin, function (req, res) {
        let id = req.params.id;
        Playlists.find({_id: id}).remove().exec();
        console.log(id);
        res.send('ok');
    });

    app.get('/playlist-admin', isLoggedIn, isAdmin, function (req, res) {

        Playlists.find().then(function (playlists) {

            let map = {};
            playlists.forEach(function (list) {
                map[list._id] = list.title;
            });
            res.render('admin/playlistAdmin', {
                user: req.user,
                playlists: map
            });
        }, function (err) {
            console.log('Err');
            console.log(err);
            res.send('Server Error.', 500)
        });
    });


    // PROFILE SECTION =========================
    app.get('/dashboard', isLoggedIn, function (req, res) {

        let filenameexpected = `/${req.user.email}.png`;
        res.render('dashboard1', {
            user: req.user,
            idcard: filenameexpected
        });

    });

    app.post('/profile/pdf', function (req, res) {
        let view = req.body;
        // console.log(view);
        idcard.topdf(view, function (response) {
            console.log(response.fileName);
            fs.readFile(response.fileName, function (err, data) {
                res.setHeader('Content-type', 'application/pdf');
                console.log(data.toString('base64'));
                res.end(data.toString('base64'), 'binary')
            });
        });

    });


    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    app.get('/firstlogin', function (req, res) {
        res.send('OK');
    });

    app.post('/firstLogin', function (req, res) {
        res.send('OK');
    });


    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('auth/login.ejs', {message: req.flash('loginMessage')});
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        console.log(req.body);
        res.render('auth/signup.ejs', {message: req.flash('signupMessage')});
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
};


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

function isAdmin(req, res, next) {
    if (req.user.isAdmin)
        return next();

    res.redirect('/dashboard');
}

