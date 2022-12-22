# Browserify + Globs

[Browserify + Uglify2](https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md)  mostra como configurar uma tarefa básica para fazer _bundle_ de um arquivo JavaScript e suas dependências e minimizar o _bundle_ com UglifyJS, enquato preservamos sourcemaps. Essa página não mostra como usar gulp e Browserify com múltiples _entry files_, no entanto.

Veja também: a receita de [Combinar Streams para Lidar com Erros](https://github.com/gulpjs/gulp/blob/master/docs/recipes/combining-streams-to-handle-errors.md) e entenda como lidar com erros usando browserify ou uglify, em sua stream.

``` javascript
'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');
var log = require('gulplog');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var reactify = require('reactify');

gulp.task('javascript', function () {
  /* gulp espera que tarefas retornem uma stream, então, 
   * criamos uma aqui */
  var bundledStream = through();

  bundledStream
    /* converte a stream do output bundle em uma stream
     * contendo os atributos regulares que o plugin
     * gulp espera */
    .pipe(source('app.js'))
    // o resto da tarefa, como você faria normalmente...
    // aqui, só estamos copiando a receita Browserify + Uglify2.
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // adicione plugins gulp à pipeline, aqui.
      .pipe(uglify())
      .on('error', log.error)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));

  /* "globby" substitui "gulp.src", enquanto Browserify
   * cria sua própria stream de leitura. */
  globby(['./entries/*.js']).then(function(entries) {
    // cria a instância do Browserify.
    var b = browserify({
      entries: entries,
      debug: true,
      transform: [reactify]
    });

    /* faz pipe da stream do Browserify, adentro da stream
     * que nós criamos antes.
     * isso vai iniciar nossa pipeline. */
    b.bundle().pipe(bundledStream);
  }).catch(function(err) {
    // certifique-se de lidar com qualquer erro vindo do globby
    bundledStream.emit('error', err);
  });

  /* finalmente, retornaremos a stream para gulp saber
   * quando a tarefa conclui */
  return bundledStream;
});
```
