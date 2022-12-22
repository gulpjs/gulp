# Testes

> Testar seu plugin é a única forma de garantir sua qualidade. Além disso, também gera confiança de seus usuários e facilita sua vida.

[Escrevendo seu Plugin](README.md) > Testes

## Ferramentas

Maioria dos plugins usam [mocha](https://github.com/mochajs/mocha), [should](https://github.com/shouldjs/should.js) e [event-stream](https://github.com/dominictarr/event-stream) para auxiliar nos testes. Os exemplos a seguir usam essas ferramentas.


## Testando plugins para o modo de streaming

```js
var assert = require('assert');
var es = require('event-stream');
var File = require('vinyl');
var prefixer = require('../');

describe('gulp-prefixer', function() {
  describe('in streaming mode', function() {

    it('should prepend text', function(done) {

      // criando o arquivo falso 
      var fakeFile = new File({
        contents: es.readArray(['stream', 'with', 'those', 'contents'])
      });

      // Crie uma stream de prefixador do plugin
      var myPrefixer = prefixer('prependthis');

      // escreva o arquivo falso à stream
      myPrefixer.write(fakeFile);

      // wait for the file to come back out
      // aguarde pelo processamento do arquivo
      myPrefixer.once('data', function(file) {
        // garanta que ele saiu da mesma forma que entrou
        assert(file.isStream());

        // prepara o conteúdo, para garantir que ele tenha sido prefixado
        file.contents.pipe(es.wait(function(err, data) {
          // checando o conteúdo
          assert.equal(data, 'prependthisstreamwiththosecontents');
          done();
        }));
      });
    });
  });
});
```


## Testando plugins para o modo de buffer

```js
var assert = require('assert');
var es = require('event-stream');
var File = require('vinyl');
var prefixer = require('../');

describe('gulp-prefixer', function() {
  describe('in buffer mode', function() {

    it('should prepend text', function(done) {

      // cria o arquivo falso
      var fakeFile = new File({
        contents: new Buffer('abufferwiththiscontent')
      });

      // Criando uma stream do plugin prefixador
      var myPrefixer = prefixer('prependthis');

      // escreva o arquivo falso à stream
      myPrefixer.write(fakeFile);

      // aguarda o retorno do arquivo
      myPrefixer.once('data', function(file) {
        // garante que ele saiu da mesma forma que entrou
        assert(file.isBuffer());

        // checa o conteúdo
        assert.equal(file.contents.toString('utf8'), 'prependthisabufferwiththiscontent');
        done();
      });
    });
  });
});
```

## Alguns plugins com testes de alta qualidade

* [gulp-cat](https://github.com/ben-eb/gulp-cat/blob/master/test.js)
* [gulp-concat](https://github.com/contra/gulp-concat/blob/master/test/main.js)
