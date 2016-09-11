# FAQ

## 为什么是gulp？ 为什么不是 ____？

See the [gulp introduction slideshow] for a rundown on how gulp came to be.

## 它到底是“gulp”还是“Gulp”？

gulp is always lowercase. The only exception is in the gulp logo where gulp is capitalized.

## 我在哪里可以找到gulp的插件列表？

gulp plugins always include the `gulpplugin` keyword. [Search gulp plugins][search-gulp-plugins] or [view all plugins][npm plugin search].

## 我想编写一个gulp的插件，我该如何开始呢？

See the [Writing a gulp plugin] wiki page for guidelines and an example to get you started.

## My plugin does ____, is it doing too much?

Probably. Ask yourself:

1. Is my plugin doing something that other plugins may need to do?
  - If so, that piece of functionality should be a separate plugin. [Check if it already exists on npm][npm plugin search].
1. Is my plugin doing two, completely different things based on a configuration option?
  - If so, it may serve the community better to release it as two separate plugins
  - If the two tasks are different, but very closely related, it's probably OK

## 插件应该如何表示新行被输出？

Always use `\n` to prevent diff issues between operating systems.

## 我在哪里可以获取到gulp的更新？

gulp updates can be found on the following twitters:

- [@wearefractal](https://twitter.com/wearefractal)
- [@eschoff](https://twitter.com/eschoff)
- [@gulpjs](https://twitter.com/gulpjs)

## gulp是否有一个IRC频道？

Yes, come chat with us in #gulpjs on [Freenode].

[Writing a gulp plugin]: writing-a-plugin/README.md
[gulp introduction slideshow]: http://slid.es/contra/gulp
[Freenode]: http://freenode.net/
[search-gulp-plugins]: http://gulpjs.com/plugins/
[npm plugin search]: https://npmjs.org/browse/keyword/gulpplugin
