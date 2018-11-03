# Specifying a new cwd (current working directory)

This is helpful for projects using a nested directory structure, such as:

```
/project
  /layer1
  /layer2
```

You can use the gulp CLI option `--cwd`.

From the `project/` directory:

```sh
gulp --cwd layer1
```

If you only need to specify a cwd for a certain glob, you can use the `cwd` option on a [glob-stream](https://github.com/gulpjs/glob-stream):

```js
gulp.src('./some/dir/**/*.js', { cwd: 'public' });
```
