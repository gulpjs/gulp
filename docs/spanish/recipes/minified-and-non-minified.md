# Escribir una version minificada y no minificada a la vez

Escribir una version minificada y no minificada de tu JavaScript combiando puede conseguir usando `gulp-rename` y luego pasando los archivos a través de `dest` dos veces (una antes de minificar y otra después minificar):

```js
'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var DEST = 'build/';

gulp.task('default', function() {
  return gulp.src('foo.js')
    // Lo que creara la versión no minificada
    .pipe(gulp.dest(DEST))
    // Lo que minificará y renombrara el foo.js
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(DEST));
});

```
