// Custom trap for handles.
export default (app, handles, walk) => ({
  get(target, property, receiver) {
    app.path.add(property, target)
    return walk(app, handles)
  }
})
