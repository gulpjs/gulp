## gulp CLI docs

### Flags

gulp has very few flags to know about. All other flags are for tasks to use if needed.

- `-v` or `--version` will display the global and local gulp versions
- `--require <module path>` will require a module before running the gulpfile. This is useful for transpilers but also has other applications. You can use multiple `--require` flags
- `--gulpfile <gulpfile path>` will manually set path of gulpfile. Useful if you have multiple gulpfiles. This will set the CWD to the gulpfile directory as well
- `--cwd <dir path>` will manually set the CWD. The search for the gulpfile, as well as the relativity of all requires will be from here
- `-T` or `--tasks` will display the task dependency tree for the loaded gulpfile
- `--tasks-simple` will display a plaintext list of tasks for the loaded gulpfile
- `--color` will force gulp and gulp plugins to display colors even when no color support is detected
- `--no-color` will force gulp and gulp plugins to not display colors even when color support is detected
- `--silent` will disable all gulp logging

The CLI adds process.env.INIT_CWD which is the original cwd it was launched from.

#### Task specific flags

Refer to this [StackOverflow](http://stackoverflow.com/questions/23023650/is-it-possible-to-pass-a-flag-to-gulp-to-have-it-run-tasks-in-different-ways) link for how to add task specific flags

### Tasks

Tasks can be executed by running `gulp <task> <othertask>`. Just running `gulp` will execute the task you registered called `default`. If there is no `default` task gulp will error.

### Compilers

You can find a list of supported languages at [interpret](https://github.com/tkellen/node-interpret#jsvariants). If you would like to add support for a new language send pull request/open issues there.
