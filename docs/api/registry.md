<!-- front-matter
id: registry
title: registry()
hide_title: true
sidebar_label: registry()
-->

# registry()

Allows custom registries to be plugged into the task system, which can provide shared tasks or augmented functionality.

**Note:** Only tasks registered with `task()` will be provided to the custom registry. The task functions passed directly to `series()` or `parallel()` will not be provided - if you need to customize the registry behavior, compose tasks with string references.

When assigning a new registry, each task from the current registry will be transferred and the current registry will be replaced with the new one. This allows for adding multiple custom registries in sequential order.

See [Creating Custom Registries][creating-custom-registries] for details.

## Usage

```js
const { registry, task, series } = require('gulp');
const FwdRef = require('undertaker-forward-reference');

registry(FwdRef());

task('default', series('forward-ref'));

task('forward-ref', function(cb) {
  // body omitted
  cb();
});
```

## Signature

```js
registry([registryInstance])
```

### Parameters

| parameter | type | note |
|:--------------:|:-----:|--------|
| registryInstance | object | An instance - not the class - of a custom registry. |

### Returns

If a `registryInstance` is passed, nothing will be returned. If no arguments are passed, returns the current registry instance.

### Errors

#### Incorrect parameter

When a constructor (instead of an instance) is passed as `registryInstance`, throws an error with the message:

> Custom registries must be instantiated, but it looks like you passed a constructor.

#### Missing `get` method

When a registry without a `get` method is passed as `registryInstance`, throws an error with the message:

> Custom registry must have `get` function.

#### Missing `set` method

When a registry without a `set` method is passed as `registryInstance`, throws an error with the message:

> Custom registry must have `set` function.

#### Missing `init` method

When a registry without an `init` method is passed as `registryInstance`, throws an error with the message:

> Custom registry must have `init` function"

#### Missing `tasks` method

When a registry without a `tasks` method is passed as `registryInstance`, throws an error with the message:

> Custom registry must have `tasks` function.

[creating-custom-registries]: ../advanced/creating-custom-registries.md
