<!-- front-matter
id: javascript-and-gulpfiles
title: JavaScript and Gulpfiles
hide_title: true
sidebar_label: JavaScript and Gulpfiles
-->

# JavaScript and Gulpfiles

Gulp allows you to use existing JavaScript knowledge to write gulpfiles or to use your experience with gulpfiles to write plain JavaScript. Although a few utilities are provided to simplify working with the filesystem and command line, everything else you write is pure JavaScript.

## Gulpfile explained

A gulpfile is a file in your project directory titled `gulpfile.js` (or capitalized as `Gulpfile.js`, like Makefile), that automatically loads when you run the `gulp` command. Within this file, you'll often see gulp APIs, like `src()`, `dest()`, `series()`, or `parallel()` but any vanilla JavaScript or Node modules can be used. Any exported functions will be registered into gulp's task system.

## Transpilation

You can write a gulpfile using a language that requires transpilation, like TypeScript or Babel, by changing the extension on your `gulpfile.js` to indicate the language and install the matching transpiler module.

* For TypeScript, rename to `gulpfile.ts` and install the [ts-node][ts-node-module] module.
* For Babel, rename to `gulpfile.babel.js` and install the [@babel/register][babel-register-module] module.

__Most new versions of node support most features that TypeScript or Babel provide, except the `import`/`export` syntax. When only that syntax is desired, rename to `gulpfile.esm.js` and install the [esm][esm-module] module.__

For a more advanced dive into this topic and the full list of supported extensions, see our [gulpfile transpilation][gulpfile-transpilation-advanced] documentation.

##  Splitting a gulpfile

Many users start by adding all logic to a gulpfile. If it ever grows too big, it can be refactored into separate files.

Each task can be split into its own file, then imported into your gulpfile for composition. Not only does this keep things organized, but it allows you to test each task independently or vary composition based on conditions.

Node's module resolution allows you to replace your `gulpfile.js` file with a directory named `gulpfile.js` that contains an `index.js` file which is treated as a `gulpfile.js`. This directory could then contain your individual modules for tasks.  If you are using a transpiler, name the folder and file accordingly.

[gulpfile-transpilation-advanced]: ../documentation-missing.md
[ts-node-module]: https://www.npmjs.com/package/ts-node
[babel-register-module]: https://www.npmjs.com/package/@babel/register
[esm-module]: https://www.npmjs.com/package/esm
