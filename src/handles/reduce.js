// Only return the handles matching the path, return match if value found.
export default (app, handles) => {
  const remaining = [] // Stores handles with path on them.
  let match // Set, if value found matching the path exactly.

  handles.forEach(handle => {
    const {
      handler, // Object defining available handles.
      target // Function to be called for this handle.
    } = handle
    const value = app.path.find(target)

    if (typeof value === 'undefined') {
      return // Path not found on this handle.
    }

    // Replace last path token, since now found on the handle.
    app.path.replace(target)

    handle = {
      handler,
      target,
      value
    }

    // Objects can be further accessed, return only first match.
    if (typeof value !== 'object' && typeof match === 'undefined') {
      match = handle
    }

    remaining.push(handle)
  })

  return {
    remaining,
    match
  }
}
