<p align="center">
  <a href="https://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
  <p align="center">The streaming build system</p>
</p>

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Coveralls Status][coveralls-image]][coveralls-url]

## What is gulp?

- **Automation** - gulp is a toolkit that helps you automate painful or time-consuming tasks in your development workflow.
- **Platform-agnostic** - Integrations are built into all major IDEs and people are using gulp with PHP, .NET, Node.js, Java, and other platforms.
- **Strong Ecosystem** - Use npm modules to do anything you want + over 3000 curated plugins for streaming file transformations.
- **Simple** - By providing only a minimal API surface, gulp is easy to learn and simple to use.

## Installation

Follow our [Quick Start guide][quick-start].

## Roadmap

Find out about all our work-in-progress and outstanding issues at https://github.com/orgs/gulpjs/projects.

## Documentation

Check out the [Getting Started guide][getting-started-guide] and [API docs][api-docs] on our website!

__Excuse our dust! All other docs will be behind until we get everything updated. Please open an issue if something isn't working.__

## Sample `gulpfile.js`

This file will give you a taste of what gulp does.

```js
var gulp = require('gulp');
var less = require('gulp-less');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');

var paths = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'assets/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'assets/scripts/'
  }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del([ 'assets' ]);
}

/*
 * Define our tasks using plain functions
 */
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(styles, scripts));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;
```

## Use latest JavaScript version in your gulpfile

Gulp provides a wrapper that will be loaded in your ESM code, so you can name your gulpfile as `gulpfile.mjs` or with `"type": "module"` specified in your `package.json` file.

And here's the same sample from above written in **ESNext**.

```js
import { src, dest, watch } from 'gulp';
import less from 'gulp-less';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import {deleteAsync} from 'del';

const paths = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'assets/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'assets/scripts/'
  }
};

/*
 * For small tasks you can export arrow functions
 */
export const clean = () => deleteAsync([ 'assets' ]);

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
  return src(paths.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(dest(paths.styles.dest));
}

export function scripts() {
  return src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(dest(paths.scripts.dest));
}

 /*
  * You could even use `export as` to rename exported tasks
  */
function watchFiles() {
  watch(paths.scripts.src, scripts);
  watch(paths.styles.src, styles);
}
export { watchFiles as watch };

const build = gulp.series(clean, gulp.parallel(styles, scripts));
/*
 * Export a default task
 */
export default build;
```

## Incremental Builds

You can filter out unchanged files between runs of a task using
the `gulp.src` function's `since` option and `gulp.lastRun`:
```js
const paths = {
  ...
  images: {
    src: 'src/images/**/*.{jpg,jpeg,png}',
    dest: 'build/img/'
  }
}

function images() {
  return gulp.src(paths.images.src, {since: gulp.lastRun(images)})
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));
}

function watch() {
  gulp.watch(paths.images.src, images);
}
```
Task run times are saved in memory and are lost when gulp exits. It will only
save time during the `watch` task when running the `images` task
for a second time.

## Want to contribute?

Anyone can help make this project better - check out our [Contributing guide](/CONTRIBUTING.md)!

<!-- prettier-ignore-start -->
[quick-start]: https://gulpjs.com/docs/en/getting-started/quick-start
[getting-started-guide]: https://gulpjs.com/docs/en/getting-started/quick-start
[api-docs]: https://gulpjs.com/docs/en/api/concepts
[esm-module]: https://github.com/standard-things/esm
<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
[downloads-image]: https://img.shields.io/npm/dm/gulp.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/gulp
[npm-image]: https://img.shields.io/npm/v/gulp.svg?style=flat-square

[ci-url]: https://github.com/gulpjs/gulp/actions?query=workflow:dev
[ci-image]: https://img.shields.io/github/actions/workflow/status/gulpjs/gulp/dev.yml?branch=master&style=flat-square

[coveralls-url]: https://coveralls.io/r/gulpjs/gulp
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/gulp/master.svg?style=flat-square
<!-- prettier-ignore-end -->


