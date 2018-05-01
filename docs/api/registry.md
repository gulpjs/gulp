<!-- front-matter
id: api-registry
title: registry()
hide_title: true
sidebar_label: registry()
-->

# `gulp.registry([registry])`

Get or set the underlying task registry. Inherited from [undertaker]; see the undertaker documention on [registries](https://github.com/phated/undertaker#registryregistryinstance). Using this, you can change registries that enhance gulp in different ways. Utilizing a custom registry has at least three use cases:

- [Sharing tasks](https://github.com/phated/undertaker#sharing-tasks)
- [Sharing functionality](https://github.com/phated/undertaker#sharing-functionalities) (e.g. you could override the task prototype to add some additional logging, bind task metadata or include some config settings.)
- Handling other behavior that hooks into the registry lifecycle (see [gulp-hub](https://github.com/frankwallis/gulp-hub) for an example)

To build your own custom registry see the [undertaker documentation on custom registries](https://github.com/phated/undertaker#custom-registries).

## registry

A registry instance. When passed in, the tasks from the current registry will be transferred to the new registry and then current registry will be replaced with the new registry.

## Example

This example shows how to create and use a simple custom registry to add tasks.

```js
//gulpfile.js
var gulp = require('gulp');

var companyTasks = require('./myCompanyTasksRegistry.js');

gulp.registry(companyTasks);

gulp.task('one', gulp.parallel('someCompanyTask', function(done) {
  console.log('in task one');
  done();
}));
```

```js
//myCompanyTasksRegistry.js
var util = require('util');

var DefaultRegistry = require('undertaker-registry');

function MyCompanyTasksRegistry() {
  DefaultRegistry.call(this);
}
util.inherits(MyCompanyTasksRegistry, DefaultRegistry);

MyCompanyTasksRegistry.prototype.init = function(gulp) {
  gulp.task('clean', function(done) {
    done();
  });
  gulp.task('someCompanyTask', function(done) {
    console.log('performing some company task.');
    done();
  });
};

module.exports = new MyCompanyTasksRegistry();
```

[undertaker]: https://github.com/gulpjs/undertaker
