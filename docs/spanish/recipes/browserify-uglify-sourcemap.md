# Browserify + Uglify2 con sourcemaps

[Browserify](http://github.com/substack/node-browserify) se ha combertido en una herramienta importante e indispensable. Aunque tiene que ser evuelta en una función antes de que funcionar bien con gulp. 

Abajo hay una receta de cómo usar browserify con transformaciones y sources que resuelven a los archivos individuales originales.

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
        // Añade tareas de transformación aquí
        .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/js/'));
  };

  return bundle();
});
```
