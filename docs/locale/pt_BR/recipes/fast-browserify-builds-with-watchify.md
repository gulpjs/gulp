# Builds rápidas com browserify usando watchify

Na medida que um projeto [browserify](https://github.com/browserify/browserify) expande, o tempo para fazer bundle dele cresce mais e mais. Pode começar exigindo 1 segundo para fazer build, mas acabar te fazendo esperar 30 segundos em um projeto grande.

Por causa disso, o pessoal do [substack](https://github.com/substack) fez o [watchify](https://github.com/browserify/watchify): um _browserify bundler_ persistente que observa mudanças em arquivos e *só faz rebuild daquilo que é necessário*. Graças à isso, a primeira build ainda pode levar 30 segundos, mas as próximas podem levar menos de 100ms (oquê é uma grande melhoria).

Watchify não possui um plugin gulp e não precisa de um: você pode usar [vinyl-source-stream](https://github.com/hughsk/vinyl-source-stream) para fazer _pipe_ da stream do bundle, adentro de sua _pipeline_.

``` javascript
'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var log = require('gulplog');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');

// cria configurações customizadas para o browserify
var customOpts = {
  entries: ['./src/index.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// adicione transformações aqui
// por exemplo: b.transform(coffeeify);

// permite rodar `gulp js`, para fazer build do arquivo
gulp.task('js', bundle); 
// roda o bundler, depois de qualquer atualização
b.on('update', bundle);
// faz output de logs da build, no terminal
b.on('log', log.info);

function bundle() {
  return b.bundle()
    // cria log de erros, se ocorrer algum
    .on('error', log.error.bind(log, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // opcional: remova, se você não precisa fazer buffer do conteúdo de arquivos
    .pipe(buffer())
    // opcional: remova, se você não quer sourcemaps
    // loadMaps carrega os mapas à partir do arquivo browserify
    .pipe(sourcemaps.init({loadMaps: true}))
    // adicione tarefas de transformação à pipeline, aqui.
    .pipe(sourcemaps.write('./')) // cria o arquivo .map
    .pipe(gulp.dest('./dist'));
}
```
