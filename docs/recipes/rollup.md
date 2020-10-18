# Rollup

Rollup is a module bundler for JavaScript, and, while there are packages which aim to help use Rollup with gulp, like [`gulp-rollup`] and [`rollup-stream`](https://www.npmjs.com/package/rollup-stream), we can also use Rollup's JavaScript API directly.

Let's say that we require the following features:

  - being able to use Node modules
  - interoperability between CommonJS and ES6 modules
  - Babel
  - Uglify in production

To achieve this, we need to install the Rollup and its plugins:

```sh
npm install --save-dev gulp rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-babel @babel/core @babel/preset-env rollup-plugin-uglify
```

Create a basic `babel.config.js`:

```js
module.exports = {
  presets: ["@babel/preset-env"],
};
```

Use [Rollup's JavaScript API](https://rollupjs.org/guide/en/#javascript-api) to create tasks for compiling and recompiling:

```js
const rollup = require("rollup");
const nodeResolve = require("@rollup/plugin-node-resolve").default;
const commonJs = require("@rollup/plugin-commonjs");
const babel = require("@rollup/plugin-babel").default;
const uglify = require("rollup-plugin-uglify").uglify;

const isProd = process.env.NODE_ENV === "production";

const inputOptions = {
  input: "scripts/index.js",
  plugins: [
    nodeResolve(),
    commonJs(),
    babel({ babelHelpers: "bundled" }),
    ...(isProd ? [uglify()] : []),
  ],
};

const outputOptions = {
  file: `dist/script.js`,
  format: "iife",
  sourcemap: !isProd,
};

async function compileScripts() {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
}

function compileAndWatchScripts() {
  // this function already creates a build initially, hence the name
  // of the task, so you don't need to run "compileScripts" first
  const watcher = rollup.watch({
    ...inputOptions,
    output: outputOptions,
  });
  watcher.on("event", (event) => {
    if (event.code === "END") {
      console.log("Compiled scripts");
    }
  });
}
```
