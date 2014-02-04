## gulp CLI docs

### Flags

gulp has very few flags to know about. All other flags are for tasks to use if needed.

- `-V` or `--version` will display the global and local gulp versions
- `--require <module path>` will require a module before running the gulpfile. This is useful for transpilers but also has other applications. You can use multiple `--require` flags
- `--gulpfile <gulpfile path>` manually set path of gulpfile. Useful if you have multiple gulpfiles. This will set the CWD to the gulpfile directory as well.
- `--cwd <dir path>` manually set the CWD. The search for the gulpfile, as well as the relativity of all requires will be from here.
- `-T` or `--tasks` will display the task dependency tree for the loaded gulpfile

### Tasks

Tasks can be executed by running `gulp <task> <othertask>`. Just running `gulp` will execute the task you registered called `default`. If there is no `default` task gulp will error.

### Compilers

You can use any language you want for your gulpfile. You will have to specify the language module name so the CLI can load it (and its associated extensions) before attempting to find your gulpfile. Make sure you have this module installed accessible by the folder you are running the CLI in.

Example:

```
gulp dosomething --require coffee-script/register
```