import walk from './walk'

// If property can't be found on the simple target-object,
// this will check if it's found on any of the handles.
module.exports = (app, property, target) => {
  const targetProperty = target[property]

  // A value was found, no need to check handles.
  if (typeof targetProperty !== 'undefined') {
    return
  }

  console.log('in', property)

  return walk(app, app.handles)
}
