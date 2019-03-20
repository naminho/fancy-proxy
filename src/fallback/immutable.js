import assign from 'object-assign'
import invariant from 'invariant'
import invariants from './../constants/invariants'

// Merge target with immutable properties.
export default app => {
  const immutable = app.options.immutable
  if (Object.keys(immutable).length === 0) {
    return app.target
  }
  invariant(!Array.isArray(app.target), invariants.arrayTargetWithImmutableProperties)
  return assign(immutable, app.target)
}
