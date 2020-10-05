<!-- front-matter
id: using-plugins
title: Using Plugins
hide_title: true
sidebar_label: Using Plugins
-->

# Usando Plugins

Os plugins do gulp são [Transformadores de Node Streams][through2-docs] que encapsulam comportamentos comuns, para transformar arquivos numa uma pipeline. Geralmente, são colocados entre `src()` e `dest()`, usando o método `.pipe()`. Eles podem alterar nome, metadados ou conteúdo de qualquer arquivo que passa pela _stream_.

Plugins do registro npm (usando as palavras-chaves: "gulpplugin" e "gulpfriendly"), podem ser pesquisados e explorados na [página de pesquisa de plugins][gulp-plugin-site].

Plugins são desenvolvidos para se encarregarem de poucas responsabilidades, para que você possa juntar diferentes plugins e criar algo maior. Aliás, você vai acabar precisando combinar vários, afim de conseguir algum resultado específico.

```js
const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

exports.default = function() {
  return src('src/*.js')
    /* gulp-uglify não vai atualizar o nome do
     * arquivo, apenas minimizar o conteúdo */
    .pipe(uglify())
    /* então, você dá essa responsabilidade para
     * outro plugin que vai alterar a extensão: gulp-rename */
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('output/'));
}
```

## Realmente precisa de plugin?

Nem tudo exige plugins, no gulp. Eles são bons para dar o ponta pé incial, mas muitas operações executam melhor quando usamos módulos ou bibliotecas.

```js
const { rollup } = require('rollup');

/* a API de promise do Rollup funciona muito bem,
 * em tarefas assíncronas */
exports.default = async function() {
  const bundle = await rollup({
    input: 'src/index.js'
  });

  return bundle.write({
    file: 'output/bundle.js',
    format: 'iife'
  });
}
```

Plugins devem sempre transformar arquivos. Use módulos e bibliotecas (que não sejam plugins), para qualquer outra tarefa.

```js
const del = require('delete');

exports.default = function(cb) {
  // use o módulo `delete` mesmo, invés de gulp-rimraf
  del(['output/*.js'], cb);
}
```
## Plugins condicionais

Já que as operações de plugins não devem ter ciência dos tipos dos arquivos, você pode precisar de um plugin como [gulp-if][gulp-if-package]: para transformar sub-conjuntos de arquivos.

```js
const { src, dest } = require('gulp');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');

function isJavaScript(file) {
  // confere se a extensão é '.js'
  return file.extname === '.js';
}

exports.default = function() {
  // coloque arquivos JS e CSS, em uma única pipeline
  return src(['src/*.js', 'src/*.css'])
    /* então: você pode escolher usar 
     * gulp-uglify, apenas em arquivos JS */
    .pipe(gulpif(isJavaScript, uglify()))
    .pipe(dest('output/'));
}
```

## Plugins inline

Plugins _inline_ são: transformadores de _stream_ casuais que você define no seu gulpfile, programando o comportamento desejado.

Existem dois tipos de situações, onde criar um plugin _inline_ pode ser útil:
* Invés de criar e manter seu próprio plugin;
* Invés de fazer _fork_ em algum plugin existente, afim de adicionar algum recurso desejado.

```js
const { src, dest } = require('gulp');
const uglify = require('uglify-js');
const through2 = require('through2');

exports.default = function() {
  return src('src/*.js')
    // invés de usar gulp-uglify, você pode usar um plugin inline
    .pipe(through2.obj(function(file, _, cb) {
      if (file.isBuffer()) {
        const code = uglify.minify(file.contents.toString())
        file.contents = Buffer.from(code.code)
      }
      cb(null, file);
    }))
    .pipe(dest('output/'));
}
```

[gulp-plugin-site]: https://gulpjs.com/plugins/
[through2-docs]: https://github.com/rvagg/through2
[gulp-if-package]: https://www.npmjs.com/package/gulp-if
