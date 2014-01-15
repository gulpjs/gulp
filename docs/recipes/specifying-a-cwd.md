# Specifying a new cwd (current working directory)

This is helpful for projects using a nested directory structure, such as:

```
/project
  /layer1
  /layer2
```

You can use the gulp CLI option `--cwd`

From the `project/` directory

```bash
gulp --cwd ./layer1/
```

Another option is to use `process.chdir` which is just vanilla node.

`gulpfile.js`

```js
var gulp = require('gulp');

try {
  process.chdir(gulp.env.cwd);
} catch (err) {
  console.error('Unable to chdir to %s', gulp.env.cwd);
}
```

If you only need to specify a cwd for a certain glob, you can use the `cwd` option on a [glob-stream](https://github.com/wearefractal/glob-stream)

```js
gulp.src('./some/dir/**/*.js', { cwd: './public' });
```
