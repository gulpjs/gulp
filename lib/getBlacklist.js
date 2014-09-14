'use strict';

var wreck = require('wreck');

var url = 'http://gulpjs.com/plugins/blackList.json';

/**
 * Given a collection of plugin names verifies this collection against
 * the blacklist. Invokes callback with an object:
 * [plugin name]=>[blacklisting reason]
 * or an empty object if none of the plugins to check are blacklisted.
 *
 * @param cb
 */
function getBlacklist(cb) {
  wreck.get(url, { json: true }, function (err, res, blacklist) {
    if (err) {
      return cb(err);
    }

    cb(null, blacklist);
  });
}

module.exports = getBlacklist;
