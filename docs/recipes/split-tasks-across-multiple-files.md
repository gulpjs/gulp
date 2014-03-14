# Split tasks across multiple files

If your `gulpfile.js` is starting to grow large, you can split the tasks
into separate files with the [require-dir](https://github.com/aseemk/requireDir)
module.

An example could be the following file structure:

```bash
gulpfile.js
tasks/
├── dev.js
├── release.js
└── test.js
```

Install the `require-dir` module:

```bash
npm install require-dir --save-dev
```

Add the following lines to your `gulpfile.js` file.

```javascript
var requireDir = require('require-dir');
var dir = requireDir('./tasks');
```