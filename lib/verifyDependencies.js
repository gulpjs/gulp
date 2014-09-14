'use strict';

var matchdep = require('matchdep');

/**
 * Given a collection of plugin names verifies this collection against
 * the blacklist. Returns an object with:
 * [plugin name]=>[blacklisting reason]
 * or an empty object if none of the dependencies to check are blacklisted.
 *
 * @param pkg - package.json contents
 * @param blacklist - contents of the blacklist in JSON format
 */
function verifyDependencies(pkg, blacklist) {
  var blacklisted = matchdep
    .filterAll(Object.keys(blacklist), pkg)
    .reduce(function(blacklisted, pluginName){
      blacklisted[pluginName] = blacklist[pluginName];
      return blacklisted;
    }, {});

  return blacklisted;
}

module.exports = verifyDependencies;
