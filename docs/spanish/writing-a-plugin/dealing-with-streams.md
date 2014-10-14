# Uso de streams

> Es altamente recomendable hacer plugins que soporten streams. Aquí hay alguna información relacionada con la creación de un gulp plugin que da soporte a streams

> Asegúrate de seguir las méjores prácticas con respecto a manejo de excepciones e inlcuya la linea que permita al gulp plugin volver a emitir el primer error capturado durante la transformación del contenido.

[Creando un plugin](README.md) > Writing stream based plugins

## Uso de streams

Vamos a implementar un plugin que añada texto al principio de archivos. Este plugin da soporte a todas las formas de file.contents.

```js
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// constantes
const PLUGIN_NAME = 'gulp-prefixer';

function prefixStream(prefixText) {
  var stream = through();
  stream.write(prefixText);
  return stream;
}

// función principal del plugin (manejando archivos)
function gulpPrefixer(prefixText) {
  if (!prefixText) {
    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
  }

  prefixText = new Buffer(prefixText); // cargar en memoria por adelantado

  // creando un stream por el que cada archivo pasará
  var stream = through.obj(function(file, enc, cb) {
    if (file.isBuffer()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
      return cb();
    }

    if (file.isStream()) {
      // definir el streamer que transformará el contenido
      var streamer = prefixStream(prefixText);
      // capturar errores del streamer y emitir un gulp plugin error
      streamer.on('error', this.emit.bind(this, 'error'));
      // empezar la transformación
      file.contents = file.contents.pipe(streamer);
    }

    // asegúrate que archivo pase a través del siguiente plugin
    this.push(file);
    // indicar al motor de streams que hemos terminado con este archivo
    cb();
  });

  // devolver el stream de archivos
  return stream;
};

// exportando la función principal del plugin
module.exports = gulpPrefixer;
```

El plugin anterior se puede usar tal que así:

```js
var gulp = require('gulp');
var gulpPrefixer = require('gulp-prefixer');

gulp.src('files/**/*.js', { buffer: false })
  .pipe(gulpPrefixer('prepended string'))
  .pipe(gulp.dest('modified-files'));
```

## Algunos plugins usando streams

* [gulp-svgicons2svgfont](https://github.com/nfroidure/gulp-svgiconstosvgfont)
