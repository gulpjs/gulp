# Escrevendo um plugin

Se você planeja criar seu próprio plugin gulp, você irá poupar tempo lendo a documentação completa.

* [Diretrizes](guidelines.md) (a MUST read)
* [Usando buffers](using-buffers.md)
* [Lidando com streams](dealing-with-streams.md)
* [Testes](testing.md)

## O que é feito

### Streaming com arquivos objeto

Um plugin gulp sempre retorna um stream em [modo objeto](https://nodejs.org/api/stream.html#stream_object_mode) que faz o seguinte:

1. Recebe [vinyl File objects](https://github.com/gulpjs/vinyl)
2. Retorna [vinyl File objects](https://github.com/gulpjs/vinyl) (via `transform.push()` e/ou a função callback do plugin)

Esses objetos são conhecidos como [streams](https://nodejs.org/api/stream.html#stream_class_stream_transform_1)
(de vez em quando, também chamados streams).

"Correntes" de transformação são streams que são legíveis e graváveis; elas manipulam objetos conforme eles são passados.

Todos os plugins gulp são essencialmente semelhantes:
```js
var Transform = require('stream').Transform;

module.exports = function() {
  // Monkey patch Transform ou cria sua própria subclasse,
  // implementando ` transform()` e opcionalmente ` flush()`
  var transformStream = new Transform({objectMode: true});
  /**
   * @param {Buffer|string} file
   * @param {string=} encoding - ignorado se o arquivo contém um Buffer
   * @param {function(Error, object)} callback - chama essa função (opcionalmente usando * um argumento de erro e dados) quando o processamento da fatia fornecida for encerrado.
   * 
   */
  transformStream._transform = function(file, encoding, callback) {
    var error = null,
        output = doSomethingWithTheFile(file);
    callback(error, output);
  };

  return transformStream;
};
```

Alternativamente, você pode passar suas funções de transform e flush para o construtor `Transform` ou até mesmo extender `Transform` com classes ES6, como descrito na [documentação do Node.js](https://nodejs.org/docs/latest/api/stream.html#stream_implementing_a_transform_stream). No entanto, muitos plugins preferem usar o módulo [through2](https://github.com/rvagg/through2/) para simplificar seu código:

```js
var through = require('through2');    // npm install --save through2

module.exports = function() {
  return through.obj(function(file, encoding, callback) {
    callback(null, doSomethingWithTheFile(file));
  });
};
```

A stream retornada de `throught()` (e `this` proveniente da sua função de transform) é uma instância da classe [Transform](https://github.com/iojs/readable-stream/blob/master/lib/_stream_transform.js), a qual extende de [Duplex](https://github.com/iojs/readable-stream/blob/master/lib/_stream_duplex.js),
[Readable](https://github.com/iojs/readable-stream/blob/master/lib/_stream_readable.js)
(e parasiticamente de Writable) e por fim, [Stream](https://nodejs.org/api/stream.html).

Caso você precise parsear opções adicionais, você pode chamar a função `throught()` diretamente:

```js
  return through({objectMode: true /* other options... */}, function(file, encoding, callback) { ...
```

Opções suportadas incluem:

* highWaterMark (por padrão, até 16)
* defaultEncoding (por padrão, 'utf8')
* encoding - 'utf8', 'base64', 'utf16le', 'ucs2' etc.
    Caso especificado, o [StringDecoder](https://github.com/rvagg/string_decoder/blob/master/index.js) `decoder` será anexado à stream.
* legíveis {boolean}
* graváveis {boolean}
* allowHalfOpen {boolean} se definido para false, a stream irá automaticamente encerrar o lado legível quando o lado gravável terminar e vice versa.

### Modificando conteúdo de arquivos

O parâmetro de função que você passa para `through.obj()` é uma função [_transform](https://nodejs.org/api/stream.html#stream_transform_transform_chunk_encoding_callback), que irá operar no input `file`. Você também pode fornecer opcionalmente uma função [_flush](https://nodejs.org/api/stream.html#stream_transform_flush_callback), caso você precise emitir um pouco mais de dados ao final do stream.

Do interior de sua função transform, rode `this.push(file)` 0 ou mais vezes para passar o arquivo em frente junto a outros arquivos transformados ou clonados. Não é necessário rodar `this.push(file)` caso você providencie toda a saída para a função `callback()`.

Chame a função `callback` somente quando o arquivo atual (stream/buffer) estiver completamente consumido. Caso um erro seja encontrado, passe-o como o primeiro argumento para a callback, do contrário defina-o como nulo.
Se você passou todos os dados de saída para `this.push()`, omita o segundo argumento da callback.

Geralmente, um plugin gulp atualizaria `file.contents` e então escolheria entre:

Generally, a gulp plugin would update `file.contents` and then choose to either:

 - chamar `callback(null, file)`
 _ou_
 - realizar uma chamada para `this.push(file)`

Caso um plugin crie múltiplos arquivos a partir de um único arquivo de entrada, seriam necessárias múltiplas chamadas para `this.push()` - por exemplo:

```js
module.exports = function() {
  /**
   * @this {Transform}
   */
  var transform = function(file, encoding, callback) {
    var files = splitFile(file);
    this.push(files[0]);
    this.push(files[1]);
    callback();
  };

  return through.obj(transform);
};
```

O plugin [gulp-unzip](https://github.com/suisho/gulp-unzip/blob/master/index.js) fornece um bom exemplo de como realizar múltiplas chamadas para `push()`. O mesmo usa uma stream de chunk transform com uma função `_flush()` vinda do _interior_ da função de transformação Vinyl.

Os arquivos Vinyl possuem três formas possíveis para o atributo de conteúdo:

- [Streams](dealing-with-streams.md)
- [Buffers](using-buffers.md)
- Vazio (nulo) - Útil para rimraf, clean, onde contents não é necessário.

Um exemplo simples mostrando como detectar e lidar com cada formulário é fornecido abaixo; para uma explicação mais detalhada de cada proposta, entre nos links acima.

```js
var PluginError = require('plugin-error');

// consts
var PLUGIN_NAME = 'gulp-example';

module.exports = function() {
    return through.obj(function(file, encoding, callback) {
        if (file.isNull()) {
            // nada a fazer
            return callback(null, file);
        }

        if (file.isStream()) {
            // file.contents é uma Stream - https://nodejs.org/api/stream.html
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));

            // ou, caso você possa lidar com Streams:
            //file.contents = file.contents.pipe(...
            //return callback(null, file);
        } else if (file.isBuffer()) {
            // file.contents é uma Buffer - https://nodejs.org/api/buffer.html
            this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));

            // ou, caso você possa lidar com Buffers:
            //file.contents = ...
            //return callback(null, file);
        }
    });
};
```

Nota: Quando estiver analisando o código de outros plugins gulp (e o exemplo acima incluso), talvez você perceba que
a função transform irá retornar o resultado da callback:

```js
return callback(null, file);
```

...não se confunda - o gulp ignora qualquer valor retornado de sua função de transformação. O código acima é apenas uma abreviação de:

```js
if (someCondition) {
  callback(null, file);
  return;
}
// execução posterior...
```


## Recursos úteis

* [File object](https://github.com/gulpjs/vinyl)
* [PluginError](https://github.com/gulpjs/plugin-error)
* [through2](https://www.npmjs.com/package/through2)
* [bufferstreams](https://www.npmjs.com/package/bufferstreams)


## Plugins de amostra

* [sindresorhus' gulp plugins](https://github.com/search?q=%40sindresorhus+gulp-)
* [contra's gulp plugins](https://github.com/search?q=%40contra+gulp-)
* [gulp-replace](https://github.com/lazd/gulp-replace)


## Sobre streams

Caso não possua familiaridade com streams, é necessário ler os artigos a seguir:

* https://github.com/substack/stream-handbook (leitura ESSENCIAL)
* https://nodejs.org/api/stream.html

Outras bibliotecas que não manipulam arquivos via stream, porém são feitas para uso com gulp são tageadas com a keyword [gulpfriendly](https://npmjs.org/browse/keyword/gulpfriendly) no npm.
