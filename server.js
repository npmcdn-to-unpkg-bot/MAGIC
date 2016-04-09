var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);


var cons = require('consolidate');
var viewPath = __dirname + '/views/html/';
// setup html engine
app.engine('html', cons.swig)
app.set('views', viewPath);
app.set('view engine', 'html');
// allow for parsing post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'views')));

//global variables
var port = 8080;

//listen at localhost 8080!
server.listen(port);
console.log("Started server on port: " + port);

var namespace = '/';

//just render the index! 
app.get('/', function(request, response) {
    // render the home page
	response.render('landing.html');
});