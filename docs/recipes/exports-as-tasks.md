# Exports as Tasks

Using the ES2015 module syntax you can use your exports as tasks.

```js
import gulp from 'gulp';
import babel from 'gulp-babel';

// named task
export function build() {
  return gulp.src('src/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
}

// default task
export default function dev() {
  gulp.watch('src/*.js', ['build']);
}
```

This will **not** work with the gulp-cli version bundled with gulp 3.x. You must use the latest published version.
