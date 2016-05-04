// models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    
    authenticate     : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        photo        : String
    },
    first_name       : String,
    last_name        : String,
    gender           : String,
    birthday         : String,
    email            : String,
    hometown         : {
        id           : String,
        name         : String
    },
    location         : {
        id           : String,
        name         : String
    },
    likes            : [{
        id           : String,
        name         : String
    }],
    friends          : [{
        id           : String,
        name         : String
    }],
    books            : [{
        id           : String,
        name         : String
    }],
    music            : [{
        id           : String,
        name         : String
    }]



});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);