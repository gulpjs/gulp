# Refazendo builds incrementalmente e operando em todo o conjunto de arquivos

O problema em refazer builds incrementalmente é que, normalmente, você quer operar em _todos_ os arquivos processados, não apenas em arquivos individuais.

Por exemplo: você pode querer fazer _lint_ e _module-wrap_ só de arquivos que alteraram e, então, concatená-los aos arquivos que já passaram por esse processo. Isso é difícil, sem usar arquivos temporarários.

Para conseguir fazer isso, use [gulp-cached](https://github.com/wearefractal/gulp-cached) e [gulp-remember](https://github.com/ahaurw01/gulp-remember).

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
      // só passa pelos arquivos alterados
      .pipe(cached('scripts'))
      /* faça algumas coisas legais com os arquivos 
       * alterados, como usar jshint: */
      .pipe(jshint())
      .pipe(header('(function () {'))
      // também faça algum tipo de module wrapping
      .pipe(footer('})();'))
      // adicione de volta à stream, todos os arquivos
      .pipe(remember('scripts'))
      // faça coisas que exija todos os arquivos
      .pipe(concat('app.js'))
      .pipe(gulp.dest('public/'));
});

gulp.task('watch', function () {
  var watcher = gulp.watch(scriptsGlob, gulp.series('scripts')); // observa os mesmos arquivos em nossa tarefa "scripts"
  watcher.on('change', function (event) {
    if (event.type === 'deleted') {                   // se um arquivo for deletado, esquece ele
      delete cached.caches.scripts[event.path];       // a api de remoção do gulp-cached
      remember.forget('scripts', event.path);         // a api de remoção do gulp-remember
    }
  });
});
```
