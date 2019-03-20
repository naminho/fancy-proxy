import assign from 'object-assign'

// Allows for properly logging the proxy to a string, for debugging purposes.
export default (app, property, target, receiver) => {
  if (property === 'isProxy') {
    return true
  }

  if (property === Symbol.toStringTag) {
    if (Object.keys(app.target).length < 2 && app.target.constructor === Object) {
      // Returning an empty object will lead to undefined being returned.
      return '{}'
    }

    if (Array.isArray(app.target)) {
      return app.target
    }

    // Remove __fancyProxy property
    const clone = assign({}, app.target)
    delete clone['__fancyProxy']
    return clone
  }
}
