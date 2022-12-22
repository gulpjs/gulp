# Browserify + Globs (diversos destinos)

Esse exemplo mostra como configurar uma tarefa que faz _bundle_ de vários _entry points_, em vários diretórios de destino (usando browserify).

A tarefa `js`, abaixo, faz _bundle_ de todos os arquivos `.js` dentro de `src/` e coloca os resultados em `dest/`.


```js
var gulp = require('gulp');
var browserify = require('browserify');
var log = require('gulplog');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('js', function () {

  /* não precisa ler arquivos, porque browserify já 
   * faz isso */
  return gulp.src('src/**/*.js', {read: false}) 

    /* transforma objetos de arquivos, usando o 
     * plugin gulp-tap */
    .pipe(tap(function (file) {

      log.info('bundling ' + file.path);

      /* substitua o conteúdo de arquivos, usando o bundle
       * stream do browserify */
      file.contents = browserify(file.path, {debug: true}).bundle();

    }))

    /* transforme streaming contents, em buffer contents 
     * (porque gulp-sourcemaps não suporta streaming contents) */
    .pipe(buffer())

    // carrega e inicializa sourcemaps
    .pipe(sourcemaps.init({loadMaps: true}))

    .pipe(uglify())

    // escreve sourcemaps
    .pipe(sourcemaps.write('./'))

    .pipe(gulp.dest('dest'));

});
```
