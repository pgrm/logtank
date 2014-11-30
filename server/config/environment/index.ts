import path = require("path");
import _ = require("lodash");

import development = require("./development");
import production = require("./production");
import test = require("./test");

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
export var all = {
  env: <string>process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: <number>process.env.PORT || 9000,

  // Server ip
  ip: <string>undefined,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'logtank-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    },
    uri: <string>null
  },

  facebook: {
    clientID:     process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  twitter: {
    clientID:     process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/twitter/callback'
  },

  google: {
    clientID:     process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback'
  }
};

switch (all.env) {
  case "development":
    development.initEnvironment(all);
    break;
  case "production":
    production.initEnvironment(all);
    break;
  case "test":
    test.initEnvironment(all);
    break;
}

// Export the config object based on the NODE_ENV
// ==============================================
export var env = all.env;
export var root = all.root;
export var port = all.port;
export var ip = all.ip;
export var seedDB = all.seedDB;
export var secrets = all.secrets;
export var userRoles = all.userRoles;
export var mongo = all.mongo;
export var facebook = all.facebook;
export var twitter = all.twitter;
export var google = all.google;