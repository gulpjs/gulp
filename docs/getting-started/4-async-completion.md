<!-- front-matter
id: async-completion
title: Async Completion
hide_title: true
sidebar_label: Async Completion
-->

# Async Completion

Node libraries handle asynchronicity in a variety of ways. The most common pattern is [error-first callbacks][node-api-error-first-callbacks], but you might also encounter [streams][stream-docs], [promises][promise-docs], [event emitters][event-emitter-docs], [child processes][child-process-docs], or [observables][observable-docs]. Gulp tasks normalize all these types of asynchronicity.

## Signal task completion

When a stream, promise, event emitter, child process, or observable is returned from a task, the success or error informs gulp whether to continue or end. If a task errors, gulp will end immediately and show that error.

When composing tasks with `series()`, an error will end the composition and no further tasks will be executed. When composing tasks with `parallel()`, an error will end the composition but the other parallel tasks may or may not complete.

### Returning a stream

```js
const { src, dest } = require('gulp');

function streamTask() {
  return src('*.js')
    .pipe(dest('output'));
}

exports.default = streamTask;
```

### Returning a promise

```js
function promiseTask() {
  return Promise.resolve('the value is ignored');
}

exports.default = promiseTask;
```

### Returning an event emitter

```js
const { EventEmitter } = require('events');

function eventEmitterTask() {
  const emitter = new EventEmitter();
  // Emit has to happen async otherwise gulp isn't listening yet
  setTimeout(() => emitter.emit('finish'), 250);
  return emitter;
}

exports.default = eventEmitterTask;
```

### Returning a child process

```js
const { exec } = require('child_process');

function childProcessTask() {
  return exec('date');
}

exports.default = childProcessTask;
```

### Returning an observable

```js
const { Observable } = require('rxjs');

function observableTask() {
  return Observable.of(1, 2, 3);
}

exports.default = observableTask;
```

### Using an error-first callback

If nothing is returned from your task, you must use the error-first callback to signal completion. The callback will be passed to your task as the only argument - named `cb()` in the examples below.

```js
function callbackTask(cb) {
  // `cb()` should be called by some async work
  cb();
}

exports.default = callbackTask;
```

To indicate to gulp that an error occurred in a task using an error-first callback, call it with an `Error` as the only argument.

```js
function callbackError(cb) {
  // `cb()` should be called by some async work
  cb(new Error('kaboom'));
}

exports.default = callbackError;
```

However, you'll often pass this callback to another API instead of calling it yourself.

```js
const fs = require('fs');

function passingCallback(cb) {
  fs.access('gulpfile.js', cb);
}

exports.default = passingCallback;
```

## No synchronous tasks

Synchronous tasks are no longer supported. They often led to subtle mistakes that were hard to debug, like forgetting to return your streams from a task.

When you see the _"Did you forget to signal async completion?"_ warning, none of the techniques mentioned above were used. You'll need to use the error-first callback or return a stream, promise, event emitter, child process, or observable to resolve the issue.

## Using async/await

When not using any of the previous options, you can define your task as an [`async` function][async-await-docs], which wraps your task in a promise. This allows you to work with promises synchronously using `await` and use other synchronous code.

```js
const fs = require('fs');

async function asyncAwaitTask() {
  const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(version);
  await Promise.resolve('some result');
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
