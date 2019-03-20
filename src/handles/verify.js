import traverse from 'traverse'
import invariant from 'invariant'
import invariants from './../constants/invariants'
import get from './../utils/get'

// Verify that handle properties are unique.
export default app => {
  app.handles.forEach(({ target }) => {
    const tree = traverse(target)
    const paths = tree.paths()
    let index = 0

    tree.forEach(function(value) {
      if (!this.isLeaf) return

      if (get(app.target, this.path) !== undefined) {
        console.warn(invariants.handleFoundOnTarget(this.path.join('.')))
      }

      app.handles.forEach(({ target: otherTarget }) => {
        if (otherTarget === target) return

        if (get(otherTarget, this.path) !== undefined) {
          console.warn(invariants.handleFoundOnOtherHandle(this.path.join('.')))
        }
      })
    })
  })
}
