import merge from 'deepmerge'
import combineMerge from './utils/combine-merge'

// Create the proxy target object directly or by merging several objects.
// Handle objects will not be added to the target on initialize.
// new Proxy({} <= THIS, traps)
export default (app, target) => {
	// If target is a single object, reference it directly, regular proxy.
	if (typeof target === 'object' && !Array.isArray(target)) {
		return target
	}

  // Otherwise merge objects into a single one.
	if (Array.isArray(target)) {
		// Use deep-merge instead of object-assign to avoid overriding deep props.
		return merge.all(target, {
			clone: false
	  })
	}

  return {}
}
