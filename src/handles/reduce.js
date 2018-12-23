import get from 'lodash.get'

// Only return the handles matching the path, return match if value found.
module.exports = (app, handles) => {
  const remaining = [] // Stores handles with path on them.
  let match // Set, if value found matching the path exactly.

  handles.forEach((handle) => {
    const target = handle[0] // Object defining available handles.
    const handler = handle[1] // Function to be called for this handle.
    const value = get(target, app.path)

    if (typeof value === 'undefined') {
      return // Path not found on this handle.
    }

    handle = {
      handler,
      value,
      target
    }

    // Objects can be further accessed, return only first match.
    if (typeof value !== 'object' && typeof match !== 'number') {
      match = handle
    }

    remaining.push(handle)
  })

  return {
    remaining,
    match
  }
}
