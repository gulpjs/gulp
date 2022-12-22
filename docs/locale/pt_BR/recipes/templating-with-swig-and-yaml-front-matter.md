# Fazendo templates com Swig e YAML front-matter
Templates podem ser configurados, usando `gulp-swig` e `gulp-front-matter`:

##### `page.html`

```html
---
title: Coisas à fazer
todos:
    - Primeira coisa
    - Outra coisa
    - Uma terceira coisa
---
<html>
    <head>
        <title>{{ title }}</title>
    </head>
    <body>
        <h1>{{ title }}</h1>
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
var frontMatter = require('gulp-front-matter');

gulp.task('compile-page', function() {
  gulp.src('page.html')
      .pipe(frontMatter({ property: 'data' }))
      .pipe(swig())
      .pipe(gulp.dest('build'));
});

gulp.task('default', ['compile-page']);
```
