var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./config');
var apiRouter = require('./routes/apiRoutes');
var webRouter = require('./routes/webRoutes');

var db = mongoose.connect(config.databaseConnectionString);
var app = express();
var port = process.env.PORT || config.defaultPort;

app.set('views', './views'); // etll express where our views are
app.set('view engine', 'vash'); // use vash as view engine

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static('public')); // set up static files
app.use('/api', apiRouter()); // use api router for ajax api routes

app.get('/', webRouter.index);

// set the server
app.listen(port, function () {
	console.log('Running on port: ' + port);
});