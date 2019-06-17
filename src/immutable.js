import has from './utils/has'

// Checks if value was found on the initial proxy target and returns it if so.
export default app => {
  const value = app.path.find(app.options.immutable)
  if (!has(value)) return
  // No middleware call needed, manually clear.
  app.path.clear(app)
  return value
}
