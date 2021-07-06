// Requiring dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const cors = require('cors');
require('dotenv').config();



// Initializing app
var app = express();


// Using Middlewares
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



// Requiring routes
var client = require('./routes/client.js');


// Using routes
app.use('/api/client',client);




module.exports = app ;