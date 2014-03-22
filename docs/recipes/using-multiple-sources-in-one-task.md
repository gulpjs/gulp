# Using multiple sources in one task

```js
// npm install gulp event-stream

var gulp = require('gulp');
var es = require('event-stream');

gulp.task('test', function(cb) {
    return es.merge(
        gulp.src('bootstrap/js/*.js')
            .pipe(gulp.dest('public/bootstrap')),
        gulp.src('jquery.cookie/jquery.cookie.js')
            .pipe(gulp.dest('public/jquery'))
    );
});
```

When streams should be emitting files in order they were added:

```js
// npm install gulp gulp-concat streamqueue

var gulp = require('gulp');
var concat = require('gulp-concat');
var streamqueue = require('streamqueue');

gulp.task('default', function() {
    return streamqueue({ objectMode: true },
        gulp.src('foo/*'),
        gulp.src('bar/*')
    )
        .pipe(concat('result.txt'))
        .pipe(gulp.dest('build'));
});

// ... or ...

gulp.task('default', function() {
    var stream = streamqueue({ objectMode: true });
    stream.queue(gulp.src('foo/*'));
    stream.queue(gulp.src('bar/*'));
    return stream.done()
        .pipe(concat('result.txt'))
        .pipe(gulp.dest('build'));
});
```
