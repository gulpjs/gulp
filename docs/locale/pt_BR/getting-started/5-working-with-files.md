<!-- front-matter
id: working-with-files
title: Working with Files
hide_title: true
sidebar_label: Working with Files
-->

# Trabalhando com arquivos

Os métodos `src()` e `dest()` são expostos pelo gulp para interagirem com arquivos, sem seu computador.

`src()` recebe um [glob][explaining-globs-docs] para conseguir ler o sistema de arquivos e produzir uma [Node stream][node-streams-docs]. O método localiza todos os arquivos correspondentes ao _glob_ e lê eles na memória, para passar pela _stream_.

A _stream_ produzida por `src()` tem que ser retornada pela tarefa para sinalizar a conclusão assíncrona, como já foi falado em [Criando Tarefas][creating-tasks-docs].

```js
const { src, dest } = require('gulp');

exports.default = function() {
  return src('src/*.js')
    .pipe(dest('output/'));
}
```

A principal API de uma _stream_ é o método `.pipe()`, usado para encadeamento de transformações ou escrita de _streams_.

```js
const { src, dest } = require('gulp');
const babel = require('gulp-babel');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(dest('output/'));
}
```

`dest()` recebe uma string correspondente à um diretório de output e produz uma [Node stream][node-streams-docs] (normalmente, usada como uma _stream terminadora_).

Quando ele recebe um arquivo passado pela _pipeline_, escreve os conteúdos e outros detalhes no sistema de arquivos do diretório correspondente.

O método `symlink()` também está disponível para uso e funciona como o `dest()`, mas cria _links_ invés de arquivos (veja [`symlink()`][symlink-api-docs], para mais detalhes).

Geralmente, plugins são colocados entre `src()` e `dest()` (usando o método `.pipe()`) e fazem uma transformação nos arquivos da _stream_.

## Adicionando arquivos a stream

`src()` também pode ser usado no meio de uma _pipeline_, para adicionar arquivos a _stream_ com base nos _globs_ passados.

Os arquivos adicionais só ficam disponíveis para transformações na _stream_, depois.

Quando os [globs se sobrepõem][overlapping-globs-docs], os arquivos são adicionados novamente.

Isso pode ser útil para transpilar alguns arquivos, antes de adicionar arquivos JavaScript à _pipeline_ e _uglyficar_ tudo.

```js
const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(uglify())
    .pipe(dest('output/'));
}
```

## Output por partes

`dest()` pode ser usado no meio de uma _pipeline_ para criar estados intermediários no sistema de arquivos.

Quando um arquivo é recebido: o atual estado é escrito no sistema de arquivos, o _path_ é atualizado para refletir a nova localização do arquivo do output e, então, esse arquivo é passado para o resto da _pipeline_.

Esse recurso pode ser útil para criar arquivos _minificados_ e não _minificados_, ao mesmo tempo (usando a mesma _pipeline_).

```js
const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(dest('output/'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('output/'));
}
```

## Modos: streaming, buffered e empty

`src()` pode funcionar de três modos: _buffering_, _streaming_ e _empty_. Isso é configurado usando as [opções][src-options-api-docs] `buffer` and `read`, em `src()`.

* O modo _buffering_ é o padrão e carrega o conteúdo do arquivo na memória. Geralmente, os plugins funcionam neste modo e não suportam o modo _streaming_.
* Já o modo _streaming_ existe, principalmente, para operar em arquivos grandes que não cabem na memória (tipo filmes e images grandes). Os conteúdos são _streamados_ à partir do sistema de arquivos, em pequenas partes (invés de carregar tudo de uma vez). Se precisar deste modo, procure por um plugin que suporte ele ou faça o seu próprio.
* O modo _empty_ não contém conteúdos e é útil quando se trabalha com metadado de arquivos.

[explaining-globs-docs]: ../getting-started/6-explaining-globs.md
[creating-tasks-docs]: ../getting-started/3-creating-tasks.md
[overlapping-globs-docs]: ../getting-started/6-explaining-globs.md#overlapping-globs
[node-streams-docs]: https://nodejs.org/api/stream.html
[symlink-api-docs]: ../api/symlink.md
[src-options-api-docs]: ../api/src.md#options
