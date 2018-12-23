import { read, call } from 'fancy-proxy/constants/types'
import traps from './traps'
import reduce from './reduce'
import seal from './../seal'

// "Walk" through the handles still in scope and look for property.
module.exports = (app, handles) => {
  // Reduce handles to the matching ones and return the index if value found.
  const { remaining, match } = reduce(app, handles)
console.log(app.path, remaining)
  // Three cases
  // 1) Property nowhere found on the handles.
  if (remaining.length === 0) {
    return
  }

  // 2) Property value found directly, call handler and return the value.
  if (typeof match !== 'undefined') {
    const { handler, value, target } = match
    const path = app.path // Would otherwise be lost by seal().

    if (typeof value === 'function') {
      seal(app, value, call)
      return () => handler(value, target, path, call) // TODO pass args.
    } else {
      seal(app, value, read)
      handler(value, target, path, read)
      return value
    }
  }

  // 3) Several possible paths found, return a new proxy with remaining ones.
  return new Proxy({}, traps(app, remaining, module.exports))
}
