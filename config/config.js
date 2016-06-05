#!/usr/bin/env node

/**
 * The config object.
 * @type {Object}
 * @property  {Object} config             The config object.
 * @property  {Object} config.db          The db config object.
 * @property  {string} config.db.dialect  The db dialect sqlite | mysql.
 * @property  {string} config.db.host     The db host.
 * @property  {string} config.db.database The db database name.
 * @property  {string} config.db.username The db username.
 * @property  {string} config.db.password The db password.
 */
var config = {
  db : {
    dialect  : 'mysql',
    host     : 'localhost',
    database : 'webcredits',
    username : 'me',
    password : ''
  },
  wallet : "https://localhost/wallet/test#this",
  walletname : "localhost test",
  HDPublicKey : "xpub661MyMwAqRbcH4Jage4yavGhxdhv48gniC2S4irQG3Rj78t9pbTQch3PpqKvwunq7cuYeLEQ6VA1C3wcyk8MKspGqAtU9agfNcn2KBDvM6U",
  maker : "https://melvincarvalho.com/#me"

}

module.exports = config
