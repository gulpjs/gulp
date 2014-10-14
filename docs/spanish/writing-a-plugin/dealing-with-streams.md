# Uso de streams

> Es recomendable crear plugins con soporte a streams. La siguiente información es pertinente a plugins que manipulan streams.

> Asegúrate de seguir las méjores prácticas con respecto a manejo de excepciones y añadir el código que permite a gulp re-emitir el primer error capturado durante la transformación del contenido.

[Crear un plugin](README.md) > Writing stream based plugins

## Uso de streams

A continuación se presenta la implementación de un plugin que prepende texto a archivos. Este plugin brinda soporte a todas las formas de `file.contents`.

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

  prefixText = new Buffer(prefixText); // alocado por adelantado

  // crear un stream through por el que cada archivo va a pasar
  var stream = through.obj(function(file, enc, cb) {
    if (file.isBuffer()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
      return cb();
    }

    if (file.isStream()) {
      // crea el streamer para transformar el contenido
      var streamer = prefixStream(prefixText);
      // maneja excepciones provenientes del streamer y emite un error
      streamer.on('error', this.emit.bind(this, 'error'));
      // inicia la transformación
      file.contents = file.contents.pipe(streamer);
    }

    // asegúrate de hacer el archivo disponible al siguiente plugin en la tubería
    this.push(file);

    // indica a gulp que hemos culminado de procesar el archivo
    cb();
  });

  // devuelve el stream
  return stream;
};

// exportando la función principal del plugin
module.exports = gulpPrefixer;
```

El plugin anterior puede ser usado de la siguiente manera:

```js
var gulp = require('gulp');
var gulpPrefixer = require('gulp-prefixer');

gulp.src('files/**/*.js', { buffer: false })
  .pipe(gulpPrefixer('prepended string'))
  .pipe(gulp.dest('modified-files'));
```

## Algunos plugins basados en streams

* [gulp-svgicons2svgfont](https://github.com/nfroidure/gulp-svgiconstosvgfont)
