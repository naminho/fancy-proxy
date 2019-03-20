import merge from 'deepmerge'

const emptyTarget = value => Array.isArray(value) ? [] : {}
const clone = (value, options) => merge(emptyTarget(value), value, options)

// Deep merge arrays, copied from:
// https://github.com/TehShrike/deepmerge/blob/master/readme.md
// Added/changed unshift part to preserve merging order for simple arrays, too.
export default (target, source, options) => {
  const destination = target.slice()
  const unshift = []

  source.forEach(function(e, i) {
    if (typeof destination[i] === 'undefined') {
      const cloneRequested = options.clone !== false
      const shouldClone = cloneRequested && options.isMergeableObject(e)
      destination[i] = shouldClone ? clone(e, options) : e
    } else if (options.isMergeableObject(e)) {
      destination[i] = merge(target[i], e, options)
    } else if (target.indexOf(e) === -1) {
      unshift.push(e)
    }
  })

  if (unshift.length > 0) {
    unshift.reverse().forEach((value) => (destination.unshift(value)))
  }

  return destination
}
