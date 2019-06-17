import has from './utils/has'
import notFound from './utils/not-found'
import log from './check/log'
import func from './check/func'
import store from './check/store'
import value from './check/value'
import handles from './handles'
import immutable from './immutable'

// Defines the traps on the proxy, currently only get, as this can be polyfilled
// with plain objects (big effort up front).
const traps = (app) => ({
  get(target, property, receiver) {
    let apply // Helper to decide if trap should return.
    if (apply = log(app, property, target, receiver)) {
      return apply
    }
    app.path.add(property, target)

    try {
      // Avoid creating proxy for a function, as this doesn't work.
      if (apply = func(app, property, target)) {
        return apply
      }
      // Return nested stores directly.
      if (apply = store(property, target)) {
        return apply
      }
      // Always try to create another proxy for nested access.
      // new Proxy() will throw when created with non-object value.
      // Those cases are caught below.
      return new Proxy(target[property], traps(app))
    } catch (error) {
      // Check if value can directly be returned.
      if (has(apply = value(app, property, target, receiver))) {
        return apply
      }
      // Check if path found on any of the handles.
      if (has(apply = handles(app, property, target))) {
        return apply
      }
      // Check immutable properties passed to options.
      if (has(apply = immutable(app, property, target))) {
        return apply
      }
      // Warn and return another proxy to avoid error, when accessing nested
      // unavailable properties.
      return notFound(app, property)
    }
  },
  set: (target, name, value) => {
    console.warn('Please use methods to update the state.')
    return true
  }
})

export default traps
