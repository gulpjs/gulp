# Using multiple sources in one task

```js
// npm install gulp event-stream

var gulp = require('gulp');
var es = require('event-stream');

gulp.task('test', function(cb) {
    return es.concat(
        gulp.src('bootstrap/js/*.js')
            .pipe(gulp.dest('public/bootstrap')),
        gulp.src('jquery.cookie/jquery.cookie.js')
            .pipe(gulp.dest('public/jquery'))
    );
});
```
