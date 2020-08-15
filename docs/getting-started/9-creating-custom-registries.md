<!-- front-matter
id: creating-custom-registries
title: Creating Custom Registries
hide_title: true
sidebar_label: Creating Custom Registries
-->

# Creating Custom Registries

Allows custom registries to be plugged into the task system, which can provide shared tasks or augmented functionality. Registries are registered using [`registry()`](registry).

## Registry Structure

In order to be properly set up, custom registries need to follow a specific format to be accepted by Gulp.

```js
// as a function
function TestRegistry() {}

TestRegistry.prototype.init = function (taker) {}
TestRegistry.prototype.get = function (name) {}
TestRegistry.prototype.set = function (name, fn) {}
TestRegistry.prototype.tasks = function () {}

// as a class
class TestRegistry {
    init(taker) {}

    get(name) {}

    set(name, fn) {}

    tasks() {}
}
```

If a registry instance passed to `registry()` doesn't have these 4 methods available, it will throw an error.

## Registration

If we want to register our example registry from above, we wil need to pass an instance of it to `registry()`.

```js 
const { registry } = require('gulp');

// ... TestRegistry setup code

// bad!
registry(TestRegistry())
// This will trigger an error: 'Custom registries must be instantiated, but it looks like you passed a constructor'

// good!
registry(new TestRegistry())
```

## Methods

### `init(taker)`

The `init()` method of a registry is called at the very end of the `registry()` function. The Undertaker instance passed with `taker`
can be used to pre-define tasks using `taker.task(taskName, fn)`.

#### Parameters

| parameter | type | note |
|:---------:|:----:|------|
| taker | object | Instance of Undertaker. |

### `get(name)`

The `get()` method retrieves the task `name` from the registry (or `undefined` if no task with that name exists). 

#### Parameters

| parameter | type | note |
|:---------:|:----:|------|
| name | string | Name of the task to be retrieved. |

### `set(name, fn)`

The `set()` method sets a task `name` to `fn`. This is called internally by `task()`, the only way how tasks
can be provided to custom registries.

#### Parameters

_In short, the same parameters [`task()`](task) also supports._

| parameter | type | note |
|:---------:|:----:|------|
| name | string | Name of the task to be set. |
| fn | function | Task function to be set. |

### `tasks()`

Returns an object listing all tasks in the registry.

## Examples

* [`undertaker-registry`](https://github.com/gulpjs/undertaker-registry): The Gulp 4 default registry.
* [`undertaker-common-tasks`](https://github.com/gulpjs/undertaker-common-tasks): Proof-of-concept custom registry that pre-defines tasks.
* [` undertaker-task-metadata`](https://github.com/gulpjs/undertaker-task-metadata): Proof-of-concept custom registry that attaches metadata to each task.