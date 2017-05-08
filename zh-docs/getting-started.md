# 入门

#### 1. 安装全局gulp:

__如果你以前安装过的全局的gulp版本, 请运行 `npm rm --global gulp`
以确保你的旧版本不会与gulp-cli 冲突。__

```sh
$ npm install --global gulp-cli
```

#### 2. 初始化你的项目目录:

```sh
$ npm init
```

#### 3. 在你的项目中安装gulp开发依赖:

```sh
$ npm install --save-dev gulp
```

#### 4. 在你的项目的根目录下创建一个`gulpfile.js`文件:

```js
var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
});
```

#### 5. 运行gulp:

```sh
$ gulp
```

默认任务将运行，但是什么也不做。

要运行某个任务，使用'gulp<任务名> <其它任务名>`。

## 现在我要去哪里？

你现在有一个空的 gulpfile文件 ，并且安装了所需的一切。 你怎样真正地开始呢？ 查看 [参考手册](recipes)和[文章列表](README.md#articles) 获取更多信息。

## .src, .watch, .dest, CLI 参数列表 - 我如何使用这些东西呢？

需要API详细的文档，你可以查看 [针对gulp的文档](API.md).

## 可用的各种插件

gulp的社区在不断发展壮大，每天都有新的插件被添加进来。 访问 [官网](http://gulpjs.com/plugins/) 获取一个完整的插件列表。
