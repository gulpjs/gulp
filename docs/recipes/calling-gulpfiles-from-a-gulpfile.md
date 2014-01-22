# Calling another gulpfile.js from a gulpfile.js (without having gulp installed globally)

Suppose you have a series of tasks defined in your `gulpfile.js`. We'll call it the top `gulpfile.js`. One of those tasks requires running a `gulpfile.js` in another directory, which we'll call nested `gulpfile.js`. How do you execute that one without installing gulp globally?

First suppose this is the top `gulpfile.js`

````javascript
var gulp = require('gulp');

gulp.task('default', function() {
    console.log('Running top gulpfile');

    var subdir = './subproject';
    var nestedGulpfile = subdir + '/gulpfile.js';
    var cwd = process.cwd();

    process.chdir(subdir);

    require(nestedGulpfile).run();

    process.chdir(cwd);
});

````

Now we also need a small piece for this to work--the nested `gulpfile.js`! We'll assume it works when you invoke it from its directory.

````javascript
var gulp   = require('gulp');

gulp.task('default', function () {
    console.log('Running the other task');
});

module.exports = gulp;
````

Now you can go to your top level folder and do

````bash
./node_modules/.bin/gulp
````

and it should run the tasks - first the default one from the 'top' gulpfile, and then the default task from the 'nested' gulpfile from within the top gulpfile.

Notice we're first finding and storing the current directory before changing to the nested gulpfile's directory. That way, the nested tasks can run from the proper directory and find all the required files. Then we restore it back to the original current directory and can continue with the rest of the tasks in the top `gulpfile.js`.
