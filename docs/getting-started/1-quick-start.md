<!-- front-matter
id: quick-start
title: Quick Start
hide_title: true
sidebar_label: Quick Start
-->

# Quick Start

If you've previously installed gulp globally, run `npm rm --global gulp` before following these instructions. For more information, read this [Sip][sip-article].

## Check for node, npm, and npx
```sh
node --version
```
![Output: v8.11.1][img-node-version-command]
```sh
npm --version
```
![Output: 5.6.0][img-npm-version-command]
```sh
npx --version
```
![Output: 9.7.1][img-npx-version-command]

If they are not installed, follow the instructions [here][node-install].

## Install the gulp command line utility
```sh
npm install --global gulp-cli
```


## Create a project directory and navigate into it
```sh
npx mkdirp my-project
```
```sh
cd my-project
```

## Create a package.json file in your project directory
```sh
npm init
```

This will guide you through giving your project a name, version, description, etc.

## Install the gulp package in your devDependencies
```sh
npm install --save-dev gulp
```

## Verify your gulp versions

```sh
gulp --version
```

Ensure the output matches the screenshot below or you might need to restart the steps in this guide.

![Output: CLI version 2.0.1 & Local version 4.0.0][img-gulp-version-command]

## Create a gulpfile
Using your text editor, create a file named gulpfile.js in your project root with these contents:
```js
function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.default = defaultTask
```

## Test it
Run the gulp command in your project directory:
```sh
gulp
```
To run multiple tasks, you can use `gulp <task> <othertask>`.

## Result
The default task will run and do nothing.
![Output: Starting default & Finished default][img-gulp-command]

[sip-article]: https://medium.com/gulpjs/gulp-sips-command-line-interface-e53411d4467
[node-install]: https://nodejs.org/en/
[img-node-version-command]: https://gulpjs.com/img/docs-node-version-command.png
[img-npm-version-command]: https://gulpjs.com/img/docs-npm-version-command.png
[img-npx-version-command]: https://gulpjs.com/img/docs-npx-version-command.png
[img-gulp-version-command]: https://gulpjs.com/img/docs-gulp-version-command.png
[img-gulp-command]: https://gulpjs.com/img/docs-gulp-command.png
