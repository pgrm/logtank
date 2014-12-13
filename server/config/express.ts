/**
 * Express configuration
 */

import express = require('express');
import morgan = require('morgan');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import errorHandler = require('errorhandler');
import path = require('path');
import config = require('./environment/index');
import passport = require('passport');
import session = require('express-session');
import mongoose = require('mongoose');
import csrf = require('csurf');
import methodOverride = require('method-override');

var favicon = require('serve-favicon');
var mongoStore = require('connect-mongo')(session);
var expressPromise = require('express-promise');

export function initialize(app: express.Application) {
  var env = app.get('env');

  app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
  app.use(express.static(path.join(config.root, 'public')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride('X-HTTP-Method'));
  app.use(methodOverride('X-HTTP-Method-Override'));
  app.use(cookieParser());

  // Persist sessions with mongoStore
  // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
  app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({ mongoose_connection: mongoose.connection })
  }));
  app.use(csrf());
  app.use(function(req: express.Request, res: express.Response, next: Function) {
      res.cookie('XSRF-TOKEN', req.csrfToken());
      next();
  });
  
  app.use(passport.initialize());
  app.use(passport.session());

  if ('production' === env) {
    app.use(morgan('prod'));
  }

  if ('development' === env || 'test' === env) {
    app.use(morgan('dev'));
  }

  app.use(errorHandler()); // Error handler - has to be last
};