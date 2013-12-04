var realBase = require('gulp-util').realBase;

function File(base, path) {
  this.base = base;
  this.path = path;

  // other fields are
  // stats = fs stats object
  // contents = stream, buffer, or null if not read

  this.__defineGetter__("shortened", function(){
    return realBase(this.base, this.path);
  });
}

module.exports = File;