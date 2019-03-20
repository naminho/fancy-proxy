import invariant from 'invariant'
import isObject from 'is-object'
import invariants from './../constants/invariants'

export default (handles, options, globalTarget) => {
  if (options.debug || process.env.NODE_ENV !== 'production') {
    invariant(Array.isArray(handles), invariants.handles)
  }

  return handles.map(handle => {
    if (Array.isArray(handle)) {
      if (options.debug || process.env.NODE_ENV !== 'production') {
        invariant(handle.length === 2, invariants.arrayHandle)
      }
      // Convert to object.
      return {
        target: handle[0],
        handler: handle[1]
      }
    }

    if (options.debug || process.env.NODE_ENV !== 'production') {
      invariant(isObject(handle), invariants.objectHandle)
      invariant(
        typeof handle.target !== undefined &&
        typeof handle.handler !== undefined,
        invariants.objectHandleProperties
      )
    }

    return handle
  })
}
