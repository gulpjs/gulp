# Compartiendo streams con fábricas de streams

Si usas los mismos plugins una y otra vez en en diferentes tareas es posible que te encuentres [DRY](http://es.wikipedia.org/wiki/No_te_repitas) a ti mismo. Este método te permitirá crear fábricas para separar tus usos más comunes.

Usaremos [lazypipe](https://github.com/OverZealous/lazypipe).

Este es nuestro archivo de ejemplo:

```js
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var coffee = require('gulp-coffee');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('bootstrap', function() {
  return gulp.src('bootstrap/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(gulp.dest('public/bootstrap'));
});

gulp.task('coffee', function() {
  return gulp.src('lib/js/*.coffee')
    .pipe(coffee())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});
```

que tras lazypipe viene a ser:

```js
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var coffee = require('gulp-coffee');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var lazypipe = require('lazypipe');

// give lazypipe
var jsTransform = lazypipe()
  .pipe(jshint)
  .pipe(jshint.reporter, stylish)
  .pipe(uglify);

gulp.task('bootstrap', function() {
  return gulp.src('bootstrap/js/*.js')
    .pipe(jsTransform())
    .pipe(gulp.dest('public/bootstrap'));
});

gulp.task('coffee', function() {
  return gulp.src('lib/js/*.coffee')
    .pipe(coffee())
    .pipe(jsTransform())
    .pipe(gulp.dest('public/js'));
});
```

Puedes ver que hemos separado nuestra cadena de procesado (pipeline) JavaScript (JSHint + Uglify), basada en varias tareas, a una fábrica. Estas fábricas pueden ser usadas tantas veces como se quiera. Tambien puedes anidar y encadenar fábricas para crear interesantes resultados. Separar cadenas de procesado compartidas tambien te da un lugar central donde modificar si decides cambiar tu forma de funcionar.
