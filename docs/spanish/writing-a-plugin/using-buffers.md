# Utilizando buffers

> Aquí encontrarás informacion acerca de cómo crear un gulp plugin que manipula buffers

[Creando un plugin](README.md) > Uso de buffers

## Usando buffers

Si tu plugin espera tener acceso a una librería que usa buffers, es probable que bases tu plugin alrededor de file.contents como buffer. Vamos a implementar un plugin que añada texto al princpio de archivos:


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

## Usando streams

Desafortunadamente, el plugin anterior fallará al utilizar `gulp.src` para non-buffered (streaming) mode. Debes de soportar streams también si es posible. Lee [Uso de streams]((dealing-with-streams.md)) para más información.

## Algunos plugins basados en buffers

* [gulp-coffee](https://github.com/wearefractal/gulp-coffee)
* [gulp-svgmin](https://github.com/ben-eb/gulp-svgmin)
* [gulp-marked](https://github.com/lmtm/gulp-marked)
* [gulp-svg2ttf](https://github.com/nfroidure/gulp-svg2ttf)
