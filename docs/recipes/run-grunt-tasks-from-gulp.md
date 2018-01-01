# Run Grunt Tasks from Gulp

It is possible to run Grunt tasks / Grunt plugins from within Gulp. This can be useful during a gradual migration from Grunt to Gulp or if there's a specific plugin that you need. With the described approach no Grunt CLI and no Gruntfile is required.

**This approach requires Grunt >=1.0.0**

very simple example `gulpfile.js`:

```js
// npm install gulp@next grunt grunt-contrib-copy --save-dev

var gulp = require('gulp');
var grunt = require('grunt');

grunt.initConfig({
    copy: {
        main: {
            src: 'src/*',
            dest: 'dest/'
        }
    }
});
grunt.loadNpmTasks('grunt-contrib-copy');

gulp.task('copy', function (done) {
    grunt.tasks(
        ['copy:main'],    //you can add more grunt tasks in this array
        {gruntfile: false}, //don't look for a Gruntfile - there is none. :-)
        function () {done();}
    );
});

```

Now start the task with: 
`gulp copy`

With the aforementioned approach the grunt tasks get registered within gulp's task system. **Keep in mind grunt tasks are usually blocking (unlike gulp), therefore no other task (not even a gulp task) can run until a grunt task is completed.**


### A few words on alternatives

There's a *gulpfriendly* node module `gulp-grunt` [available](https://www.npmjs.org/package/gulp-grunt) which takes a different approach. It spawns child processes and within them the grunt tasks are executed. The way it works implies some limitations though:

* It is at the moment not possible to pass options / cli args etc. to the grunt tasks via `gulp-grunt`
* All grunt tasks have to be defined in a separate Gruntfile
* You need to have the Grunt CLI installed
* The output of some grunt tasks gets malformatted (.i.e. color coding).
