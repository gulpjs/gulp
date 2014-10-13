# Pruebas

> Probar tus plugins es una manera efectiva de garantizar calidad que inspira confianza en tus usuarios y te simplifica el trabajo.

[Crear un plguin](README.md) > Pruebas

## Herramientas

La mayoría de los plugins usan [mocha](https://github.com/visionmedia/mocha) y [event-stream](https://github.com/dominictarr/event-stream) para ayudar con las pruebas. Los siguientes ejemplos hacen uso de estas herramientas.

## Probando plugins para modo streaming

```js
var assert = require('assert');
var es = require('event-stream');
var File = require('vinyl');
var prefixer = require('../');

describe('gulp-prefixer', function() {
  describe('in streaming mode', function() {

    it('should prepend text', function(done) {

      // crear el archivo dummy
      var fakeFile = new File({
        contents: es.readArray(['stream', 'with', 'those', 'contents'])
      });

      // Crea un stream del plugin prefixer
      var myPrefixer = prefixer('prependthis');

      // escribe el archivo dummy en el stream
      myPrefixer.write(fakeFile);

      // espera que el archivo sea retornado
      myPrefixer.once('data', function(file) {
        // asegura de que retorna también un stream
        assert(file.isStream());

        // buffer el contenido para asegurar de que fue modificado
        file.contents.pipe(es.wait(function(err, data) {
          // verifica el contenido
          assert.equal(data, 'prependthisstreamwiththosecontents');
          done();
        }));
      });

    });

  });
});
```

## Probando plugins para modo buffer

```js
var assert = require('assert');
var es = require('event-stream');
var File = require('vinyl');
var prefixer = require('../');

describe('gulp-prefixer', function() {
  describe('in buffer mode', function() {

    it('should prepend text', function(done) {

      // crea el archivo dummy
      var fakeFile = new File({
        contents: new Buffer('abufferwiththiscontent')
      });

      // Create a prefixer plugin stream
      var myPrefixer = prefixer('prependthis');

      // escribe el archivo dummy en el buffer
      myPrefixer.write(fakeFile);

      // espera que el archivo sea retornado
      myPrefixer.once('data', function(file) {
        // asegura de que retorna también un buffer
        assert(file.isBuffer());

        // verifica el contenido
        assert.equal(file.contents.toString('utf8'), 'prependthisabufferwiththiscontent');
        done();
      });

    });

  });
});
```

## Ejemplos de pruebas

* [gulp-cat](https://github.com/ben-eb/gulp-cat/blob/master/test.js)
