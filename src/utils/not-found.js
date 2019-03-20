import path from './../path'

// Get trap returning a Proxy recursively returning another Proxy.
const trapsEmptyProxy = () => ({
  get() {
    return new Proxy({}, trapsEmptyProxy())
  }
})

// Return an empty catch-all proxy if path wasn't found.
// Avoids type error when accessing not existing paths.
export default (app, property) => {
  if (property === '__isProxy') {
    return true
  }
  // Ignore node/jest related symbols
  if (typeof property !== 'symbol') {
    console.warn(`Path '${path().toString()}' not found.'`)
  }
  path().clear()
  return new Proxy({}, trapsEmptyProxy())
}
