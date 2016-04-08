# Split tasks across multiple files

If your `gulpfile.js` is starting to grow too large, you can split
the tasks into separate files using one of the methods below.

> Be advised, that this approach is [considered deprecated][deprecated]
> and could lead to problems when migrating to the `gulp 4`.


## Using `gulp-require-tasks`

You can use the [gulp-require-tasks][gulp-require-tasks]
module to automatically load all your tasks from the individual files.

Please see the [module's README][gulp-require-tasks] for up-to-date instructions.

## Using `require-dir`

You can also use the [require-dir][require-dir] module to load your tasks manually.

Imagine the following file structure:

```
gulpfile.js
tasks/
├── dev.js
├── release.js
└── test.js
```

Install the `require-dir` module:

```sh
npm install --save-dev require-dir
```

Add the following lines to your `gulpfile.js` file:

```js
var requireDir = require('require-dir');
var tasks = requireDir('./tasks');
```


  [gulp-require-tasks]: https://github.com/betsol/gulp-require-tasks
  [require-dir]:        https://github.com/aseemk/requireDir
  [deprecated]:         https://github.com/gulpjs/gulp/pull/1554#issuecomment-202614391
