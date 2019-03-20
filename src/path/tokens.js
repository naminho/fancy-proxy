import { property, func, array } from './../constants/tokens'

// Creates tokens for different types of object accessors.
export default {
  property: name => () => {
    const value = name

    return {
      value,
      apply: ref => (ref[value]),
      type: property,
      name: () => value,
      toString: () => `.${value}`
    }
  },
  func: name => () => {
    const value = name

    return {
      value,
      apply: ref => (ref[value]),
      type: func,
      toString: () => `.${value}()`
    }
  },
  array: name => () => {
    const value = name

    return {
      value,
      apply: ref => (ref[value]),
      type: array,
      toString: () => `[${value}]`
    }
  }
}
