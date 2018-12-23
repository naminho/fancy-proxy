import merge from 'deepmerge'

// Create the proxy target object directly or by merging several objects.
// Handle objects will not be added to the target on initialize.
// new Proxy({} <= THIS, traps)
module.exports = (references) => {
  // If target is a single object, reference it directly, regular proxy.
	if (typeof references === 'object' && !Array.isArray(references)) {
		return references
	}

  // Otherwise merge objects into a single one.
	if (Array.isArray(references)) {
		// Use deep-merge instead of object-assign to avoid overriding deep props.
		return merge.all(references)
	}

  return {}
}
