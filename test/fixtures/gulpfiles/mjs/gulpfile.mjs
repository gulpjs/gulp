import assert from "assert";
import EventEmitter from "events";

import gulp, {
  watch,
  task,
  series,
  parallel,
  registry,
  tree,
  lastRun,
  src,
  dest,
  symlink,
} from 'gulp';

export default function (done) {
  assert(typeof watch === 'function');
  assert(typeof task === 'function');
  assert(typeof series === 'function');
  assert(typeof parallel === 'function');
  assert(typeof registry === 'function');
  assert(typeof tree === 'function');
  assert(typeof lastRun === 'function');
  assert(typeof src === 'function');
  assert(typeof dest === 'function');
  assert(typeof symlink === 'function');
  assert(gulp instanceof EventEmitter);
  done();
}
