# Maintain Directory Structure

If you would like to read only a few files and maintain their structure while processing (example a Zip task), you need to pass `{base: '.'}` as the second argumnet to `gulp.src()`.

For example, if you have a directory structure like 

![Dev setup](https://cloud.githubusercontent.com/assets/2562992/3178498/bedf75b4-ec1a-11e3-8a71-a150ad94b450.png)

and want to zip up only a few files say

```js
[ 'index.html',
 'css/**',
 'js/**',
 'lib/**',
 'images/**',
 'plugin/**'
 ]
```
and want to maintain the directory structure while zipping, You can write the task like 

```js
gulp.task('zip', function () {
    return gulp.src([
                'index.html',
                'css/**',
                'js/**',
                'lib/**',
                'images/**',
                'plugin/**'
            ], {base: '.'})
        .pipe(zip('dist-archive.zip'))
        .pipe(gulp.dest('./'));
});
```

This will maintain the folder structure while zipping the files. Else all files will be placed at the root folder like 

![Zipped-Unzipped](https://cloud.githubusercontent.com/assets/2562992/3178614/27208c52-ec1c-11e3-852e-8bbb8e420c7f.png)
