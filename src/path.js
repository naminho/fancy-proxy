// Append to the stringified path, depending on the current access condition.
module.exports = (app, property, target) => {
  if (Array.isArray(target)) {
    app.path += `[${property}]`
  } else if (typeof property === 'function') {
    app.path += `${property}()`
  } else if (typeof property === 'string') {
    app.path += `${app.path ? '.' : ''}${property}`
  }
}
