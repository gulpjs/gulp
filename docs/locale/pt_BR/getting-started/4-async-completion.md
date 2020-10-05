<!-- front-matter
id: async-completion
title: Async Completion
hide_title: true
sidebar_label: Async Completion
-->

# Conclusão assíncrona

Bibliotecas node lidam com assincronidade, de várias formas. A maneira mais comum é com o padrão [_error-first callback_][node-api-error-first-callbacks], apesar de também existir [_streams_][stream-docs], [_promises_][promise-docs], [_event emitters_][event-emitter-docs], [_child processes_][child-process-docs] e [_observables_][observable-docs].

## Sinalizando conclusão de tarefa

Quando uma _stream_, _promise_, _event emitter_, _child process_ ou _observable_ é retornado por uma tarefa, o sucesso ou erro informa ao gulp para continuar ou finalizar. Se uma tarefa falha, o gulp vai parar imediatamente e mostrar o erro.

No caso de composição de tarefas com `series()`, um erro terminará a composição e mais nenhuma tarefa será executada.

Já em composição de tarefas com `parallel()`, um erro terminará a composição mas as outras tarefas paralelas terão a chance de concluir (ou não).

### Retornando uma stream

```js
const { src, dest } = require('gulp');

function streamTask() {
  return src('*.js')
    .pipe(dest('output'));
}

exports.default = streamTask;
```

### Retornando uma promise

```js
function promiseTask() {
  return Promise.resolve('o valor é ignorado');
}

exports.default = promiseTask;
```

### Retornando um event emitter

```js
const { EventEmitter } = require('events');

function eventEmitterTask() {
  const emitter = new EventEmitter();
  // emit() deve ser invocado de forma assíncrona, senão o gulp não estará esperando pelo evento
  setTimeout(() => emitter.emit('finish'), 250);
  return emitter;
}

exports.default = eventEmitterTask;
```

### Retornando um child process

```js
const { exec } = require('child_process');

function childProcessTask() {
  return exec('date');
}

exports.default = childProcessTask;
```

### Retornando um observable

```js
const { Observable } = require('rxjs');

function observableTask() {
  return Observable.of(1, 2, 3);
}

exports.default = observableTask;
```

### Usando um error-first callback

Se nada é retornado de sua tarefa, você tem que usar um `error-first callback` para sinalizar conclusão.

O _callback_ deve ser passado a sua tarefa como argumento único (`cb()` nos exemplos abaixo).

```js
function callbackTask(cb) {
  // `cb()` tem que ser invocado por alguma operação assíncrona
  cb();
}

exports.default = callbackTask;
```

Para dizer ao gulp que um erro ocorreu em uma tarefa que utiliza o padrão _error-first callback_, invoque o callback com um único argumento do tipo _`Error`_.

```js
function callbackError(cb) {
  // `cb()` tem que ser invocado por alguma operação assíncrona
  cb(new Error('kaboom'));
}

exports.default = callbackError;
```

Contudo, normalmente, você vai acabar passando esse callback para alguma outra API, invés de invocá-lo por conta própria.

```js
const fs = require('fs');

function passingCallback(cb) {
  fs.access('gulpfile.js', cb);
}

exports.default = passingCallback;
```

## Nada de tarefas síncronas

Tarefas síncronas não são suportadas, mais. Elas, frequentemente, levavam a _errinhos_ que era difíceis de fazer debug. Por exemplo: esquecer de retornar streams, em uma tarefa.

Quando você ver o aviso: _"Did you forget to signal async completion?"_, quer dizer que nenhuma das técnicas mencionadas acima foram utilizadas.

Você precisará usar um _error-first callback_ ou retornar uma _stream_, _promise_, _event emitter_, _child process_ ou _observable_; para acabar com o problema.

## Usando async/await

Quando não estiver usando alguma das opções mencionadas, é possível definir a tarefa como uma [função assíncrona][async-await-docs], oquê envolverá ela em uma _promise_.

Isso permite que você trabalhe com _promises_ de forma síncrona, usando `await` junto de algum código síncrono.

```js
const fs = require('fs');

async function asyncAwaitTask() {
  const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(version);
  await Promise.resolve('algum resultado');
}

exports.default = asyncAwaitTask;
```

[node-api-error-first-callbacks]: https://nodejs.org/api/errors.html#errors_error_first_callbacks
[stream-docs]: https://nodejs.org/api/stream.html#stream_stream
[promise-docs]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
[event-emitter-docs]: https://nodejs.org/api/events.html#events_events
[child-process-docs]: https://nodejs.org/api/child_process.html#child_process_child_process
[observable-docs]: https://github.com/tc39/proposal-observable/blob/master/README.md
[async-await-docs]: https://developers.google.com/web/fundamentals/primers/async-functions
