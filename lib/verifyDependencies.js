'use strict';

var matchdep = require('matchdep');

var logVerify = require('./log/verify');
var getBlacklist = require('./getBlacklist');
var logBlacklistError = require('./log/blacklistError');

function verify(pkg, blacklist) {
  var blacklisted = matchdep
    .filterAll(Object.keys(blacklist), pkg)
    .reduce(function(blacklisted, pluginName){
      blacklisted[pluginName] = blacklist[pluginName];
      return blacklisted;
    }, {});

  logVerify(blacklisted);
}

function verifyDependencies(pkg) {
  getBlacklist(function(err, blacklist){
    if (err) {
      return logBlacklistError(err);
    }

    verify(pkg, blacklist);
  });
}

module.exports = verifyDependencies;
