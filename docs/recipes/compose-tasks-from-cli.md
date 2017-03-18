# Compose tasks from the command line

By exposing the functionality of [`run-sequence`](https://github.com/OverZealous/run-sequence)
on the command line, you can compose tasks into arbitrary flow on an _ad hoc_
basis. This enables testing alternate flows which can quickly be captured
in tasks if they prove useful.

#### CLI Examples
`gulp clean,build,test,deploy`  
`gulp clean,[coffee,less,jade],[min-css,min-js,min-img],inject`

#### Converted to `task`
```js
gulp.task('do-it', function(done) {
  runSequence('clean',
    ['coffee','less','jade'],
    ['min-css','min-js','min-img'],
    'inject',
    done);
});
```

---

#### `gulpfile.js`

```js
// npm install run-sequence
var gulp        = require('gulp');
var gutil       = require('gulp-util');
var runSequence = require('run-sequence');

...

/*** Put the following at the END of your gulpfile. ***/
function createRunSequenceTask(taskName, taskSets) {
  return gulp.task(taskName, function(done) {
    runSequence.apply(null, Array.slice.call(taskSets).concat([done]));
  });
}

gutil.env._.forEach( function(task) {
  if (/(,|\[)/.test(task)) {
    var json = task.replace(/([^,\[\]]+)/g, '"$1"');
    var obj = JSON.parse('{"taskSets": [' + json + ']}');
    createRunSequenceTask(task, obj.taskSets);
  }
});
```

---

Or, if you prefer your gulpfile in CoffeeScript...

#### `gulpfile.coffee`

```coffee
# npm install run-sequence
gulp        = require 'gulp'
gutil       = require 'gulp-util'
runSequence = require 'run-sequence'

...

### Put the following at the END of your gulpfile. ###
createRunSequenceTask = (taskName, taskSets) ->
  gulp.task taskName, (done) ->
    runSequence taskSets..., done

for task in gutil.env._
  if /(\,|\[)/.test task
    json = task.replace /([^,\[\]]+)/g, '"\$1"'
    obj = JSON.parse "{\"taskSets\": [#{json}]}"
    createRunSequenceTask task, obj.taskSets


```
