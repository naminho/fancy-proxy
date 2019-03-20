import { read, call } from './../constants/types'
import seal from './../seal'

// Call functions on the proxy, routing their args through middleware.
export default (app, property, target) => {
  const value = target[property]

  if (typeof value !== 'function') {
    return
  }

  return (...argsCall) => {
    const methodValue = value(...argsCall)
    seal(app, methodValue, call)
    return methodValue
  }
}
