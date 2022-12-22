# Manipulando o evento Delete enquanto observa arquivos

Você pode esperar pela ativação de eventos `'unlink'`, usando o observador retornado pelo `gulp.watch`. Eles são ativados quando arquivos são removidos, para que você possa deletar o arquivo do diretório de destino, usando algo como isso:

```js
'use strict';

var del = require('del');
var path = require('path');
var gulp = require('gulp');
var header = require('gulp-header');
var footer = require('gulp-footer');

gulp.task('scripts', function() {
  return gulp.src('src/**/*.js', {base: 'src'})
    .pipe(header('(function () {\r\n\t\'use strict\'\r\n'))
    .pipe(footer('\r\n})();'))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function () {
  var watcher = gulp.watch('src/**/*.js', ['scripts']);

  watcher.on('unlink', function (filepath) {
    var filePathFromSrc = path.relative(path.resolve('src'), filepath);
    /* concatena o caminho absoluto da 'build', usado por
     * gulp.dest na tarefa "scripts" */
    var destFilePath = path.resolve('build', filePathFromSrc);
    del.sync(destFilePath);
  });
});
```
