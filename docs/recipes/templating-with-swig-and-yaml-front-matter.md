# Templating with Swig and YAML front-matter
Templating can be setup using `gulp-swig`, `gulp-data`, and `gulp-front-matter`:

##### `page.html`

```html
---
title: Things to do
todos:
    - First todo
    - Another todo item
    - A third todo item
---
<html>
    <head>
        <title>{{ title }}</title>
    </head>
    <body>
        Things to do:
        <ul>{% for todo in todos %}
          <li>{{ todo }}</li>
        {% endfor %}</ul>
    </body>
</html>
```

##### `gulpfile.js`

```js
var gulp = require('gulp');
var swig = require('gulp-swig');
var data = require('gulp-data');
var fm   = require('gulp-front-matter');

gulp.task("compile-page", function() {
  gulp.src('page.html')
      .pipe(fm({
          property : 'vars',
          remove   : true
      }))
      .pipe(data(function(page) { 
          return page.vars;
      }))
      .pipe(swig())
      .pipe(gulp.dest('build'));
});

gulp.task("default", ["compile-page"]);
```
