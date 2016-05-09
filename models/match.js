// models/match.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var matchSchema = mongoose.Schema({
    users: [{
    	id: String,
    	accept: Boolean
    }]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Match', matchSchema);