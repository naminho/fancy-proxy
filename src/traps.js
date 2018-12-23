import path from './path'
import handles from './handles'
import value from './value'
import func from './func'

// Defines the traps on the proxy, currently only get, as this can be polyfilled
// with plain objects (big effort up front).
const traps = (app) => ({
  get(target, property, receiver) {
    let apply
    path(app, property, target)

    try {
      // Avoid creating proxy for a function, as this doesn't work.
      if (apply = func(app, property, target)) {
        console.log('func')
        return apply
      }
      // Always try to create another proxy for nested access.
      return new Proxy(target[property], traps(app))
    } catch (error) {
      // new Proxy() will throw when created with non-object value.
      // Check if value can directly be returned.
      if (apply = value(app, property, target, receiver)) {
        return apply
      }
      // Check if path found on any of the handles.
      if (apply = handles(app, property, target)) {
        return apply
      }
      // Warn and return another proxy to avoid error, when accessing nested
      // unavailable properties.
      console.warn(`Path '${app.path}' not found.'`)
      return new Proxy({}, traps(app))
    }
  }
})

module.exports = traps
