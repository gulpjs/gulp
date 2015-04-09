## gulp CLI docs

### Flags

gulp has very few flags to know about. All other flags are for tasks to use if needed.

- `-v` or `--version` will display the global and local gulp versions
- `--require <module path>` will require a module before running the gulpfile. This is useful for transpilers but also has other applications. You can use multiple `--require` flags
- `--gulpfile <gulpfile path>` will manually set path of gulpfile. Useful if you have multiple gulpfiles. This will set the CWD to the gulpfile directory as well
- `--cwd <dir path>` will manually set the CWD. The search for the gulpfile, as well as the relativity of all requires will be from here
- `-T` or `--tasks` will display the task dependency tree for the loaded gulpfile. It will include the task names and their [description](./API.md#fndescription).
- `--tasks-simple` will display a plaintext list of tasks for the loaded gulpfile
- `--verify` will verify plugins referenced in project's package.json against the plugins blacklist
- `--color` will force gulp and gulp plugins to display colors even when no color support is detected
- `--no-color` will force gulp and gulp plugins to not display colors even when color support is detected
- `--silent` will disable all gulp logging

The CLI adds process.env.INIT_CWD which is the original cwd it was launched from.

#### Task specific flags

Refer to this [StackOverflow](https://stackoverflow.com/questions/23023650/is-it-possible-to-pass-a-flag-to-gulp-to-have-it-run-tasks-in-different-ways) link for how to add task specific flags

### Tasks

Tasks can be executed by running `gulp <task> <task>...`.

If more than one task is listed, Gulp will execute all of them
concurrently, that is, as if they had all been listed as dependencies of
a single task.

Gulp does not serialize tasks listed on the command line. From using
other comparable tools users may expect to execute something like
`gulp clean build`, with tasks named `clean` and `build`. This will not
produce the intended result, as the two tasks will be executed
concurrently.

Just running `gulp` will execute the task `default`. If there is no
`default` task, gulp will error.

### Compilers

You can find a list of supported languages at [interpret](https://github.com/tkellen/node-interpret#jsvariants). If you would like to add support for a new language send pull request/open issues there.

### Examples

#### Example gulpfile

```js
gulp.task('one', function(done) {
  // do stuff
  done();
});

gulp.task('two', function(done) {
  // do stuff
  done();
});

gulp.task('three', three);

function three(done) {
  done();
}
three.description = "This is the description of task three";

gulp.task('four', gulp.series('one', 'two'));

gulp.task('five',
  gulp.series('four',
    gulp.parallel('three', function(done) {
      // do more stuff
      done();
    })
  )
);
```

### `-T` or `--tasks`

Command: `gulp -T` or `gulp --tasks`

Output:
```shell
[20:58:55] Tasks for ~\exampleProject\gulpfile.js
[20:58:55] ├── one
[20:58:55] ├── two
[20:58:55] ├── three                                         This is the description of task three
[20:58:55] ├─┬ four
[20:58:55] │ └─┬ <series>
[20:58:55] │   ├── one
[20:58:55] │   └── two
[20:58:55] ├─┬ five
[20:58:55] │ └─┬ <series>
[20:58:55] │   ├─┬ four
[20:58:55] │   │ └─┬ <series>
[20:58:55] │   │   ├── one
[20:58:55] │   │   └── two
[20:58:55] │   └─┬ <parallel>
[20:58:55] │     ├── three
[20:58:55] │     └── <anonymous>
```

### `--tasks-simple`

Command: `gulp --tasks-simple`

Output: 
```shell
one
two
three
four
five
```
