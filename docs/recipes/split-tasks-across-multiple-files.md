# Split tasks across multiple files

If your `gulpfile.js` is starting to grow too large, you can split the tasks
into separate files by using the [require-dir](https://github.com/aseemk/requireDir)
module.

Imagine the following file structure:

```
gulpfile.js
tasks/
├── dev.js
├── release.js
└── test.js
```

Install the `require-dir` module:

```sh
npm install --save-dev require-dir
```

Add the following lines to your `gulpfile.js` file:

```js
var requireDir = require('require-dir');
var tasks = requireDir('./tasks');
```
