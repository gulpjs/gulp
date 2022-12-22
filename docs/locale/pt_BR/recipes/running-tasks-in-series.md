# Executando tarefas em série

Por padrão, Gulp CLI executa tarefas em concorrência máxima. Isso quer dizer que Gulp roda todas de uma vez e não espera por nada.

Se quiser criar um série, onde tarefas executam em uma ordem específica: você deve usar `gulp.series`.

```js
var gulp = require('gulp');
var doAsyncStuff = require('./stuff');

gulp.task('one', function(done) {
  doAsyncStuff(function(err){
      done(err);
  });
});

gulp.task('two', function(done) {
  // faça alguma coisa qualquer, aqui
  done();
});

gulp.task('default', gulp.series('one', 'two'));
```

Outro exemplo, usando um padrão de dependência: ele usa [`async-once`](https://www.npmjs.com/package/async-once) para rodar operações da tarefa `clean`, uma vez só:

```js
var gulp = require('gulp');
var del = require('del'); // rm -rf
var once = require('async-once');

gulp.task('clean', once(function(done) {
  // só roda uma vez.
  // para a próxima invocação da tarefa clean:
  // vai invocar done com os mesmos argumentos da primeira invocação.
  del(['output'], done);
}));

gulp.task('templates', gulp.series('clean', function() {
  return gulp.src(['src/templates/*.hbs'])
    // faz algumas concatenações, minimizações, etc.
    .pipe(gulp.dest('output/templates/'));
}));

gulp.task('styles', gulp.series('clean', function() {
  return gulp.src(['src/styles/app.less'])
    // faz algumas concatenações, minimizações, etc.
    .pipe(gulp.dest('output/css/app.css'));
}));

/* templates e styles serão processadas, em paralelo.
 *
 * `clean` finalizará antes das duas tarefas anteriores.
 *
 * As operações de `clean` não serão executadas duas vezes, 
 * apesar de serem invocadas como dependências, duas vezes. */
gulp.task('build', gulp.parallel('templates', 'styles'));

// um alias.
gulp.task('default', gulp.parallel('build'));
```

Note que isso é um anti-padrão em Gulp 4 e os logs mostrarão a tarefa `clean` rodando duas vezes.

Invés disso, as tarefas `templates` e `style` devem usar tarefas `clean:*` dedicadas:

```js
var gulp = require('gulp');
var del = require('del');

gulp.task('clean:templates', function() {
  return del(['output/templates/']);
});

gulp.task('templates', gulp.series('clean:templates', function() {
  return gulp.src(['src/templates/*.hbs'])
    .pipe(gulp.dest('output/templates/'));
});

gulp.task('clean:styles', function() {
  return del(['output/css/']);
});

gulp.task('styles', gulp.series('clean:styles', function() {
  return gulp.src(['src/styles/app.less'])
    .pipe(gulp.dest('output/css/app.css'));
}));

gulp.task('build', gulp.parallel('templates', 'styles'));
gulp.task('default', gulp.parallel('build'));
```
