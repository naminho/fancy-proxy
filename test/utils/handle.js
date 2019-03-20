import { read, call } from './../../src/constants/types'

// Simple handle method, calling the method for calls.
export default (inputs, target, value, path, type) => {
  if (type === call) {
    const staticArgs = [target, path, type]
    const methodArgs = [].slice.call(inputs).concat(staticArgs)
    return value.apply(null, methodArgs)
  } else {
    return value
  }
}
