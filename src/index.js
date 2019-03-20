import initialize from './initialize'
import proxy from './proxy'

export default (...args) => {
	const app = initialize(args)
	const {
		target, // The target object to be accessed directly, passed to handlers.
		middleware, // This will be called with the path upon returning the result.
		handles, // Additional targets to be accessed through a custom handle.
		options // The options passed from the user.
	} = app

	// If available returns Proxy, otherwise fallback object with the same API.
	return app.proxy = proxy(app)
}
