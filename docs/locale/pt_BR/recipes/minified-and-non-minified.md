# Fazer output de uma versão minimizada e outra não minimizada (ao mesmo tempo)

O output de uma versão minimizada e outra não minimizada de seus arquivos JS combinados, pode ser feito usando `gulp-rename` e fazendo pipe para `dest` duas vezes: uma antes de minimizar e outra depois.

```js
'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var DEST = 'build/';

gulp.task('default', function() {
  return gulp.src('foo.js')
    // isso vai fazer output da versão não minimizada
    .pipe(gulp.dest(DEST))
    // isso vai minimizar e renomear o arquivo para foo.min.js
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(DEST));
});

```
