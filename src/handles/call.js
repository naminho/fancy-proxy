import assign from 'object-assign'
import { call } from './../constants/types'
import seal from './../seal'

// Creates a new method, that will call the handle when called itself.
export default (app, method, handler) => {
  const outerPath = app.path.clear(app)
  return (...inputArgs) => {
    // NOTE that other paths may be created during this call.
    const returnValue = handler.call(null, inputArgs, app.target, method, outerPath, call)
    seal(app, returnValue, call, outerPath)
    // 'Patch' top-level object references to carry over changes.
    if (app.options.fallback) {
      assign(app.proxy, app.target)
    }
    return returnValue
  }
}
