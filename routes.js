// routes.js

var path = require('path');

var User = require('./models/user');
var Message = require('./models/message');

var FastPriorityQueue = require("fastpriorityqueue");

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
        res.json(req.user.settings);
    });

    app.post('/settings/matching', isLoggedIn, function(req, res) {
        req.user.settings = req.body;
        req.user.save(function (err) {
            if(err) {
                console.log("ERROR!");
                console.error('ERROR! Couldn\'t save profile information.');
            }
        });
    });

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {

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
                    //setting default orientation
                    user.settings.orientation = (user.gender == "male") ? "Women" : "Men";
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
                
                res.json(user);

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
    // app.get('/profiles', isLoggedIn, function (req, res) {
    //     User.find({}, function (err, users) {
    //         //error checking?
    //         res.json(users.map(function (user) {
    //             return user.authenticate;
    //         }));
    //     });
    // });


    app.post('/match', isLoggedIn, function (req, res) {
        var otherId = req.body.id;
        var decision = req.body.decision;

        req.user.matches[otherId] = decision;

        req.user.markModified('matches');

        console.log(req.user.matches);

        req.user.save(function (err) {
            if(err) {
                console.log("ERROR!");
                console.error('ERROR! Couldn\'t save profile information.');
            }

            res.json({});
        });
     });


    app.get('/match', isLoggedIn, function (req, res) {

        var common = [];
        console.log("called server side");

        
        var userData = req.user;
        var matchSettings = userData.settings;

        console.log(userData.matches);

        // Find other profiles in the user's location that have not been liked
        var options = { 
            'location.id' : userData.location.id, 
            'authenticate.id' : { $ne : userData.authenticate.id, $nin: Object.keys(userData.matches)},
        };
        User.find(options, function (err, users) {
            if (err) {
                console.error(err);
                return;
            }
            var potentialMatches = users;

            // Takes in an associative array of { userID: __, score: }
            var matchRanking = new FastPriorityQueue(function (a, b) {
                return a.score > b.score;
            });
            
            for (var i = 0; i < potentialMatches.length; i+=1) {
                var currScore = 0;
                var matchSettingsKeys = Object.keys(matchSettings);

                for (var j = 0; j < matchSettingsKeys.length; j+=1) {
                    var matchSettingKey = matchSettingsKeys[j];
                    if (matchSettingKey) {
                        if (Array.isArray(userData[matchSettingKey])) { // Array
                            for (var k = 0; k < userData[matchSettingKey].length; k+=1) { 
                                var userAttr = userData[matchSettingKey][k];
                                for (var l = 0; l < potentialMatches[i][matchSettingKey].length; l+=1) {
                                    if (userAttr.id === potentialMatches[i][matchSettingKey][l].id) {
                                        if(userAttr.name != null){
                                            common.push(userAttr.name);
                                        }
                                        currScore += 1;
                                    }
                                }
                            }
                        } else { // not a list
                            if (userData[matchSettingKey]) {
                                if (userData[matchSettingKey].id === potentialMatches[i][matchSettingKey].id) {
                                    if(userData[matchSettingKey].name != null){
                                        common.push(userData[matchSettingKey].name);
                                    }
                                    currScore += 1;
                                }
                            }
                        }
                    }
                }

                var currMatch = {
                    userID : potentialMatches[i].authenticate.id,
                    score  : currScore
                };

                console.log('added');

                matchRanking.add(currMatch);
            }
            if (matchRanking.size > 0) {
                var topMatch = matchRanking.poll();
                User.findOne({'authenticate.id' : topMatch.userID}, function (err, user) {
                    if (err) {
                        console.error(err);
                        return;
                    } 
                    var ageMS = Date.now() - Date.UTC(parseInt(user.birthday.slice(6,10)), 
                                                        parseInt(user.birthday.slice(0,2)) - 1, 
                                                        parseInt(user.birthday.slice(3,5)));
                    var age = Math.floor(ageMS/1000/60/60/24/365);
                    var prospect = {
                        id: user.authenticate.id,
                        first_name: user.first_name,
                        hometown: user.hometown.name,
                        photo: user.authenticate.photo,
                        age : age,
                        score: currScore,
                        common_likes: common
                    };

                    res.json(prospect);
                });
            } else {
                res.json(false);
            }
        });
    });

    app.get('/matches', isLoggedIn, function (req, res) {

        var matches = Object.keys(req.user.matches).filter(function (otherId) {
            return req.user.matches[otherId];
        });

        //console.log(matches);

        var id = req.user.authenticate.id;
        var query = {
            "authenticate.id": {
                    $in : matches
            }
        };
        query["matches." + id] = {
                $exists: true,
                $eq: true
            }
        //console.log(JSON.stringify(query));
        User.find(query, function (err, users) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            //console.log(users);
            res.json(users.map(function (user) {
                return {
                    id: user.authenticate.id,
                    first_name: user.first_name,
                    photo: user.authenticate.photo
                };
            }));
        });
    });

    app.get('/messages/:id', isLoggedIn, function (req, res) {
        var userId = req.user.authenticate.id;
        var otherId = req.params.id;
        Message.find({
                fromId: userId,
                toId: otherId
        }, function (err, toMessages) {
            if (err)
                res.sendStatus(500);
            Message.find({
                fromId: otherId,
                toId: userId
            }, function (err, fromMessages) {
                if (err)
                    res.sendStatus(500);
                var messages = toMessages.concat(fromMessages);
                res.json(messages);
            })
        });
    });

    app.post('/messages', isLoggedIn, function (req, res) {
        var newMessage = new Message();

        newMessage.fromId = req.user.authenticate.id;
        //SECURITY: verify that this user is one of their matches
        newMessage.toId = req.body.id;
        newMessage.message = req.body.message;
        newMessage.timestamp = new Date();
        newMessage.save(function(err) {
            if (err) {
                res.sendStatus(500);
                return;
            }

            res.json({});

            // TODO: if successful and toId websocket is connected, send the message through websocket
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    var scope_info = ['email','user_birthday','user_likes','user_photos','user_friends','user_location','user_tagged_places',
                    'user_events','user_hometown','user_actions.books','user_actions.music'];
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
        console.log('wutface');
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