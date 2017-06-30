var express = require('express');
var app = express();

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var config = require('./config/configuration');
var genBookRoute = require('./routes/generalBookRoute');

//connect to db
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoconfig.database);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use('/',genBookRoute);

//start server
var server = app.listen('8080',function(){
	console.log("server started at port 8080");
})