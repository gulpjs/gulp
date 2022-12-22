# Usando buffers

> Aqui você encontra informações sobre a criação de um plugin gulp que manipula buffers.

[Escrevendo um plugin](README.md) > Usando buffers

## Usando buffers
Caso seu plugin seja dependente de uma biblioteca baseada em buffers, você provavelmente irá decidir basear seu plugin no uso de file.contents como um buffer.
Vamos implementar o plugin prefixando algum texto aos arquivos.

```js
var through = require('through2');
var PluginError = require('plugin-error');

// consts
const PLUGIN_NAME = 'gulp-prefixer';

// Função básica do plugin (lidando com os arquivos)
function gulpPrefixer(prefixText) {
  if (!prefixText) {
    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
  }

  prefixText = new Buffer(prefixText); // alocando antecipadamente

  // Criando uma stream por onde cada arquivo irá passar
  var stream = through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (file.isBuffer()) {
      file.contents = Buffer.concat([prefixText, file.contents]);
    }

    // garantindo que o arquivo seja repassado ao próximo plugin gulp
    this.push(file);

    // avisa a engine de stream que encerramos o uso deste arquivo
    cb();
  });

  // retornando o stream de arquivos
  return stream;
};

// exportando a função principal do plugin
module.exports = gulpPrefixer;
```

O plugin acima pode ser usado da forma a seguir:

```js
var gulp = require('gulp');
var gulpPrefixer = require('gulp-prefixer');

gulp.src('files/**/*.js')
  .pipe(gulpPrefixer('prepended string'))
  .pipe(gulp.dest('modified-files'));
```

## Manuseando streams

Infelizmente, o plugin acima irá retornar um erro ao usar gulp.src no modo sem buffer (streaming). Você deveria suportar streams, se possível. Veja [Lidando com streams](dealing-with-streams.md) para mais informações.

## Alguns plugins baseados em buffers

* [gulp-coffee](https://github.com/contra/gulp-coffee)
* [gulp-svgmin](https://github.com/ben-eb/gulp-svgmin)
* [gulp-marked](https://github.com/lmtm/gulp-marked)
* [gulp-svg2ttf](https://github.com/nfroidure/gulp-svg2ttf)
