import { read, call } from './../constants/types'
import seal from './seal'

module.exports = (app, property, target) => {
  const value = target[property]

  if (typeof value !== 'function') {
    return
  }

  // TODO wrap method in middleware, so that it's only called if accessed.

  seal(app, value)
  return value
}
