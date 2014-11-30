import express = require('express');
import mongoose = require('mongoose');
import passport = require('passport');
import config = require('../config/environment/index');
import jwt = require('jsonwebtoken');
import expressJwt = require('express-jwt');
import user = require('../api/user/user.model');

var compose = require('composable-middleware');
var validateJwt = expressJwt({ secret: config.secrets.session });

class AuthService {

  /**
   * Attaches the user object to the request if authenticated
   * Otherwise returns 403
   */
  public static isAuthenticated() {
    return compose()
      // Validate jwt
      .use(function(req, res, next) {
        // allow access_token to be passed through query parameter as well
        if(req.query && req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = 'Bearer ' + req.query.access_token;
        }
        validateJwt(req, res, next);
      })
      // Attach user to request
      .use(function(req, res, next) {
        user.Model.findById(req.user._id, function (err, user) {
          if (err) return next(err);
          if (!user) return res.send(401);

          req.user = user;
          next();
        });
      });
  }

  /**
   * Checks if the user role meets the minimum requirements of the route
   */
  public static hasRole(roleRequired: string) {
    if (!roleRequired) {
      throw new Error('Required role needs to be set');
    } 
    var meetsRequirements = (req: express.Request, res: express.Response, next: Function) => {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.send(403);
      }
    }

    return compose()
      .use(AuthService.isAuthenticated())
      .use(meetsRequirements);
  }

  /**
   * Returns a jwt token signed by the app secret
   */
  public static signToken(id: string) {
    return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
  }

  /**
   * Set token cookie directly for oAuth strategies
   */
  public static setTokenCookie(req, res) {
    if (!req.user) {
      return res.json(404, { message: 'Something went wrong, please try again.'});
    }
    var token = AuthService.signToken(req.user._id);

    res.cookie('token', JSON.stringify(token));
    res.redirect('/');
  }
}

export = AuthService;