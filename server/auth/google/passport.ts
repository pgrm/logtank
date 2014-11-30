import passport = require('passport');
import userM = require('../../api/user/user.model');
import config = require("../../config/environment/index");

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

export function setup() {
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      userM.Model.findOne({
        'google.id': profile.id
      }, function(err, user) {
        if (!user) {
          user = new userM.Model({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            username: profile.username,
            provider: 'google',
            google: profile._json
          });
          user.save(function(err) {
            if (err) done(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));
};
