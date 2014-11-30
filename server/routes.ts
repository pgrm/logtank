/**
 * Main application routes
 */

import express = require("express");

import errors = require('./components/errors');

import thingRoutes = require("./api/thing/index");
import userRoutes = require('./api/user/index');
import auth = require("./auth/index");


export function InitializeRoutes(app: express.Application) {
  auth.initAuth();

  // Insert routes below
  app.use('/api/things', thingRoutes);
  app.use('/api/users', userRoutes);

  app.use('/auth', auth.router);
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors.pageNotFound);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
