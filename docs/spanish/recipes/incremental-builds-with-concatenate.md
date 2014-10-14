# Procesos incrementales, incluyendo conjuntos completos de archivos

El problema con los procesos incrementales es que normalmente quieres realizar operaciones sobre _todos_ los archivos procesados, no simplemente archivos individuales. Por ejemplo, puede que quieras usar jshint o crear un módulo sólo de los archivos que han cambiado, luego concatenarlo con otros ya código ya limpio y modularizado. Esto es difícil sin el uso de archivos temporales.

Usa [gulp-cached](https://github.com/wearefractal/gulp-cached) y [gulp-remember](https://github.com/ahaurw01/gulp-remember) para conseguirlo

```js
var gulp = require('gulp');
var header = require('gulp-header');
var footer = require('gulp-footer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var cached = require('gulp-cached');
var remember = require('gulp-remember');

var scriptsGlob = 'src/**/*.js';

gulp.task('scripts', function() {
  return gulp.src(scriptsGlob)
      .pipe(cached('scripts'))        // sólo lo archivos que cambian
      .pipe(jshint())                 // hacer algo con ellos
      .pipe(header('(function () {')) // e.g. jshint ^^^
      .pipe(footer('})();'))          // y algún tipo envolvente modular
      .pipe(remember('scripts'))      // devolver los archivos al stream
      .pipe(concat('app.js'))         // hacer algo con todos los archivos
      .pipe(gulp.dest('public/'));
});

gulp.task('watch', function () {
  var watcher = gulp.watch(scriptsGlob, ['scripts']); // observar los mismos archivos de tus tareas
  watcher.on('change', function (event) {
    if (event.type === 'deleted') {                   // si un archivo se elimina olvidarlo
      delete cached.caches.scripts[event.path];       // gulp-cached api 
      remember.forget('scripts', event.path);         // gulp-remember api
    }
  });
});
```
