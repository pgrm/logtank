/// <reference path="typings/tsd.d.ts" />

import express = require("express");
import mongoose = require("mongoose");
import config = require('./config/environment/index');
import http = require("http");
import expressConfig = require('./config/express');
import seed = require("./config/seed");

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { 
    seed.StartSeeding();
}

// Setup server
var app = express();
expressConfig.initialize(app);
require('./routes')(app);

// Start server
app.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});