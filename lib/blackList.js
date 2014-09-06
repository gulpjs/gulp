'use strict';

var http = require('http');

/**
 * Given a collection of plugin names verifies this collection against
 * the black-list. Invokes callback with an object:
 * [plugin name]=>[black-listing reason]
 * or undefined if none of the plugins to check is black-listed.
 *
 * @param pluginsToVerify - an array of plugin names to verify
 * @param cb
 */
module.exports = function (pluginsToVerify, cb) {
  http.get('http://gulpjs.com/plugins/blackList.json', function (res) {
    var blackListJSONStr = '';

    res.on('data', function (chunk) {
      blackListJSONStr += chunk;
    });

    res.on('end', function () {
      var blackList = JSON.parse(blackListJSONStr);
      var result = pluginsToVerify.reduce(function(blackListed, pluginName) {
        if (blackList[pluginName]) {
          blackListed = blackListed || {};
          blackListed[pluginName] = blackList[pluginName];
          return blackListed;
        }
      });
      cb(null, result);
    });

  }).on('error', function (e) {
    cb(e);
  });
};
