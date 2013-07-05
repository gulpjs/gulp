var fs = require('fs');

module.exports = function (fname, cb) {
  fs.readFile(fname, function (err, data) {
    if (err) return cb(err);
    cb(null, {
      path: fname,
      contents: data
    });
  });
};