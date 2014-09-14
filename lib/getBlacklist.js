'use strict';

var wreck = require('wreck');

var url = 'http://gulpjs.com/plugins/blackList.json';

function getBlacklist(cb) {
  wreck.get(url, { json: true }, function (err, res, blacklist) {
    if (err) {
      return cb(err);
    }

    cb(null, blacklist);
  });
}

module.exports = getBlacklist;
