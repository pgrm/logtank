import express = require('express');
import passport = require('passport');
import jwt = require('jsonwebtoken');

import user = require('./user.model');
import config = require('../../config/environment/index');

class UserController {
  public static validationError(res, err) {
    return res.json(422, err);
  }

  /**
   * Get list of users
   * restriction: 'admin'
   */
  public static index(req: express.Request, res: express.Response) {
    res.json(user.Model.find({}, user.VirtualColumns.profile));
    // user.Model.find({}, '-salt -hashedPassword', function (err, users) {
    //   if(err) return res.send(500, err);
    //   res.json(200, users);
    // });
  }

  /**
   * Creates a new user
   */
  public static create(req: express.Request, res: express.Response) {
    var newUser = new user.Model(req.body);
    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.save<user.IUser>((err, user) => {
      if (err) {
        return UserController.validationError(res, err);
      } 
      var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
      res.json({ token: token });
    });
  }

  /**
   * Get a single user
   */
  public static show(req: express.Request, res: express.Response) {
    return res.json(user.Model.findById(req.params.id, user.VirtualColumns.profile));
  }

  /**
   * Deletes a user
   * restriction: 'admin'
   */
  public static destroy(req: express.Request, res: express.Response) {
    return res.json(user.Model.findByIdAndRemove(req.params.id));
  }

  /**
   * Change a users password
   */
  public static changePassword(req: express.Request, res: express.Response) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    user.Model.findById(userId, function (err, user) {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        user.save(function(err) {
          if (err) {
            return UserController.validationError(res, err);
          } 
          res.send(200);
        });
      } else {
        res.send(403);
      }
    });
  }

  /**
   * Get my info
   */
  public static me(req: express.Request, res: express.Response) {
    return res.json(user.Model.findById(req.user._id, user.VirtualColumns.profile));
  }

  /**
   * Authentication callback
   */
  public static authCallback(req: express.Request, res: express.Response) {
    res.redirect('/');
  }
}

export = UserController;