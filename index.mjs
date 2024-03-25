import gulp from "./index.js";

// These are bound to the gulp instance in our CommonJS file
// so it is okay to reassign them to export
export const watch = gulp.watch;
export const task = gulp.task;
export const series = gulp.series;
export const parallel = gulp.parallel;
export const registry = gulp.registry;
export const tree = gulp.tree;
export const lastRun = gulp.lastRun;
export const src = gulp.src;
export const dest = gulp.dest;
export const symlink = gulp.symlink;

export default gulp;
