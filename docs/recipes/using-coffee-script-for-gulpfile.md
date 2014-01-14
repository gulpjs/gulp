# Using coffee-script for gulpfile

As discussed in [issue #103](https://github.com/gulpjs/gulp/issues/103), there are 2 ways to do this.

1. Use `gulp --require coffee-script` at the command line

2. Require in `gulpfile.coffee` after requiring `coffee-script` in `gulpfile.js`

`gulpfile.js`

```js
require('coffee-script');
require('./gulpfile.coffee');
```

`gulpfile.coffee`

```coffeescript
gulp = require 'gulp'

gulp.task 'default', ->
  console.log('default task called')
```
