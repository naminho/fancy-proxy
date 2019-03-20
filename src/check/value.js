import { read, call } from './../constants/types'
import seal from './../seal'

// Checks if value was found on the initial proxy target and returns it if so.
export default (app, property, target, receiver) => {
  if (typeof target[property] === 'undefined') {
    return
  }
  // Property found, call middleware before returning the value.
  seal(app, target[property], read)
  return Reflect.get(target, property, receiver)
}
