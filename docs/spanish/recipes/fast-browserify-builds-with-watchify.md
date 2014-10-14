# Procesos browserify rápidos con watchify

A medida que un projecto [browserify](http://github.com/substack/node-browserify) comienza a expandirse, su tiempo de proceso, poco a poco, va aumentando lentamente con el tiempo. Aunque puede empezar por 1 segundo, es posible estar esperando 30 segundos para que el projecto termine de procesarse en en casos en los que este es particularmente grande.

Esto es por lo que [substack](http://github.com/substack) escribió [watchify](http://github.com/substack/watchify), un procesador browserify persistente que observa cómo cambian los archivos y *solo procesa lo que necesita*. De esta forma, el primer procesados puede que siga tardando 30 segundos, pero los siguientes pueden tardar menos de 100ms lo que es un gran mejora.

Watchify no tiene un gulp plugin, pero no lo necesita: puedes usar [vinyl-source-stream](http://github.com/hughsk/vinyl-source-stream) para canalizar el stream a línea de proceso gulp.

``` javascript
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');

gulp.task('watch', function() {
  var bundler = watchify(browserify('src/index.js', watchify.args));

  // Opcionalmente, puedes aplicar transformaciones
  // y otras opciones de configuración al procesado
  // como sueles poder hacer con browserify
  bundler.transform('brfs');

  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // logear errores si ocurren
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./dist'));
  }

  return rebundle();
});
```