## 🌐 Web Resources & Interactive Index
- [CATEGORY SIMULATION 3](https://quizverses.github.io/category-simulation-3.html)
- [CATEGORY BRAIN260](https://learnquesters.pages.dev/category-brain260.html)
- [INDEX21](https://studyquests.pages.dev/index21.html)
- [FIREBOY WATERGIRL 7 AND FRIENDS](https://thequizzone.pages.dev/fireboy-watergirl-7-and-friends.html)
- [3D CHESS MASTER](https://studyquests.pages.dev/3d-chess-master.html)
- [CATEGORY CRASH32](https://thelearnquesters.pages.dev/category-crash32.html)
- [BFFS K POP FANGIRLS](https://studyplayings.web.app/bffs-k-pop-fangirls.html)
- [NONOGRAM DAILY](https://studyplayings.web.app/nonogram-daily.html)
- [FROGGY HOP](https://thelearnquesters.pages.dev/froggy-hop.html)
- [ANIMAL TRANSFORM RACE](https://iskillquest.pages.dev/animal-transform-race.html)
- [INDEX12](https://learnquester.pages.dev/index12.html)
- [CATEGORY IDLE448](https://studyplayings.pages.dev/category-idle448.html)
- [MUSCLE CHALLENGE](https://studyquesthub.web.app/muscle-challenge.html)
- [CATEGORY SIDE SCROLLING184](https://learnquesters.pages.dev/category-side-scrolling184.html)
- [GOODS TRIPLE MATCH 3D](https://studyquests.pages.dev/goods-triple-match-3d.html)
- [JIGSAW M](https://ptskillcrafts.pages.dev/jigsaw-m.html)
- [PANDA KITCHEN IDLE TYCOON](https://studyquesthub.web.app/panda-kitchen-idle-tycoon.html)
- [GEOMETRY VIBES 3D](https://iskillquest.pages.dev/geometry-vibes-3d.html)
- [BADLAND](https://studyplayings.pages.dev/badland.html)
- [INDEX2](https://thequizzone.pages.dev/index2.html)
- [SNAKE 2048IO](https://iskillquest.pages.dev/snake-2048io.html)
- [CATEGORY STICKMAN 2](https://studyplayings.web.app/category-stickman-2.html)
- [PRESS A TO PARTY](https://thelearnquesters.pages.dev/press-a-to-party.html)
- [WORLD WAR BROTHERS WW2](https://thequizzone.pages.dev/world-war-brothers-ww2.html)
- [CATEGORY PUZZLE 6](https://iskillquest.pages.dev/category-puzzle-6.html)
- [CATEGORY SURVIVAL366](https://iskillquest.pages.dev/category-survival366.html)
- [OFFICE GOLF](https://themindzone.pages.dev/office-golf.html)
- [SQUID ESCAPE GAME](https://thequizzone.pages.dev/squid-escape-game.html)
- [WORD SEARCH WITH HINTS](https://thelearnquester.web.app/word-search-with-hints.html)
- [ASMR GIRL LIVESTREAM MUKBANG](https://studyplaying.github.io/asmr-girl-livestream-mukbang.html)
- [CATEGORY DRESS UP 2](https://theskillquest.pages.dev/category-dress-up-2.html)
- [SNAKEMAXX](https://studyplaying.github.io/snakemaxx.html)
- [PUZZLES BALLS MERGE THE NEW YEAR](https://thequizzone.pages.dev/puzzles-balls-merge-the-new-year.html)
- [CHILDCARE MASTER ONLINE](https://studyplayings.web.app/childcare-master-online.html)
- [CATEGORY THINKY](https://learnquesters.pages.dev/category-thinky.html)
- [MELON DROP FRUIT MERGE MASTER](https://thelearnquester.web.app/melon-drop-fruit-merge-master.html)
- [HAPPY FARM THE CROP](https://studyplaying.github.io/happy-farm-the-crop.html)
- [CATEGORY TANK58](https://iskillquest.pages.dev/category-tank58.html)
- [SUIKA KAWAII CAT MERGE GAME](https://studyquests.pages.dev/suika-kawaii-cat-merge-game.html)
- [BUS JAM](https://thelearnquester.web.app/bus-jam.html)
- [CATEGORY CONTROLLER 2](https://iskillquest.pages.dev/category-controller-2.html)
- [CATEGORY DRAWING](https://studyplayings.pages.dev/category-drawing.html)
- [HIGHSCHOOL MEAN GIRLS 3](https://thequizzone.pages.dev/highschool-mean-girls-3.html)
- [LEXY](https://studyquesthub.web.app/lexy.html)
- [BRICK MATCH](https://studyplaying.github.io/brick-match.html)
- [MATH STARS](https://learnquester.pages.dev/math-stars.html)
- [MAIDO](https://studyplayings.pages.dev/maido.html)
- [COUNTRY LIFE MEADOWS](https://studyquesthub.web.app/country-life-meadows.html)
- [CATEGORY CASUAL](https://theskillquest.pages.dev/category-casual.html)
- [SPIDER ROPE HERO CITY FIGHT](https://studyquesthub.web.app/spider-rope-hero-city-fight.html)
- [CATEGORY CASUAL 4](https://studyplayings.pages.dev/category-casual-4.html)
- [KAWAII CLAW MERGE](https://studyplayings.web.app/kawaii-claw-merge.html)
- [PASSENGER SORT](https://studyquests.pages.dev/passenger-sort.html)
- [SNAKE 2048IO](https://thelearnquester.web.app/snake-2048io.html)
- [MERGE HERO SURVIVAL TOWER DEFENSE](https://themindzone.pages.dev/merge-hero-survival-tower-defense.html)
- [ESCAPE ROOM MYSTERY KEY](https://learnquester.github.io/escape-room-mystery-key.html)
- [FILL THE BOTTLE](https://studyplayings.pages.dev/fill-the-bottle.html)
- [ZIP ZAP](https://studyquesthub.web.app/zip-zap.html)
- [CATEGORY HORDE SURVIVAL67](https://thequizzone.pages.dev/category-horde-survival67.html)
- [ULTIMATE ROBO DUEL 3D](https://iskillquest.pages.dev/ultimate-robo-duel-3d.html)
- [SHADOW STICKMAN FIGHT](https://studyplaying.github.io/shadow-stickman-fight.html)
- [SITEMAP](https://studyplayings.web.app/sitemap.html)
- [PUZZLE BLOCKS FILL IT COMPLETELY](https://thelearnquester.web.app/puzzle-blocks-fill-it-completely.html)
- [FOOTBALL HEADS 2025](https://studyplayings.web.app/football-heads-2025.html)
- [SUDOBLOCK DAILY](https://themindzone.pages.dev/sudoblock-daily.html)
- [CATEGORY GUN241](https://studyplayings.web.app/category-gun241.html)
- [CATEGORY FREE RAGDOLL GAMES](https://studyplayings.web.app/category-free-ragdoll-games.html)
- [WORDMEISTER HD](https://studyplayings.web.app/wordmeister-hd.html)
- [GLACIER RUSH](https://studyquesthub.web.app/glacier-rush.html)
- [HYPER NURSE HOSPITAL GAMES](https://studyquests.pages.dev/hyper-nurse-hospital-games.html)
- [FIERCE BATTLE BREAKOUT](https://studyquesthub.web.app/fierce-battle-breakout.html)
- [CATEGORY BUBBLE SHOOTER](https://studyplayings.pages.dev/category-bubble-shooter.html)
- [CRAZY BAR BRAWL](https://studyplaying.github.io/crazy-bar-brawl.html)
- [HIDDEN OBJECTS LOST ISLAND 2](https://studyplayings.pages.dev/hidden-objects-lost-island-2.html)
- [JUICE MERGE](https://themindzone.pages.dev/juice-merge.html)
- [BRAINROT CLICK TO HATCH](https://themindzone.pages.dev/brainrot-click-to-hatch.html)
- [SCREW NUTS BOLTS WOOD SOLVE](https://thequizzone.pages.dev/screw-nuts-bolts-wood-solve.html)
- [CATEGORY PUZZLE 3](https://thequizzone.pages.dev/category-puzzle-3.html)
- [CRAZY FRUIT MERGE](https://studyquesthub.web.app/crazy-fruit-merge.html)
- [SOKOBAN PUZZLE GAME](https://studyplayings.web.app/sokoban-puzzle-game.html)
- [KNEE CASE SIMULATOR](https://studyplayings.pages.dev/knee-case-simulator.html)
- [CATEGORY BYEPASSHUB](https://iskillquest.pages.dev/category-byepasshub.html)
- [CATEGORY BIKE 2](https://iskillquest.pages.dev/category-bike-2.html)
- [CATEGORY MAHJONG](https://studyplayings.web.app/category-mahjong.html)
- [LOVE TILE TRIO](https://thequizzone.pages.dev/love-tile-trio.html)
- [BALL CRAZE SORT](https://thequizzone.pages.dev/ball-craze-sort.html)
- [COUGAR SIMULATOR BIG CATS](https://learnquester.github.io/cougar-simulator-big-cats.html)
- [GYM MUSCLE MERGE TYCOON](https://iskillquest.pages.dev/gym-muscle-merge-tycoon.html)
- [TUNG SAHUR BOTS CHASE ROOM](https://studyquesthub.web.app/tung-sahur-bots-chase-room.html)
- [BANANA BOUNCE](https://learnquesters.pages.dev/banana-bounce.html)
- [CATEGORY DRAWING34](https://themindzone.pages.dev/category-drawing34.html)
- [CATEGORY MERGE 2](https://thequizzone.pages.dev/category-merge-2.html)
- [CATEGORY MERGE224](https://thequizzone.pages.dev/category-merge224.html)
- [PING PONG BATTLE TABLE TENNIS](https://thelearnquester.web.app/ping-pong-battle-table-tennis.html)
- [BOO TIFUL PRINCESS MATCH](https://learnquesters.pages.dev/boo-tiful-princess-match.html)
- [CATEGORY ARENA255](https://studyplayings.pages.dev/category-arena255.html)
- [CATEGORY PREMIUM PERKS71](https://learnquesters.pages.dev/category-premium-perks71.html)
- [HEX SENSE](https://studyplaying.github.io/hex-sense.html)
- [CAPYBARA JUMP](https://iskillquest.pages.dev/capybara-jump.html)
- [BRAINROT BRIDGE RACE 3D](https://studyquests.pages.dev/brainrot-bridge-race-3d.html)
- [CATEGORY CASUAL 3](https://theskillquest.pages.dev/category-casual-3.html)
- [CATEGORY TETRIS36](https://thequizzone.pages.dev/category-tetris36.html)
- [SERIOUS HEAD 2](https://themindzone.pages.dev/serious-head-2.html)
- [GUN BUILDER](https://studyplayings.web.app/gun-builder.html)
- [CATEGORY PUZZLE 4](https://thequizzone.pages.dev/category-puzzle-4.html)
- [STICKMAN DUO ESCAPE THE TOMB](https://thelearnquester.web.app/stickman-duo-escape-the-tomb.html)
- [HYPER CARS RAMP CRASH](https://iskillquest.pages.dev/hyper-cars-ramp-crash.html)
- [EPIC CAR STUNT RACE OBBY](https://studyplaying.github.io/epic-car-stunt-race-obby.html)
- [CYBER ROLLING GOING BALL 3D](https://studyquests.pages.dev/cyber-rolling-going-ball-3d.html)
- [MAGIC TILES 3](https://studyplaying.github.io/magic-tiles-3.html)
- [DOGE BUBBLE](https://thequizzone.pages.dev/doge-bubble.html)
- [WIRE CONNECT](https://studyquesthub.web.app/wire-connect.html)
- [HORROR HOTEL SCARY ROOM](https://thequizzone.pages.dev/horror-hotel-scary-room.html)
- [WAVE DASH GEOMETRY ARROW](https://thelearnquester.web.app/wave-dash-geometry-arrow.html)
- [CATEGORY PUZZLE 3](https://studyplayings.pages.dev/category-puzzle-3.html)
- [MINI GOLF BATTLE](https://studyplaying.github.io/mini-golf-battle.html)
- [CATEGORY ADVENTURE](https://thequizzone.pages.dev/category-adventure.html)
- [CATEGORY PARKOUR55](https://thequizzone.pages.dev/category-parkour55.html)
- [FARMER PEDRO](https://thelearnquester.web.app/farmer-pedro.html)
- [CATEGORY AVOID](https://thequizzone.pages.dev/category-avoid.html)
- [CATEGORY MMO25](https://studyplayings.pages.dev/category-mmo25.html)
- [CATEGORY ESCAPE 3](https://thequizzone.pages.dev/category-escape-3.html)
- [STYLE ICONS 2024 REWIND EDITION](https://thelearnquester.web.app/style-icons-2024-rewind-edition.html)
- [PRISON MASTER ESCAPE JOURNEY](https://studyplayings.pages.dev/prison-master-escape-journey.html)
- [SWORD LIFE](https://studyplaying.github.io/sword-life.html)
- [CARD QUEST 10 MINUTE ADVENTURE](https://studyquesthub.web.app/card-quest-10-minute-adventure.html)
- [CATEGORY 2048](https://thequizzone.pages.dev/category-2048.html)
- [GRILL IT ALL](https://learnquester.github.io/grill-it-all.html)
- [KATANA](https://thelearnquesters.pages.dev/katana.html)
- [ITALIAN BRAINROT TUNG TUNG RACING](https://learnquester.pages.dev/italian-brainrot-tung-tung-racing.html)
