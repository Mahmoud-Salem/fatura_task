// Requiring dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const cors = require('cors');



// Initializing app
var app = express();


// Using Middlewares
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



// // view engine setup

// app.set('view engine', 'html');
// app.set('views', path.join(__dirname, '/public/views'));

// Requiring routes
var client = require('./routes/client.js');


// Using routes
app.use('/api/client',client);



module.exports = app ;