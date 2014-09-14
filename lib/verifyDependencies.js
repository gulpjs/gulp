'use strict';

var matchdep = require('matchdep');

var logVerify = require('./log/verify');
var getBlacklist = require('./getBlacklist');
var logBlacklistError = require('./log/blacklistError');

/**
 * Given a collection of plugin names verifies this collection against
 * the blacklist. Returns an object with:
 * [plugin name]=>[blacklisting reason]
 * or an empty object if none of the dependencies to check are blacklisted.
 *
 * @param pkg - package.json contents
 * @param blacklist - contents of the blacklist in JSON format
 */
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
