var realBase = require('gulp-util').realBase;

function File(file) {
  this.cwd = file.cwd;
  this.base = file.base;
  this.path = file.path;

  // other fields are
  // stat = fs stats object
  // contents = stream, buffer, or null if not read

  this.__defineGetter__("relative", function(){
    return realBase(this.base, this.path);
  });
}

module.exports = File;