# Uso de buffers

> La siguiente información es pertinente a plugins que manipulan buffers.

[Crear un plugin](README.md) > Uso de buffers

## Uso de buffers

Si tu plugin depende en una librería que maneje buffers, es probably que tu plugin prefiera manejar `file.contents` como buffer también. A continuación se presenta la implementación de un plugin que prepende texto a archivos:


```js
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// consts
const PLUGIN_NAME = 'gulp-prefixer';

// función principal del plugin (manejando archivos)
function gulpPrefixer(prefixText) {
  if (!prefixText) {
    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
  }

  prefixText = new Buffer(prefixText); // alocado por adelantado

  // crear un stream through por el que cada archivo va a pasar
  var stream = through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (file.isBuffer()) {
      file.contents = Buffer.concat([prefixText, file.contents]);
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

gulp.src('files/**/*.js')
  .pipe(gulpPrefixer('cadena a adjuntar!'))
  .pipe(gulp.dest('modified-files'));
```

## Manejando streams

Desafortunadamente, el plugin anterior falla al utilizar `gulp.src` en modo non-buffered (streaming). Es recomendable brindar soporte a streams si es posible. Ver [Uso de streams]((dealing-with-streams.md)) para más información.

## Algunos plugins basados en buffers

* [gulp-coffee](https://github.com/wearefractal/gulp-coffee)
* [gulp-svgmin](https://github.com/ben-eb/gulp-svgmin)
* [gulp-marked](https://github.com/lmtm/gulp-marked)
* [gulp-svg2ttf](https://github.com/nfroidure/gulp-svg2ttf)
