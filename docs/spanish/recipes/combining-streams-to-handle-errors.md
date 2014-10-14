# Combinar streams que saben de erores

Por defecto, emitir un error en un stream probocará una exepción en tu programa a no ser que haya un listener colocado escuchando al evento `error`. Esta situación se puede complicar cuando estas trabajando con procesos más y más largos.

Usando [multistream](https://github.com/feross/multistream) puedes comvertir una sucesión de streams en sólo uno, lo que quiere decir que sólo hay que escuchar al evento error de este último stream en un lugar de tu código.

He aquí un ejemplo usándolo en un gulpfile:

```js
var Multistream = require('multistream');
var uglify = require('gulp-uglify');
var gulp = require('gulp');

gulp.task('test', function() {
  var combined = Multistream([
    gulp.src('bootstrap/js/*.js'),
    uglify(),
    gulp.dest('public/bootstrap')
  ]);

  // errores en el stream de arriba serán recogidos
  // por este listener, en lugar de probocar una excepción
  combined.on('error', console.error.bind(console));

  return combined;
});
```
