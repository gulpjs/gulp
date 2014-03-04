# Combining streams to handle errors

By default, emitting an error on a stream will cause it to be thrown
unless it already has a listener attached to the `error` event. This
gets a bit tricky when you're working with longer pipelines of streams.

By using [stream-combiner](https://github.com/dominictarr/stream-combiner) you can turn a series of streams into a single stream, meaning you
only need to listen to the `error` event in one place in your code.

Here's an example of using it in a gulpfile:

``` javascript
var Combine = require('stream-combiner');
var uglify = require('gulp-uglify');
var gulp = require('gulp');

gulp.task('test', function() {
  var combined = Combine(
    gulp.src('bootstrap/js/*.js'),
    uglify(),
    gulp.dest('public/bootstrap')
  )

  // any errors in the above streams
  // will get caught by this listener,
  // instead of being thrown:
  combined.on('error', function(err) {
    console.warn(err.message)
  });

  return combined;
});
```
