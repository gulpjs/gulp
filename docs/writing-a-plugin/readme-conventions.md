# README conventions

> Follow README conventions to increase your plugin readability and usability.

[Writing a Gulp Plugin](README.md) > README conventions

A plugin README should have the following parts at a minimum:

1. **Heading**: Give a short introduction to your plugin
  * Include the version of gulp your plugin was designed for
  * Include any badges on the same line as the heading
1. **Usage**: Include a simple usage example
  * Show the plugin used on the context of a `gulpfile.js`
  * Cover the most common or simplest use case 
1. **API**: Document your plugin's API
  * For individual parameters, include:
    1. Parameter name
    1. Type
    1. Default value
    1. Description
    1. Optional example for complex options
  * If a parameter accepts an Object, do the above for each property
  * If your plugin accepts overloaded arguments, document each style individually


# Example: Options object

The following is an example of a plugin that takes a single options object (from [gulp-handlebars](https://github.com/lazd/gulp-handlebars)).


***

# gulp-handlebars [![NPM version][handlebars-npm-image]][handlebars-npm-url] [![Build status][handlebars-travis-image]][handlebars-travis-url]
> Handlebars plugin for gulp 3

## Usage

First, install `gulp-handlebars` as a development dependency:

```shell
npm install --save-dev gulp-handlebars
```

Then, add it to your `gulpfile.js`:

```js
var handlebars = require('gulp-handlebars');

gulp.task('templates', function(){
  gulp.src(['client/templates/*.hbs'])
    .pipe(handlebars({
      namespace: 'MyApp.templates',
      outputType: 'hybrid'
     }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('build/js/'));
});
```

## API

### handlebars(options)

#### options.namespace
Type: `String`  
Default: `templates`

The namespace in which the precompiled templates will be assigned. Use dot notation (e.g. `App.Templates`) for nested namespaces or false to declare templates in the global namespace.

#### options.outputType
Type: `String`  
Default: `browser`

The desired output type. One of the following:

* `browser` - Produce plain JavaScript files for the browser
* `hybrid` - Produce Node modules that can optionally be used on the frontend
* `node` - Produce Node modules
* `amd` - Produce AMD modules
* `commonjs` - Produce CommonJS modules
* `bare` - Return an unmolested function definition

#### options.declareNamespace
Type: `Boolean`  
Default: `true`

If true, non-destructively declare all parts of the namespace. This option is only necessary when `options.type` is `browser` or `hybrid`.

For example, if the namespace is `MyApp.Templates` and a template is named `App.Header.hbs`, the following declaration will be present in the output file for that template:

```js
this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["templates"] = this["MyApp"]["templates"] || {};
this["MyApp"]["templates"]["App"] = this["MyApp"]["templates"]["App"] || {};
this["MyApp"]["templates"]["App"]["Header"] = function () {};
```

When processing multiple templates under a given namespace, this will result in duplicate declarations. That is, the non-destructive declaration of the namespace will be repeated for each template compiled.

#### options.processName
Type: `Function`  
Default: Strip file extension

This option accepts a function which takes one argument (the template filepath) and returns a string which will be used as the key for the precompiled template object. By default, the filename minus the extension is used.

If this function returns a string containing periods (not including the file extension), they will be represented as a sub-namespace. See `options.declareNamespace` for an example of the effect.

#### options.compilerOptions
Type: `Object`

Compiler options to pass to `Handlebars.precompile()`.


[handlebars-travis-url]: http://travis-ci.org/lazd/gulp-handlebars
[handlebars-travis-image]: https://secure.travis-ci.org/lazd/gulp-handlebars.png?branch=master
[handlebars-npm-url]: https://npmjs.org/package/gulp-handlebars
[handlebars-npm-image]: https://badge.fury.io/js/gulp-handlebars.png
***


# Example: Overloaded API

The following is an example of a plugin that has an overloaded API (from [gulp-csslint](https://github.com/lazd/gulp-csslint)).


***
# gulp-csslint [![NPM version][csslint-npm-image]][csslint-npm-url] [![Build status][csslint-travis-image]][csslint-travis-url]
> CSSLint plugin for gulp 3

## Usage

First, install `gulp-csslint` as a development dependency:

```shell
npm install --save-dev gulp-csslint
```

Then, add it to your `gulpfile.js`:

```javascript
var csslint = require('gulp-csslint');

gulp.task('css', function() {
  gulp.src('./client/css/*.css')
    .pipe(csslint())
    .pipe(csslint.reporter());
});
```

## API

### csslint(ruleConfiguration)

#### ruleConfiguration
Type: `Object`

You can pass rule configuration as an object. See the [list of rules by ID on the CSSLint wiki](https://github.com/stubbornella/csslint/wiki/Rules-by-ID) for valid rule IDs.

```javascript
gulp.src('./client/css/*.css')
  .pipe(csslint({
    'shorthand': false
  }))
  .pipe(csslint.reporter());
```

### csslint(csslintrc)

#### csslintrc
Type: `String`

You can also pass the path to your csslintrc file instead of a rule configuration object.

```javascript
gulp.src('./client/css/*.css')
  .pipe(csslint('csslintrc.json'))
  .pipe(csslint.reporter());
```

## Results

Adds the following properties to the file object:

```javascript
file.csslint.success = true; // or false
file.csslint.errorCount = 0; // number of errors returned by CSSLint
file.csslint.results = []; // CSSLint errors
file.csslint.opt = {}; // The options you passed to CSSLint
```

## Custom Reporters

Custom reporter functions can be passed as `cssline.reporter(reporterFunc)`. The reporter function will be called for each linted file and passed the file object as described above.

```javascript
var csslint = require('gulp-csslint');
var gutil = require('gulp-util');

var customReporter = function(file) {
  gutil.log(gutil.colors.cyan(file.csslint.errorCount)+' errors in '+gutil.colors.magenta(file.path));

  file.csslint.results.forEach(function(result) {
    gutil.log(result.error.message+' on line '+result.error.line);
  });
};

gulp.task('lint', function() {
  gulp.files('./lib/*.js')
    .pipe(csslint())
    .pipe(csslint.reporter(customReporter));
});
```

[csslint-travis-url]: http://travis-ci.org/lazd/gulp-csslint
[csslint-travis-image]: https://secure.travis-ci.org/lazd/gulp-csslint.png?branch=master
[csslint-npm-url]: https://npmjs.org/package/gulp-csslint
[csslint-npm-image]: https://badge.fury.io/js/gulp-csslint.png
***
