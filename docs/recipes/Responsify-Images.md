
Image Processing
----------------

The aim , is to have an array of sizes for each image you are going to serve.

Why?

>Well , to understand why we need a battery of images with a range of widths , we need to ponder over the fact , that there are probably zillions of devices with varied resolutions.
>
>We need an image to scale without much pixelation. At the same time , we need to improve page load times , by downloading just the one image , which fits the width it is contained by , and is also with the smallest possible dimension , to do so. There are scholarly blogs like the one Eric Portis wrote , which highlights the ineffectiveness of just media queries and serves as a comprehensive guide to understanding concepts like srcsets and sizes.
>
>So , assuming you are proficient in understanding device pixel ratios and display container widths , and how they affect the way we approach adding images to our sites , Let us write the function to do all that – i.e , automate your image needs.
>
>Our function , needs to take a glob , and a width as inputs, and do its magic and push the file each run generates , to a destination and minify the responsified image.



Recipe
------
 - INSTALL PLUGINS

First up, install all the plugins we need
- One plugin to responsify - or - scale our image to desired widths while maintaining aspect ratio
- One plugin to rename the image as <image>-<width>.ext
- One plugin to apply compression on the renamed image
- One plugin to cache them all
AND, Let a Function bind them all.Remember LOTR?

```bash
bash $ npm install --save-dev gulp-responsive
bash $ npm install --save-dev gulp-imagemin
bash $ npm install --save-dev imagemin
bash $ npm install --save-dev imagemin-jpeg-recompress
bash $ npm install --save-dev imagemin-pngquant
bash $ npm install --save-dev gulp-cache
```
 - Require everything we installed

```js
var gulp = require('gulp');
var responsive = require('gulp-responsive');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

//image lossy compression plugins
var compressJpg = require('imagemin-jpeg-recompress');
var pngquant = require('imagemin-pngquant');
```
 - Write the function

```js
/*
@generateResponsiveImages
*@Description:takes in a src of globs, to stream matching image files , a width,
*@src - input a glob pattern - a string eg 'images/** /*' or 'images/*' or, an array
eg ['glob1','glob2']
*to resize the matching image to, and a dest to write the resized and minified files to
*@return returns a stream
*/
var generateResponsiveImages = function(src, width, dest) {

    //declare a default destination
    if (!dest)
        dest = 'build/images';
    return gulp.src(src, {
        base: 'images'
    })

    //generate resized images according to the width passed
    .pipe(responsive({
            //match all pngs within the src stream
            '**/*.png': [{
                width: width,
                rename: {
                    suffix: '-' + width
                },
                withoutEnlargement: false,
            }],
            //match all jpgs within the src stream
            '**/*.jpg': [{
                width: width,
                rename: {
                    suffix: '-' + width
                },
                progressive: true,
                withoutEnlargement: false,
            }]
        }, {

            errorOnEnlargement: false,
            errorOnUnusedConfig: false,
            errorOnUnusedImage: false

        }))
        //once the file is resized to width, minify it using the plugins available per format
        .pipe(if('*.jpg', compressJpg({
            min: 30,
            max: 90,
            target: 0.5
        })()))
        //use file based cache gulp-cache and it will minify only changed or new files
        //if it is not a new file and if the contents havent changed, the file is served from cache
        .pipe(cache(imagemin({
            verbose: true
        })))


    //write to destination - dest + path from base
    .pipe(gulp.dest(dest));
}
```
 - Add an array of widths you want to scale your images to
```js
//declare the widths at which you need to resize an image
var widths = ['480', '640', '800', '960', '1280', '1600'];

```
 - Now , create a task to invoke the function
```js
//Take in a callback to ensure notifying the gulp engine, that the task is done
//required since, you are not returning a stream in this task
gulp.task('generateResponsiveImages', function(callback) {
    var src = ['images/**/*.{jpg,png}'];
    for (var i = widths.length - 1; i >= 0; i--) {
        generateResponsiveImages(src, widths[i]);
    }
    callback();

});

```
