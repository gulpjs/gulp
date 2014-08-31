# Run Grunt Tasks from Gulp

It is possible to run Grunt tasks / Grunt plugins from within Gulp. This can be useful during a gradual migration from Grunt to Gulp or if there's a specific plugin that you need. With described approach no Grunt CLI and no Gruntfile is required.

**This approach requires Grunt >=0.4.6 (specifically [this commit](https://github.com/gruntjs/grunt/commit/77155e3f61d213c529a16ea595fc486fdeca28c9)) which is at the time of writing (2014-08-31) not available in npm. You have to include grunt as tar.gz archive dependency directly from github, instead of npm:**

`npm install https://github.com/gruntjs/grunt/archive/77155e3f61d213c529a16ea595fc486fdeca28c9.tar.gz --save-dev`

**Make sure to update your depedency to a normal npm release, as soon as grunt 0.4.6 is out.**

example `gulpfile.js`:
```js
// npm install gulp grunt grunt-contrib-jasmine --save-dev
var gulp = require('gulp');
var grunt = require('grunt');

grunt.initConfig({
    jasmine: {
        all: {
            src: [
                'src/**/*.js'
            ],
            options: {
                'specs': 'test/**/*.js',
                'keepRunner': true
            }
        }
    }
});
grunt.loadNpmTasks('grunt-contrib-jasmine');

gulp.task('jasmine', function (cb) {
    grunt.tasks(
    	['jasmine:all'],  	//you can add more grunt tasks in this array
    	{gruntfile: false}, //don't look for a Gruntfile - there isn't one. :-)
    	function () {cb();}
    	);
});

```

Now start the task with: 
`gulp jasmine`

With the aforementioned approach the grunt tasks get registered within gulp's task system. **Keep in mind grunt tasks are usually blocking (unlike gulp), therefor no other task (not even a gulp task) can run until a grunt task is completed.**


### A few words on alternatives

There's a `gulpfriendly` node module `gulp-grunt` [available](https://www.npmjs.org/package/gulp-grunt) which takes a different approach. It spawns child processes and within them the grunt tasks are executed. The way it works implies some differences:
* It is at the moment not possible to pass options / cli args etc. to the grunt  tasks
* All grunt tasks have to be defined in a seperate Gruntfile
* You need to have the Grunt CLI installed
* The output of some grunt tasks gets malformatted (.i.e. color coding). This is for example the case with the jasmine task.
