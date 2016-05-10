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
        name         : String,
        id           : String,
        created_time : String
    }],
    photos           : [{
        created_time : String,
        name         : String,
        id           : String
    }],
    friends          : [{
        name         : String,
        id           : String
    }],
    tagged_places    : [{
        id           : String,
        created_time : String,
        place        : {
            id       : String,
            location : Object,
            name     : String
        }
    }],
    events           : [{
        description  : String,
        name         : String,
        place        : {
            id       : String,
            location : Object,
            name     : String
        },
        start_time   : String,
        id           : String,
        rsvp_status  : String
    }],
    music            : [{
        name         : String,
        id           : String,
        created_time : String
    }],
    books            : [{
        name         : String,
        id           : String,
        created_time : String
    }],
    settings         : Object,
    prospect         : Object,

    likes: [{
        id: String,
        accept: Boolean
    }]

   

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