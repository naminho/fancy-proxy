export default (app, property) => {
  if (property === '__isProxy') {
    return true
  }
  // Ignore node/jest related symbols
  if (typeof property !== 'symbol') {
    // console.warn(`Path '${path().toString()}' not found.'`)
  }
  app.path.clear(app)
  return undefined
}
