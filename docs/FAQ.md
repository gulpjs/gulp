# FAQ

## Why gulp? Why not ____?

See the [gulp introduction slideshow] for a rundown on how gulp came to be.

## Is it "gulp" or "Gulp"?

gulp is always lowercase.

## Where can I find a list of gulp plugins?

gulp plugins always include the `gulpplugin` keyword. [Search gulp plugins][search-gulp-plugins] or [view all plugins][npm plugin search].

## I want to write a gulp plugin, how do I get started?

See the [Writing a gulp plugin] wiki page for guidelines and an example to get you started.

## My plugin does ____, is it doing too much?

Probably. Ask yourself:

1. Is my plugin doing something that other plugins may need to do?
  - If so, that piece of functionality should be a separate plugin. [Check if it already exists on npm][npm plugin search].
1. Is my plugin doing two, completely different things based on a configuration option?
  - If so, it may serve the community better to release it as two separate plugins
  - If the two tasks are different, but very closely related, it's probably OK

## How should newlines be represented in plugin output?

Always use gulp-util.newline (which is \n) to prevent diff issues between operating systems.

## Where can I get updates on gulp?

gulp updates can be found on the following twitters:

- [@wearefractal](https://twitter.com/wearefractal)
- [@eschoff](https://twitter.com/eschoff)
- [@funkytek](https://twitter.com/funkytek)
- [@gulpjs](https://twitter.com/gulpjs)

## Does gulp have an IRC channel?

Yes, come chat with us in #gulpjs on [Freenode].

[Writing a gulp plugin]: writing-a-plugin/README.md
[gulp introduction slideshow]: http://slid.es/contra/gulp
[Freenode]: http://freenode.net/
[search-gulp-plugins]: http://gratimax.github.io/search-gulp-plugins/
[npm plugin search]: https://npmjs.org/browse/keyword/gulpplugin
