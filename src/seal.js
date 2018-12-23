// Calls middleware and cleans up, to be called when a match was found.
module.exports = (app, value, type) => {
  app.middleware(app.path, type, value)
  app.path = '' // Reset path for next access.
}
