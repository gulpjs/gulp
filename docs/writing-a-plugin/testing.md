# Testing

> Testing your plugin is the only way to ensure quality. It brings confidence to your users and makes your life easier.

[Writing a Plugin](README.md) > Testing

## Tooling

Most plugins use [mocha](https://github.com/visionmedia/mocha) and [event-stream](https://github.com/dominictarr/event-stream) to help them test. The following examples will use these tools.

## Testing plugins for streaming mode

```js
var assert = require('assert');
var es = require('event-stream');
var gutil = require('gulp-util');
var prefixer = require('../index');

describe('gulp-prefixer', function () {
  describe('in streaming mode', function () {

    it('should prepend text', function (done) {

      // create the fake file
      var fakeFile = new gutil.File({
        contents: es.readArray(['stream', 'with', 'those', 'contents'])
      });

      // Create a prefixer plugin stream
      var myPrefixer = prefixer('prependthis');

      // write the fake file to it
      myPrefixer.write(fakeFile);

      // wait for the file to come back out
      myPrefixer.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isStream());

        // buffer the contents to make sure it got prepended to
        file.contents.pipe(es.wait(function (err, data) {
          // check the contents
          assert.equal(data, 'prependthistostreamwiththosecontents');
          done();
        }));
      });

    });

  });
});
```

## Testing plugins for buffer mode

```js
var assert = require('assert');
var es = require('event-stream');
var gutil = require('gulp-util');
var prefixer = require('../index');

describe('gulp-prefixer', function () {
  describe('in buffer mode', function () {

    it('should prepend text', function (done) {

      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('abufferwiththiscontent')
      });

      // Create a prefixer plugin stream
      var myPrefixer = prefixer('prependthis');

      // write the fake file to it
      myPrefixer.write(fakeFile);

      // wait for the file to come back out
      myPrefixer.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), 'prependthisabufferwiththiscontent');
        done();
      });

    });

  });
});
```

## Sample tests
* [gulp-cat](https://github.com/ben-eb/gulp-cat/blob/master/test.js)
