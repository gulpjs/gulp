# Running tasks in series

By default, tasks run with maximum concurrency -- e.g. it launches all the tasks at once and waits for nothing.
If you want to create a series where tasks run in a particular order, you need to do two things:

- give it a hint to tell it when the task is done,
- and give it a hint that a task depends on completion of another.

For these examples, let's presume you have two tasks, "one" and "two" that you specifically want to run in this order:

1. In task "one" you add a hint to tell it when the task is done.  Either take in a callback and call it when you're
done or return a promise or stream that the engine should wait to resolve or end respectively.

2. In task "two" you add a hint telling the engine that it depends on completion of the first task.

So this example would look like this:

```javascript
var gulp = require('gulp');

// takes in a callback so the engine knows when it'll be done
gulp.task('one', function (cb) {
    // do stuff -- async or otherwise
    cb(err); // if err is not null and not undefined, the orchestration will stop, and 'two' will not run
});

// identifies a dependent task must be complete before this one begins
gulp.task('two', ['one'], function () {
    // task 'one' is done now
});

gulp.task('default', ['one', 'two']);
// alternatively: gulp.task('default', ['two']);
```
