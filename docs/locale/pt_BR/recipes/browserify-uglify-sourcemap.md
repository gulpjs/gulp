# Browserify + Uglify2 com sourcemaps

[Browserify](https://github.com/browserify/browserify) se tornou uma ferramenta importante e indispensável, mas requer que seja envolvida em algo, para trabalhar bem com o gulp. Abaixo, temos uma receita simples para usar Browserify com sourcemaps que resolvem de volta aos arquivos originais.

Veja também: a receita de [Combinar Streams para Lidar com Erros](https://github.com/gulpjs/gulp/blob/master/docs/recipes/combining-streams-to-handle-errors.md) e entenda como lidar com erros usando browserify ou uglify, em sua stream.

Um simples arquivo `gulpfile.js` para usar Browserify + Uglify2 com sourcemaps:

``` javascript
'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var log = require('gulplog');

gulp.task('javascript', function () {
  // configure uma instância do browserify, em uma tarefa
  var b = browserify({
    entries: './entry.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // adicione tarefas de transformação à pipeline, aqui
        .pipe(uglify())
        .on('error', log.error)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});
```
