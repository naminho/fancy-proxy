import traverse from 'traverse'
import seal from './../seal'
import call from './../handles/call'

// Traverse handle targets and override methods to call handler and middleware.
export default (app) => {
  return app.handles.map((handle) => {
    const {
      handler, // Object defining available handles.
      target // Function to be called for this handle.
    } = handle

    const tree = traverse(target)
    const paths = tree.paths()
    let index = 0

    tree.forEach(function(value) {
      const currentIndex = index++ // Used to find paths later on.
      // Enhance methods found on the target, same logic as in walk.js.
      if (typeof value === 'function') {
        // this.update() will modify the original.
        this.update((...inputArgs) => {
          const currentPaths = paths[currentIndex]
          let currentTarget = target
          currentPaths.forEach(currentPath => {
            app.path.add(currentPath, currentTarget)
            currentTarget = currentTarget[currentPath]
          })
          const returnValue = call(app, value, handler)(...inputArgs)
          return returnValue
        })
      }
    })

    return target
  })
}
