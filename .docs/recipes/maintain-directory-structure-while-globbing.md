# Maintain Directory Structure while Globbing

If you are planning to read a few files/folders from a directory and maintain their relative path, you need to pass `{base: '.'}` as the second argument to `gulp.src()`.


For example, if you have a directory structure like 

![Dev setup](https://cloud.githubusercontent.com/assets/2562992/3178498/bedf75b4-ec1a-11e3-8a71-a150ad94b450.png)

and want to read only a few files say

```js
[ 'index.html',
 'css/**',
 'js/**',
 'lib/**',
 'images/**',
 'plugin/**'
 ]
```

In this case, Gulp will read all the sub-folders of (_say_) `css` folder and arrange them relative to your root folder and they will no longer be the sub-folder of `css`. The output after globbing would look like

![Zipped-Unzipped](https://cloud.githubusercontent.com/assets/2562992/3178614/27208c52-ec1c-11e3-852e-8bbb8e420c7f.png)

If you want to maintain the structure, you need to pass `{base: '.'}` to `gulp.src()`. Like

```js
gulp.task('task', function () {
   return gulp.src(['index.html', 
             'css/**', 
             'js/**', 
             'lib/**', 
             'images/**', 
             'plugin/**'
             ], {base: '.'})
       .pipe(operation1())
       .pipe(operation2());
});
```
And the input to your `operation1()` will be a folder structure like 

![with-base](https://cloud.githubusercontent.com/assets/2562992/3178607/053d6722-ec1c-11e3-9ba8-7ce39e1a480e.png)

