'use strict';

var captureLastRun = require('last-run').capture;
var releaseLastRun = require('last-run').release;

var metadata = require('./metadata');

var uid = 0;

function Storage(fn) {
  var meta = metadata.get(fn);

  this.fn = meta.orig || fn;
  this.uid = uid++;
  this.name = meta.name;
  this.branch = meta.branch || false;
  this.captureTime = Date.now();
  this.startHr = [];
}

Storage.prototype.capture = function() {
  captureLastRun(this.fn, this.captureTime);
};

Storage.prototype.release = function() {
  releaseLastRun(this.fn);
};

function createExtensions(ee) {
  return {
    create: function(fn) {
      return new Storage(fn);
    },
    before: function(storage) {
      storage.startHr = process.hrtime();
      ee.emit('start', {
        uid: storage.uid,
        name: storage.name,
        branch: storage.branch,
        time: Date.now(),
      });
    },
    after: function(result, storage) {
      if (result && result.state === 'error') {
        return this.error(result.value, storage);
      }
      storage.capture();
      ee.emit('stop', {
        uid: storage.uid,
        name: storage.name,
        branch: storage.branch,
        duration: process.hrtime(storage.startHr),
        time: Date.now(),
      });
    },
    error: function(error, storage) {
      if (Array.isArray(error)) {
        error = error[0];
      }
      storage.release();
      ee.emit('error', {
        uid: storage.uid,
        name: storage.name,
        branch: storage.branch,
        error: error,
        duration: process.hrtime(storage.startHr),
        time: Date.now(),
      });
    },
  };
}

module.exports = createExtensions;
