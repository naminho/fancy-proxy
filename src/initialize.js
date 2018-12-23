import invariant from 'invariant'
import isObject from 'is-object'
import target from './target'

// Initialize the app context, checking a few invariants and setting defaults.
module.exports = (args) => {
  invariant(args.length === 2,
    'Two arguments, an object and some options need to be passed to fancy-proxy.')

  const references = args[0]
  const options = args[1] || {}

  invariant(isObject(references) || Array.isArray(references),
    'The first argument passed to fancy-proxy needs to be an object or an array')
  invariant(isObject(options),
    'The second argument (options) passed to fancy proxy needs to be an object.')

  const middleware = options.middleware || (() => {})

  invariant(typeof middleware === 'function',
    'The middleware option passed to fancy-proxy needs to be a function.')

  const handles = options.handles || []

  invariant(Array.isArray(handles),
    'The handles option passed to fancy-proxy needs to be an array.')

  return {
    target: target(references),
    path: '',
    middleware,
    handles
  }
}
