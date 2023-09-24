'use strict';

var retrieveLastRun = require('last-run');

var metadata = require('./helpers/metadata');

function lastRun(task, timeResolution) {
  if (timeResolution == null) {
    timeResolution = process.env.UNDERTAKER_TIME_RESOLUTION;
  }

  var fn = task;
  if (typeof task === 'string') {
    fn = this._getTask(task);
  }

  var meta = metadata.get(fn);

  if (meta) {
    fn = meta.orig || fn;
  }

  return retrieveLastRun(fn, timeResolution);
}

module.exports = lastRun;
