# Using multiple sources in one task

```js
// npm install --save-dev gulp merge-stream

const { src, dest } = require('gulp');
const merge = require('merge-stream');

function test() {
  const bootstrap = src('bootstrap/js/**/*.js')
    .pipe(dest('public/bootstrap'));

  const jquery = src('jquery.cookie/jquery.cookie.js')
    .pipe(dest('public/jquery'));

  return merge(bootstrap, jquery);
}

exports.test = test;
```

`src` will emit files in the order they were added:

```js
// npm install --save-dev gulp gulp-concat

const { src, dest } = require('gulp');
const concat = require('gulp-concat');

function test() {
  return src(['foo/*', 'bar/*'])
    .pipe(concat('result.txt'))
    .pipe(dest('build'));
}

exports.default = test;
```
