import tokens from './tokens'
import has from './../utils/has'

export default class Path {
  // Create with an existing or new path.
  constructor(path) {
    this.path = path || []
  }

  // Add a property to the path.
  add(property, target) {
    if (Array.isArray(target)) {
      this.path.push(tokens.array(property)())
    } else if (target && typeof target[property] === 'function') {
      this.path.push(tokens.func(property)())
    } else if (typeof property === 'string') {
      this.path.push(tokens.property(property)())
    }
  }

  // Replaces last path token with a new one.
  replace(target) {
    if (this.path.length === 0) return
    if (!this.path[this.path.length - 1]) {
      console.error(this.path)
    }
    const property = this.path[this.path.length - 1].value
    this.path.pop()
    target = this.find(target)
    this.add(property, target)
  }

  // Check if the current path is found on the target passed.
  find(target) {
    let value = target
    for (let index = 0; index < this.path.length; index++) {
      value = this.path[index].apply(value)
      if (!has(value)) {
        return
      }
    }
    return value
  }

  // Get a string representation of the path.
  toString() {
    return this.path
      .map(token => token.toString())
      .join('')
      .replace(/^\.+/g, '') // Removes starting '.'
  }

  get [Symbol.toStringTag]() {
    return this.toString()
  }

  // Resets the path while returning the old path.
  // Used to clear path for next access.
  clear(app) {
    const old = app.path
    app.path = new Path()
    return old
  }
}
