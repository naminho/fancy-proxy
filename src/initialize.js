import invariant from 'invariant'
import isObject from 'is-object'
import assign from 'object-assign'
import invariants from './constants/invariants'
import has from './utils/has'
import mergeTarget from './target'
import initializeHandles from './handles/initialize'
import verifyHandles from './handles/verify'

// Parses the inputs, checks a few invariants, creates app context and sets defaults.
export default (args) => {
  if (process.env.NODE_ENV !== 'production') {
    invariant(args.length === 2, invariants.arguments)
  }

  const target = args[0]
  const options = args[1] || {}

  if (process.env.NODE_ENV !== 'production') {
    invariant(isObject(target) || Array.isArray(target), invariants.firstArgument)
    invariant(isObject(options), invariants.secondArgument)
  }

  options.immutable = options.immutable || {}

  if (options.debug || process.env.NODE_ENV !== 'production') {
    invariant(isObject(options.immutable), invariants.immutableOptionObject)
  }

  const middleware = options.middleware || (() => {})

  if (options.debug || process.env.NODE_ENV !== 'production') {
    invariant(typeof middleware === 'function', invariants.middleware)
  }

  const handles = initializeHandles(options.handles || [], options)

  const app = {
    middleware,
    handles,
    options
  }

  app.target = mergeTarget(app, target)
  app.target.__fancyProxy = true

  if ((options.debug || process.env.NODE_ENV !== 'production') && !options.ambiguous) {
    verifyHandles(app)
  }

  return app
}
