# Request for contributions

Please contribute to this repository if any of the following is true:
- You have expertise in community development, communication, or education
- You want open source communities to be more collaborative and inclusive
- You want to help lower the burden to first time contributors

# How to contribute

Prerequisites:

- familiarity with [GitHub PRs](https://help.github.com/articles/using-pull-requests) (pull requests) and issues
- knowledge of Markdown for editing `.md` documents

In particular, this community seeks the following types of contributions:

- ideas: participate in an Issues thread or start your own to have your voice
heard
- resources: submit a PR to add to [docs README.md](/docs/README.md) with links to related content
- outline sections: help us ensure that this repository is comprehensive. If
there is a topic that is overlooked, please add it, even if it is just a stub
in the form of a header and single sentence. Initially, most things fall into
this category
- write: contribute your expertise in an area by helping us expand the included
content
- copy editing: fix typos, clarify language, and generally improve the quality
of the content
- formatting: help keep content easy to read with consistent formatting
- code: Fix issues or contribute new features to this or any related projects

# Project structure

Gulp itself is tiny: index.js contains [very few lines of code](https://github.com/gulpjs/gulp/blob/4.0/index.js).
It is powered by a few other libraries which each handle a few specific tasks
each.

You can view all issues with the "help wanted" label across all gulp projects
here: https://github.com/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+user%3Agulpjs+label%3A%22help+wanted%22+

## Undertaker: task management

Undertaker handles task management in Gulp: the `gulp.task()`, `gulp.series()`
and `gulp.parallel()` functions. `gulp.series()` and `gulp.parallel()` are in
turn powered by Bach.

- https://github.com/gulpjs/undertaker
- https://github.com/gulpjs/bach

## vinyl-fs: file streams

vinyl-fs powers the `gulp.src()` and `gulp.dest()` functions: they take files
and globs specified by the user, turns them into a stream of file objects,
and then puts them back into the filesystem when `gulp.dest()` is called.

The file objects themselves are vinyl objects: that's another library (a simple
one!)

- https://github.com/gulpjs/vinyl-fs
- https://github.com/gulpjs/vinyl

## chokidar: file watching

`gulp.watch()` is using chokidar for file watching. It's actually wrapped in a
small library on the gulp organization, glob-watcher.

- https://github.com/paulmillr/chokidar
- https://github.com/gulpjs/glob-watcher

## gulp-cli: running gulp

Finally, we have gulp-cli. This uses liftoff to take what people run in the
command line and run the correct tasks. It works with both gulp 4 and older
versions of gulp.

- https://github.com/gulpjs/gulp-cli
- https://github.com/js-cli/js-liftoff

# Conduct

We are committed to providing a friendly, safe and welcoming environment for
all, regardless of gender, sexual orientation, disability, ethnicity, religion,
or similar personal characteristic.

On IRC, please avoid using overtly sexual nicknames or other nicknames that
might detract from a friendly, safe and welcoming environment for all.

Please be kind and courteous. There's no need to be mean or rude.
Respect that people have differences of opinion and that every design or
implementation choice carries a trade-off and numerous costs. There is seldom
a right answer, merely an optimal answer given a set of values and
circumstances.

Please keep unstructured critique to a minimum. If you have solid ideas you
want to experiment with, make a fork and see how it works.

We will exclude you from interaction if you insult, demean or harass anyone.
That is not welcome behavior. We interpret the term "harassment" as
including the definition in the
[Citizen Code of Conduct](http://citizencodeofconduct.org/);
if you have any lack of clarity about what might be included in that concept,
please read their definition. In particular, we don't tolerate behavior that
excludes people in socially marginalized groups.

Private harassment is also unacceptable. No matter who you are, if you feel
you have been or are being harassed or made uncomfortable by a community
member, please contact one of the channel ops or any of the
[gulpjs](https://github.com/orgs/gulpjs/people) core team
immediately. Whether you're a regular contributor or a newcomer, we care about
making this community a safe place for you and we've got your back.

Likewise any spamming, trolling, flaming, baiting or other attention-stealing
behavior is not welcome.


# Communication

There is an IRC channel on irc.freenode.net, channel `#gulpjs`. You're
welcome to drop in and ask questions, discuss bugs and such. The channel is
not currently logged.

GitHub issues are the primary way for communicating about specific proposed
changes to this project.

In both contexts, please follow the conduct guidelines above. Language issues
are often contentious and we'd like to keep discussion brief, civil and focused
on what we're actually doing, not wandering off into too much imaginary stuff.

# Frequently Asked Questions

See [the FAQ docs page](/docs/FAQ.md)
