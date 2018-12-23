import initialize from './src/initialize'
import traps from './src/traps'

module.exports = (...args) => {
	const app = initialize(args)
	const {
		target, // The target object to be accessed directly.
		middleware, // This will be called with the path upon returning the result.
		handles, // Additional targets to be accessed through a custom handle.
		path // Stores the currently accessed path, can be set/read from anywhere.
	} = app

	return new Proxy(app.target, traps(app))
}
