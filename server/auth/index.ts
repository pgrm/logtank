import express = require('express');
import passport = require('passport');
import config = require('../config/environment/index');
import user = require('../api/user/user.model');

import localRouter = require('./local/index');
import facebookRouter = require('./facebook/index');
import twitterRouter = require('./twitter/index');
import googleRouter = require('./google/index');

import localPassport = require("./local/passport");
import facebookPassport = require("./facebook/passport");
import twitterPassport = require('./twitter/passport');
import googlePassport = require('./google/passport');

export var router = express.Router();

export function initAuth() {
    // Passport Configuration
    localPassport.setup();
    facebookPassport.setup();
    googlePassport.setup();
    twitterPassport.setup();

    router.use('/local', localRouter);
    router.use('/facebook', facebookRouter);
    router.use('/twitter', twitterRouter);
    router.use('/google', googleRouter);    
}