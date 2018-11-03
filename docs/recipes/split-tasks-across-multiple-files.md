# Split tasks across multiple files

If your `gulpfile.js` is starting to grow too large, you can split the tasks
into separate files by using the [gulp-hub](https://github.com/frankwallis/gulp-hub/tree/4.0)
module as a [custom registry](https://github.com/phated/undertaker#registryregistryinstance).

Imagine the following file structure:

```
gulpfile.js
tasks/
├── dev.js
├── release.js
└── test.js
```

Install the `gulp-hub` module:

```sh
npm install --save-dev gulp@next gulp-hub
```

Add the following lines to your `gulpfile.js` file:

```js
'use strict';

var gulp = require('gulp');
var HubRegistry = require('gulp-hub');

/* load some files into the registry */
var hub = new HubRegistry(['tasks/*.js']);

/* tell gulp to use the tasks just loaded */
gulp.registry(hub);
```

This recipe can also be found at https://github.com/frankwallis/gulp-hub/tree/4.0/examples/recipe
