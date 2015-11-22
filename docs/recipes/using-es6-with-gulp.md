# Using ES6 with Gulp

To use [ES6](http://es6-features.org/) with [Gulp.js](http://gulpjs.com) you will need to have:

* [Gulp](https://github.com/gulpjs/gulp/releases/tag/v3.9.0) @ 3.9.0 or higher
* [babel-core](https://www.npmjs.com/package/babel-core)
* [babel-preset-es2015](https://www.npmjs.com/package/babel-preset-es2015)

First install the **babel-core** and **babel-preset-es2015** modules.

```bash
npm install babel-core -g
npm install babel-preset-es2015 --save-dev
```

Once installed, create a file named ```.babelrc``` inside your project folder with the following content:

```json
{
    "presets": ["es2015"]
}
```

Then you need to name/rename your gulpfile to ```gulpfile.babel.js```.

Now you will be able to use all the [ES6 features](http://es6-features.org/) into your gulpfile!

If you want to test that ES6 with Gulp is working just add this to your gulpfile and run ```gulp```

```javascript
import gulp from 'gulp';

gulp.task('default', () =>
    console.log('Using ES6 with Gulp!')
);
```
