// routes.js

var path = require('path');

var User = require('./models/user');

module.exports = function(app, passport, graph) {

    // route for home page
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/index.html'); // load the index.ejs file
    });

    // route for login form
    // route for processing the login form
    // route for signup form
    // route for processing the signup form

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        res.json(req.user.facebook);

         // get a users information
        var params = { fields: "email,birthday,likes,photos,friends,location,tagged_places,events,hometown,books,music" };
        graph
        .setAccessToken(req.user.facebook.token)
        .get("/me", params, function(err, data) {
            console.log("------------------------------------------------------------");
            console.log("DATA: ");
            console.log(data);
            // SO FAR ONLY PULLING FIRST 25
            // user email (string)
            var user_email = data.email;
            // user birthday (string)
            var user_birthday = data.birthday;
            // user likes object {data, paging{cursors{before: string, after: string}, next: string}}
            var user_likes_object = data.likes;
            console.log("------------------------------------------------------------");
            console.log("LIKES: ");
            console.log(user_likes_object);
            // user photos object {data, paging{cursors{before: string, after: string}, next: string}}
            var user_photos_object = data.photos;
            console.log("------------------------------------------------------------");
            console.log("PHOTOS: ");
            console.log(user_photos_object);
            // user friends object {data, paging{cursors{before: string, after: string}, next: string}}
            var user_friends_object = data.friends;
            console.log("------------------------------------------------------------");
            console.log("FRIENDS: ");
            console.log(user_friends_object);
            // user location object {id, name}
            var user_location_object = data.location;
            console.log("------------------------------------------------------------");
            console.log("LOCATION: ");
            console.log(user_location_object);
            // user tagged places object {data, paging{cursors{before: string, after: string}, next: string}}
            var user_tagged_places_object = data.tagged_places;
            console.log("------------------------------------------------------------");
            console.log("TAGGED PLACES: ");
            console.log(user_tagged_places_object);
            // user events {data, paging{cursors{before: string, after: string}, next: string}}
            var user_events_object = data.events;
            console.log("------------------------------------------------------------");
            console.log("EVENTS: ");
            console.log(user_events_object);
            // user hometown {id, name}
            var user_hometown_object = data.hometown;
            console.log("------------------------------------------------------------");
            console.log("HOMETOWN: ");
            console.log(user_hometown_object);
            // user music {data, paging{cursors{before: string, after: string}, next: string}}
            var user_music_object = data.music;
            console.log("------------------------------------------------------------");
            console.log("MUSIC: ");
            console.log(user_music_object);

            // NEED TO GET ALL PAGES OF DATA
        });
    });

    //testing getting all profiles
    app.get('/profiles', function (req, res) {
        User.find({}, function (err, users) {
            //error checking?
            res.json(users.map(function (user) {
                return user.facebook;
            }));
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

    return next();

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}