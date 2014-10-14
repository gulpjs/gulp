# Browserify + Uglify2 con sourcemaps

[Browserify](http://github.com/substack/node-browserify) se ha convertido en una herramienta importante e imprescindible, pero es necesario crear una interfaz para trabajar con con gulp. A continuación una simple receta para usar Browserify con transformaciones y full sourcemaps que reproducen los archivos originales individualmente.

``` javascript
'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var getBundleName = function () {
  var version = require('./package.json').version;
  var name = require('./package.json').name;
  return version + '.' + name + '.' + 'min';
};

gulp.task('javascript', function() {

  var bundler = browserify({
    entries: ['./app.js'],
    debug: true
  });

  var bundle = function() {
    return bundler
      .bundle()
      .pipe(source(getBundleName() + '.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/js/'));
  };

  return bundle();
});
```
