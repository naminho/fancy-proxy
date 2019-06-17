import { read, call } from './../constants/types'
import seal from './../seal'

// Call functions on the proxy, routing their args through middleware.
export default (app, property, target) => {
  const value = target[property]

  // If a method call is made to an array, return the prototype method.
  if (typeof value !== 'function' || Array.isArray(target)) {
    return
  }

  return (...argsCall) => {
    const methodValue = value(...argsCall)
    seal(app, methodValue, call)
    return methodValue
  }
}
