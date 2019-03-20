import walk from './walk'

// If property can't be found on the simple target-object,
// this will check if it's found on any of the handles.
export default (app, property, target) => {
  const targetProperty = target[property]

  // A value was found, no need to check handles.
  if (typeof targetProperty !== 'undefined') {
    return
  }

  return walk(app, app.handles)
}
