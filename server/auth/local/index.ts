import express = require('express');
import passport = require('passport');
import auth = require('../auth.service');

var router = express.Router();

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});

    var token = auth.signToken(user._id);
    res.json({token: token});
  })(req, res, next)
});

export = router;