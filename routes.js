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
    });

    //testing getting all profiles
    app.get('/profiles', function (req, res) {
        User.find({}, function (err, users) {
            //error checking?
            res.json(users.map(function (user) {
                return user.facebook;
            }));
        });
        // get a users information
        graph
        .setAccessToken(req.user.facebook.token)
        .get("/me/friends", function(err, data) {
          console.log(data);
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