# Compartilhando streams usando fábricas de stream

Se você usa os mesmos plugins em várias tarefas, você pode se encontrar querendo implementar o princípio DRY.

Usando o método que será descrito, você poderá criar fábricas de _streams_ para modularizar suas cadeias de streams mais recorrentes.

Para alcançarmos nosso objetivo, vamos usar [lazypipe](https://github.com/OverZealous/lazypipe).

Este é nosso arquivo de exemplo:

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

Depois de usar lazypipe, nosso arquivo vai ficar parecido com isso:

```js
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var coffee = require('gulp-coffee');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var lazypipe = require('lazypipe');

// dá o lazypipe
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

Perceba que nós modularizamos nossa _pipeline_ JavaScript (JSHint + Uglify) que estava sendo reusada em várias tarefas, criando uma fábrica.

Essas fábricas podem ser usadas, em quantas tarefas você quiser. Também é possível aninhar fábricas, além de criar cadeias, para obter um código melhor.

Modularizar cada pipeline compartilhada também te permite ter um só local para fazer modificações, caso precise mudar seu workflow.
