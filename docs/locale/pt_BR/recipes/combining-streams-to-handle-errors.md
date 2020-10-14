# Combinando streams para manipular erros

Por padrão, emitir um erro em uma stream fará com que ele seja lançado, a não ser que haja um observador esperando por eventos do tipo `error`. Isso pode se tornar chatinho de lidar, quando trabalhamos com _pipelines_ de streams longas.

Usando [stream-combiner2](https://github.com/substack/stream-combiner2) você pode converter diversas streams em uma única stream, oquê significa que você só precisa observar eventos do tipo `error` em um único lugar do código.

Aqui, está um exemplo de uso, em um gulpfile:

```js
var combiner = require('stream-combiner2');
var uglify = require('gulp-uglify');
var gulp = require('gulp');

gulp.task('test', function() {
  return combiner.obj([
      gulp.src('bootstrap/js/*.js'),
      uglify(),
      gulp.dest('public/bootstrap')
    ])
    /* qualquer erro nas streams acima, será capturado
     * pelo observador, invés de ser lançado */
    .on('error', console.error.bind(console));
});
```
