var pull = require('pull-stream')
var pullCat = require('pull-cat')
var computed = require('@mmckegg/mutant/computed')
var MutantPullReduce = require('../lib/mutant-pull-reduce')
var plugs = require('patchbay/plugs')
var sbot_log = plugs.first(exports.sbot_log = [])

exports.obs_recently_updated_feeds = function (limit) {
  var stream = pull(
    pullCat([
      sbot_log({reverse: true, limit: limit || 500}),
      sbot_log({old: false})
    ])
  )

  var result = MutantPullReduce(stream, (result, msg) => {
    result.add(msg.value.author)
    return result
  }, {
    startValue: new Set(),
    nextTick: true
  })

  result.has = function (value) {
    return computed(result, x => x.has(value))
  }

  return result
}
