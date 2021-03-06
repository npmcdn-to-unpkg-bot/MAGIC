// config/passport.js

// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User       = require('../models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.authenticate.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findOne({'authenticate.id' : id}, function(err, user) {
            done(err, user);
        });
    });
    
    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ["id", "birthday", "email", "first_name", "gender", "last_name", "picture.type(large)"]

    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({'authenticate.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();
                    // set all of the facebook information in our user model
                    newUser.authenticate.id    = profile.id; // set the users facebook id                   
                    newUser.authenticate.token = token; // we will save the token that facebook provides to the user                    
                    newUser.authenticate.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.authenticate.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.authenticate.photo = profile.photos[0].value;
                    newUser.settings = {orientation: null, likes: true, friends: true, location: false, hometown: false, tagged_places: false, events: false, music: false, books: false};
                    newUser.matches = {};
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }
            });
        });

    }));

};