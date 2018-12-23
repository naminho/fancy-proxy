import path from './../path'

// Custom trap for handles.
module.exports = (app, handles, walk) => ({
  get(target, property, receiver) {
    path(app, property, target)
    return walk(app, handles)
  }
})
