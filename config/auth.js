// config/auth.js

var callbackURL = process.env.heroku ? 'http://cs132-magic.herokuapp.com/auth/facebook/callback' : 'http://10.38.19.116:8080/auth/facebook/callback';

// expose our config directly to our application using module.exports
module.exports = {
    'facebookAuth' : {
        'clientID'      : '1743817865903434', // your App ID
        'clientSecret'  : 'f1d4ba82948d958d0f85f606d19d9b60', // your App Secret
        'callbackURL'   : callbackURL
    }
};