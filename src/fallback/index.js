import merge from 'deepmerge'
import handles from './handles'
import immutable from './immutable'
import combineMerge from './../utils/combine-merge'

// Merge the target with the handles enhanced with middleware for methods.
export default app => {
  // Match order: target -> first handle -> ... -> last handle
  const targets = handles(app)
  targets.reverse()
  // Merge target with immutable properties.
  targets.push(immutable(app))
  // Store returned reference, to 'patch' changes later.
  return merge.all(targets, {
    arrayMerge: combineMerge,
    // Avoids copying object-references (needed for nested stores).
    clone: false
  })
}
