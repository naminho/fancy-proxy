import traps from './traps'
import fallback from './fallback'

// Use proxy if available, otherwise recreate matching object manually.
export default (app) => {
  if (typeof Proxy !== 'undefined' && !app.options.fallback) {
    return new Proxy(app.target, traps(app))
  }

  return fallback(app)
}
