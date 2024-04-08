<!-- front-matter
id: explaining-globs
title: Explaining Globs
hide_title: true
sidebar_label: Explaining Globs
-->

# Explaining Globs

A glob is a string of literal and/or wildcard characters used to match filepaths. Globbing is the act of locating files on a filesystem using one or more globs.

The `src()` method expects a single glob string or an array of globs to determine which files your pipeline will operate on. At least one match must be found for your glob(s) otherwise `src()` will error. When an array of globs is used, any negative globs will remove matches from any positive glob.

## Segments and separators

A segment is everything between separators. The separator in a glob is always the `/` character - regardless of the operating system - even in Windows where the path separator is `\\`.  In a glob, `\\` is reserved as the escape character.

Here, the * is escaped, so it is treated as a literal instead of a wildcard character.
```js
'glob_with_uncommon_\\*_character.js'
```

Avoid using Node's `path` methods, like `path.join`, to create globs. On Windows, it produces an invalid glob because Node uses `\\` as the separator. Also avoid the `__dirname` global, `__filename` global, or `process.cwd()` for the same reasons.

```js
const invalidGlob = path.join(__dirname, 'src/*.js');
```

## Special character: * (single-star)

Matches any amount - including none - of characters within a single segment. Useful for globbing files within one directory.

This glob will match files like `index.js`, but not files like `scripts/index.js` or `scripts/nested/index.js`
```js
'*.js'
```

## Special character: ** (double-star)

Matches any amount - including none - of characters across segments. Useful for globbing files in nested directories. Make sure to appropriately restrict your double-star globs, to avoid matching large directories unnecessarily.

Here, the glob is appropriately restricted to the `scripts/` directory. It will match files like `scripts/index.js`, `scripts/nested/index.js`, and `scripts/nested/twice/index.js`.

```js
'scripts/**/*.js'
```

<small>In the previous example, if `scripts/` wasn't prefixed, all dependencies in `node_modules` or other directories would also be matched.</small>

## Special character: ! (negative)

Globs prefixed with the `!` character will "negate" the glob, excluding the match completely. All negative globs are applied to every positive glob, which is a departure from gulp versions before v5.

Here, the `scripts/` directory will be traversed for all files ending in `.js`, but all files from the `scripts/vendor/` directory will be excluded.

```js
['scripts/**/*.js', '!scripts/vendor/**']
```

Negative globs can be used as an alternative for restricting double-star globs.

```js
['**/*.js', '!node_modules/**']
```

## Ordered globs

Versions of gulp before v5 allowed "ordered globs"; however, that has been removed to align with most globbing libraries in the ecosystem.

If you need the "ordered glob" functionality, you can use the [ordered-read-streams][ordered-read-streams-docs] library to combine streams:

```js
const order = require("ordered-read-streams");

exports.default = function () {
  return order([
    gulp.src("input/jquery/dist/jquery.js"),
    gulp.src("input/detect_swipe/jquery.detect_swipe.js"),
  ]).pipe(gulp.dest('output/'));
}
```

## Overlapping globs

Two or more globs that (un)intentionally match the same file are considered overlapping. When overlapping globs are used within a single `src()`, gulp does its best to remove the duplicates, but doesn't attempt to deduplicate across separate `src()` calls.

## Advanced resources

Most of what you'll need to work with globs in gulp is covered here. If you'd like to get more in depth, here are a few resources.

* [Micromatch Documentation][micromatch-docs]
* [node-glob's Glob Primer][glob-primer-docs]
* [Begin's Globbing Documentation][begin-globbing-docs]
* [Wikipedia's Glob Page][wikipedia-glob]

[micromatch-docs]: https://github.com/micromatch/micromatch
[glob-primer-docs]: https://github.com/isaacs/node-glob#glob-primer
[begin-globbing-docs]: https://github.com/begin/globbing#what-is-globbing
[wikipedia-glob]: https://en.wikipedia.org/wiki/Glob_(programming)
[ordered-read-streams-docs]: https://github.com/gulpjs/ordered-read-streams#orderedstreams-options
