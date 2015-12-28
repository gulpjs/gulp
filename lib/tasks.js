'use strict'

var util = require('util')
var Stream = require('stream')
var thunks = require('thunks')
var thunkStream = require('thunk-stream')
var EventEmitter = require('events').EventEmitter

var slice = Array.prototype.slice
var thunk = thunks()

module.exports = Tasks

function Tasks () {
  var ctx = this
  this.actors = []
  this.isRunning = false
  this.tasks = Object.create(null)
  this.thunk = thunks(function (err) {
    ctx.emit('error', err)
    ctx.emit('err', err) // back compatible
  })
  EventEmitter.call(this)
}

util.inherits(Tasks, EventEmitter)

Tasks.prototype.task = function (name, task) {
  var dep = []
  if (typeof name !== 'string') throw new Error('Task requires a name that is a string')
  if (this.tasks[name]) throw new Error('Task ' + name + ' exists')
  if (Array.isArray(task)) {
    console.warn('Task dependencies has been deprecated. ' +
      'Use gulp.run or gulp.watch task triggering instead.')
    dep = task
    task = noOp
  }

  if (typeof task !== 'function') throw new Error('Task ' + name + ' requires a body that is a function')
  this.tasks[name] = new Task(name, task, dep)
  return this
}

Tasks.prototype.start = function () {
  var args = slice.call(arguments)
  if (!args.length) args.push('default')
  var cb = args[args.length - 1]
  if (typeof cb !== 'function') return this.thunk(this.run.apply(this, args))()
  return this.thunk(this.run.apply(this, args.slice(0, -1))(cb))
}

Tasks.prototype.run = function () {
  var args = slice.call(arguments)
  this.isRunning = true
  this.emit('start', args)
  return thunk.seq.call(this, evalTasks.call(this, args, true))(function (err) {
    this.cleanup()
    if (err) throw err
    this.emit('stop', this.actors.slice())
  })
}

Tasks.prototype.all = function (tasks) {
  tasks = Array.isArray(tasks) ? tasks : slice.call(arguments)
  return thunk.all.call(this, evalTasks.call(this, tasks))
}

Tasks.prototype.seq = function (tasks) {
  tasks = Array.isArray(tasks) ? tasks : slice.call(arguments)
  return thunk.seq.call(this, evalTasks.call(this, tasks))
}

Tasks.prototype.cleanup = function () {
  this.actors.map(function (name) {
    var task = this[name]
    task.fnPromise = null
    task.duration = 0
    task.hrDuration = 0
  }, this.tasks)
  this.isRunning = false
  this.actors.length = 0
}

Tasks.prototype.reset = function () {
  this.cleanup()
  this.tasks = Object.create(null)
}

function evalTask (name) {
  var task = this.tasks[name]
  if (!task) {
    var error = new Error('Task ' + name + ' not found')
    error.src = 'task_not_found'
    error.task = name
    this.emit('task_not_found', error)
    throw error
  }
  this.actors.push(name)
  return thunk.call(this, function (done) {
    var tasks = [task.eval(this)]
    if (task.dep.length) tasks.unshift(thunk.all(evalTasks.call(this, task.dep)))
    thunk.seq(tasks)(done)
  })
}

function evalTasks (tasks, evalSub) {
  return tasks.map(function (name) {
    if (evalSub && Array.isArray(name)) return thunk.all(evalTasks.call(this, name))
    return evalTask.call(this, name)
  }, this)
}

function Task (name, task, dep) {
  this.fn = task
  this.dep = dep
  this.name = name
  this.duration = 0 // seconds
  this.hrDuration = 0 // [seconds,nanoseconds]
  this.fnPromise = null
}

Task.prototype.eval = function (parent) {
  var ctx = this
  this.fnPromise = this.fnPromise || thunk.persist(function (callback) {
    ctx.duration = 0
    ctx.hrDuration = 0
    taskEmit(parent, ctx.name, 'start')

    var start = process.hrtime()
    var target = ctx.fn.length ? ctx.fn : ctx.fn.call(parent)
    var handle = target instanceof Stream ? thunkStream : thunk

    handle.call(parent, target)(function (err) {
      ctx.hrDuration = process.hrtime(start)
      ctx.duration = ctx.hrDuration[0] + (ctx.hrDuration[1] / 1e9)
      if (err) {
        taskEmit(parent, ctx.name, 'err', err)
        throw err
      }
      taskEmit(parent, ctx.name, 'stop', {hrDuration: ctx.hrDuration, duration: ctx.duration})
    })(callback)
  })
  return this.fnPromise
}

function noOp () {}

function taskEmit (ctx, taskName, eventName, data) {
  data = data || {}
  if (eventName === 'err') data.err = data // back compatible
  data.src = 'task_' + eventName
  data.task = taskName
  data.message = data.message || taskName + ' ' + eventName
  ctx.emit(data.src, data)
}
