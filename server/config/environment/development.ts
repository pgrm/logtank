'use strict';

// Development specific configuration
// ==================================

export function initEnvironment (defaultConfig) {
    defaultConfig.seedDB = true;
    defaultConfig.mongo.uri = 'mongodb://localhost/logtank-dev';
};