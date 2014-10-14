# Combinar streams para manejar excepciones

Por defecto, emitir un error en un stream genera una excepción al menos que ya tenga una función de callback escuchando por el evento `error`. Esto se torna ligeramente complicado al trabajar con conexiones complejas de streams.

Usando [multistream](https://github.com/feross/multistream) es posible convertir una serie de streams en uno solo, por lo que solo es necesario escuchar por el `error` en un solo lugar del código.

A continuación un ejemplo usando multistream en un gulpfile.


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

  // cualquier error en el stream anterior puede ser manejado a
  // través de la siguiente función en vez de generar una excepción
  combined.on('error', console.error.bind(console));

  return combined;
});
```
