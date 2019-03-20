import { read } from './../constants/types'
import traps from './handle-trap'
import reduce from './reduce'
import seal from './../seal'
import call from './call'
import path from './../path'

let walk

// "Walk" through the handles still in scope and look for property.
walk = (app, handles) => {
  // Reduce handles to the matching ones and return the index if value found.
  const { remaining, match } = reduce(app, handles)

  // Three cases
  // 1) Property nowhere found on the handles.
  if (remaining.length === 0) {
    return
  }

  // 2) Property value found directly, call handler and return the value.
  if (typeof match !== 'undefined') {
    const { handler, value, target } = match

    if (typeof value === 'function') {
      return call(app, value, handler)
    }

    handler([], app.target, value, path(), read)
    seal(app, value, read)
    return value
  }

  // 3) Several possible paths found, return a new proxy with remaining ones.
  // Pass itself, to avoid circular dependency.
  return new Proxy({}, traps(app, remaining, walk))
}

export default walk
