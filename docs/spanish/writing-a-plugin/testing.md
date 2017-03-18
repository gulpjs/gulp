# Tests

> Testear tus plugins es la única manera de asegurar calidad. Da confianza a tus usuarios y hace tu vida más fácil.

[Creando un plugin](README.md) > Tests

## Herramientas

La mayoría de los plugins usan [mocha](https://github.com/visionmedia/mocha) y [event-stream](https://github.com/dominictarr/event-stream) ayudándoles con los tests. Los siguientes ejemplos usarán estas herramientas.

## Test streaming mode en plugins

```js
var assert = require('assert');
var es = require('event-stream');
var File = require('vinyl');
var prefixer = require('../');

describe('gulp-prefixer', function() {
  describe('in streaming mode', function() {

    it('should prepend text', function(done) {

      // crear el archivo de prueba
      var fakeFile = new File({
        contents: es.readArray(['stream', 'with', 'those', 'contents'])
      });

      // Crea un stream del prefixer plugin
      var myPrefixer = prefixer('prependthis');

      // escribe el archivo de prueba en el stream
      myPrefixer.write(fakeFile);

      // esperar a que el archivo se haya escrito 
      myPrefixer.once('data', function(file) {
        // asegurarse de que vuelve de la forma que entró
        assert(file.isStream());

        // cargar el contenido para asegurarse de que
        // se añadió al princpio del archivo
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

## Testeando plugins con buffer mode

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

## Ejemplos de tests

* [gulp-cat](https://github.com/ben-eb/gulp-cat/blob/master/test.js)
