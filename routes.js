// routes.js

var path = require('path');

var User = require('./models/user');
var Message = require('./models/message');
var Match = require('./models/match');

//map from socket ids to websockets
var sockets;

module.exports = function(app, passport, graph) {

    // route for home page
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/index.html'); // load the index.ejs file
    });

    // route for login form
    // route for processing the login form
    // route for signup form
    // route for processing the signup form

    // gets the users matching settings
    app.get('/settings/matching', isLoggedIn, function(req, res) {
        console.log("setting called");
        User.findOne({'authenticate.id': req.user.authenticate.id}, function (err, user) {
            res.json(user.settings);
        });
    });

    app.post('/settings/matching', isLoggedIn, function(req, res) {
        User.findOne({'authenticate.id': req.user.authenticate.id}, function (err, user) {
            user.settings = req.body;
            // save the new settings information in the db
            user.save(function (err) {
                if(err) {
                    console.log("ERROR!");
                    console.error('ERROR! Couldn\'t save profile information.');
                }
            });
        });
        res.json({});
    });

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {

        res.json(req.user.authenticate);

        // set the params for what user information to get from the api
        var params = {fields: "first_name,last_name,gender,birthday,email,likes.limit(100),photos.limit(50),friends.limit(50),location,tagged_places.limit(50),events.limit(50),hometown,books.limit(50),music.limit(50)" };
        graph
        .setAccessToken(req.user.authenticate.token)
        .get("/me", params, function(err, data) {
            // basic user information (string)
            var user_first_name = data.first_name;
            var user_last_name = data.last_name;
            var user_gender = data.gender;
            var user_birthday = data.birthday;
            var user_email = data.email;
            // user location information {id, name}
            var user_hometown_object = data.hometown;
            var user_location_object = data.location;

            // user data {data, paging{cursors{before: string, after: string}, next: string}}
            var user_likes_object = data.likes;
            var user_photos_object = data.photos;
            var user_friends_object = data.friends;
            var user_tagged_places_object = data.tagged_places;
            var user_events_object = data.events;
            var user_music_object = data.music;
            var user_book_object = data.books;
            
            //console.log(user_likes_object.data)
            // find the current user and update their information
            User.findOne({'authenticate.id': req.user.authenticate.id}, function (err, user) {
                // check basic user info exists
                if (user_first_name !== undefined) {
                    user.first_name = user_first_name;
                }
                if (user_last_name !== undefined) {
                    user.last_name = user_last_name;
                }
                if (user_gender !== undefined) {
                    user.gender = user_gender;
                }
                if (user_birthday !== undefined) {
                    user.birthday = user_birthday;
                }
                if (user_email !== undefined) {
                    user.email = user_email;
                }
                // check user location info exits
                if (user_hometown_object !== undefined) {
                    user.hometown = user_hometown_object;
                }
                if (user_location_object !== undefined) {
                    user.location = user_location_object;
                }
                // check user data exists
                if (user_likes_object !== undefined) {
                    user.likes = user_likes_object.data;
                }
                if (user_photos_object !== undefined) {
                    user.photos = user_photos_object.data;
                }
                if (user_friends_object !== undefined) {
                    user.friends = user_friends_object.data;
                }
                if (user_tagged_places_object !== undefined) {
                    user.tagged_places = user_tagged_places_object.data;
                }
                if (user_events_object !== undefined) {
                    user.events = user_events_object.data;
                }
                if (user_music_object !== undefined) {
                    user.music = user_music_object.data;
                }
                if (user_book_object !== undefined) {
                    user.books = user_book_object.data;
                }
                
                user.save(function (err) {
                    if(err) {
                        console.log("ERROR!");
                        console.error('ERROR! Couldn\'t save profile information.');
                    }
                });
            });
        });
    });

    //testing getting all profiles
    app.get('/profiles', isLoggedIn, function (req, res) {
        User.find({}, function (err, users) {
            //error checking?
            res.json(users.map(function (user) {
                return user.authenticate;
            }));
        });
    });


    app.post('/match', isLoggedIn, function (req, res) {
    
        console.log(req.body);
        var user_id = req.body.id;
        var decision = req.body.decision;
        console.log(req.user.authenticate.id)

        Match.findOne({'user': req.user.authenticate.id}, function (err, user) {

            for(var i = 0; i < user.likes.length; i++){
                if(user.likes[i].id == user_id){
                    user.likes[i].accept = decision;
                }

            }

            user.save(function (err) {
                if(err) {
                    console.log("ERROR!");
                    console.error('ERROR! Couldn\'t save profile information.');
                }
            });

        });

        
        res.json({});

     });


    app.get('/matches', isLoggedIn, function (req, res) {
        console.log("calleddddddddddddddddddddddddd");
        
        var matchSettings;
        var userData;
        var potentialMatches;

        var userData = req.user;
        var matchSettings = userData.settings;

        // Find other profiles in the user's location
        User.find({ 
            'location.id' : userData.location.id, 
            'authenticate.id' : { $not : userData.authenticate.id },
        }, function (err, users) {
            if (err) {
                console.error(err);
                return;
            }
            potentialMatches = users;
        });

        // Takes in an associative array of { userID: __, score: }
        var matchRanking = new FastPriorityQueue(function (a, b) {
            return a.score > b.score;
        });
        
        for (var i = 0; i < potentialMatches.length; i+=1) {
            var currScore = 0;
            var matchSettingsKeys = Object.keys(matchSettings);


            for (var j = 0; j < matchSettingsKeys.length; j+=1) {
                if (matchSettings.matchSettingsKeys[j]) {

                    if (userData.matchSettingsKeys[j].length === undefined) { // i.e. not a list
                        if (userData.matchSettingsKeys[j].id === potentialMatches[i].matchSettingsKeys[j].id) {
                            score += 1;
                        }
                    } else { // list of attributes
                        for (var k = 0; k < userData.matchSettingsKeys[j].length; k+=1) { 
                            var userAttr = userData.matchSettingsKeys[j][k];
                            for (var l = 0; l < potentialMatches[i].matchSettingsKeys[j].length; l+=1) {
                                if (userAttr.id === potentialMatches[i].matchSettingsKeys[j][l].id) {
                                    score += 1;
                                }
                            }
                        }
                    }
                }
            }

            var currMatch = {
                userID : potentialMatches[i].authenticate.id,
                score  : currScore
            };

            matchRanking.add(currMatch);
        }

        var topMatch = matchRanking.poll();
        var prospect;
        User.findOne({'authenticate.id' : topMatch.userID}, function (err, user) {
            if (err) {
                console.error(err);
                return;
            } 
            prospect = {
                id: user.authenticate.id,
                email: user.authenticate.email,
                first_name: user.first_name,
                last_name: user.last_name,
                gender: user.gender,
                photo: user.authenticate.photo
            };
        });
        console.log(prospect);
        res.json(prospect);
    });

    

    app.get('/messages', isLoggedIn, function (req, res) {

    });

    app.post('/messages', isLoggedIn, function (req, res) {
        var newMessage = new Message();

        newMessage.fromId = req.user.authenticate.id;
        //SECURITY: verify that this user is one of their matches
        newMessage.toId = req.body.toId;
        newMessage.message = req.body.message;
        newMessage.timestamp = new Date();
        newMessage.save(function(err) {
            if (err)
                res.sendStatus(500);

            res.sendStatus(200);

            // TODO: if successful and toId websocket is connected, send the message through websocket
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    var scope_info = ['email','user_birthday','user_likes','user_photos','user_friends','user_location','user_tagged_places',
                    'user_events','user_hometown','user_actions.books','user_actions.fitness','user_actions.music'];
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: scope_info}));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/home',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/*', function(req, res) {
        res.sendFile(__dirname + "/index.html"); // load the index.ejs file
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}