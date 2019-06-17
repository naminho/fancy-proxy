// Calls middleware and cleans up, to be called when a match was found.
export default (app, value, type, pathInstance) => {
  const path = pathInstance || app.path
  app.middleware(path, value, type)
  path.clear(app)
}
