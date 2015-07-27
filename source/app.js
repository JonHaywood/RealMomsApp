var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var apiRouter = require('./routes/apiRoutes');
var webRouter = require('./routes/webRoutes');

var db = mongoose.connect('mongodb://localhost/realMomsAPI');
var app = express();
var port = process.env.PORT || 8000;

app.set('views', './views');
app.set('view engine', 'vash'); // use vash as view engine

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static('public')); // set up static files
app.use('/api', apiRouter()); // use api router for api routes

app.get('/', webRouter.index);

app.listen(port, function () {
	console.log('Running on port: ' + port);
});