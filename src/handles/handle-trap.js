import path from './../path'

// Custom trap for handles.
export default (app, handles, walk) => ({
  get(target, property, receiver) {
    path().add(property, target)
    return walk(app, handles)
  }
})
