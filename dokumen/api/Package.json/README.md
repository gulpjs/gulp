{
  "name": "gulp",
  "version": "4.0.2",
  "description": "The streaming build system.",
  "homepage": "https://gulpjs.com",
  "author": "Gulp Team <team@gulpjs.com> (https://gulpjs.com/)",
  "contributors": [
    "Eric Schoffstall <yo@contra.io>",
    "Blaine Bublitz <blaine.bublitz@gmail.com>"
  ],
  "repository": "gulpjs/gulp",
  "license": "MIT",
  "engines": {
    "node": ">= 0.10"
  },
  "main": "index.js",
  "files": [
    "LICENSE",
    "index.js",
    "bin"
  ],
  "bin": {
    "gulp": "./bin/gulp.js"
  },
  "scripts": {
    "lint": "eslint .",
    "pretest": "npm run lint",
    "test": "nyc mocha --async-only",
    "azure-pipelines": "nyc mocha --async-only --reporter xunit -O output=test.xunit",
    "coveralls": "nyc report --reporter=text-lcov | coveralls"
  },
  "dependencies": {
    "glob-watcher": "^5.0.3",
    "gulp-cli": "^2.2.0",
    "undertaker": "^1.2.1",
    "vinyl-fs": "^3.0.0"
  },
  "devDependencies": {
    "coveralls": "github:phated/node-coveralls#2.x",
    "eslint": "^2.13.1",
    "eslint-config-gulp": "^3.0.1",
    "expect": "^1.20.2",
    "mkdirp": "^0.5.1",
    "mocha": "^3.0.0",
    "nyc": "^10.3.2",
    "rimraf": "^2.6.3"
  },
  "keywords": [
    "build",
    "stream",
    "system",
    "make",
    "tool",
    "asset",
    "pipeline",
    "series",
    "parallel",
    "streaming"
  ]
}
## Table of Contents

   * [API Concepts] (concepts.md)
   * [src ()] (src.md)
   * [dest ()] (dest.md)
   * [symlink ()] (symlink.md)
   * [lastRun ()] (last-run.md)
   * [series ()] (series.md)
   * [parallel ()] (parallel.md)
   * [watch ()] (watch.md)
   * [task ()] (task.md)
   * [registry ()] (registry.md)
   * [tree ()] (tree.md)
   * [Vinyl] (vinyl.md)
   * [Vinyl.isVinyl ()] (vinyl-isvinyl.md)
   * [Vinyl.isCustomProp ()] (vinyl-iscustomprop.md)
  # Security Policy

  ## Supported Versions

  |  Version |  Supported |
  |  ------- |  ------------------ |
  |  4.x.x |  : white_check_mark: |
  |  <4.0 |  : x: |

  ## Reporting a Vulnerability

  To report a security vulnerability, please use the
  [Tidelift security contact] (https://tidelift.com/security).
  Tidelift will coordinate the fix and disclosure.
