'use strict';

// Production specific configuration
// =================================

export function initEnvironment (defaultConfig) {
  defaultConfig.ip =    process.env.OPENSHIFT_NODEJS_IP ||
                        process.env.IP ||
                        undefined;

  defaultConfig.port =  process.env.OPENSHIFT_NODEJS_PORT ||
                        process.env.PORT ||
                        8080;

  defaultConfig.mongo.uri = process.env.MONGOLAB_URI ||
                            process.env.MONGOHQ_URL ||
                            process.env.MONGODB_URL ||
                            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
                            'mongodb://localhost/logtank'
}