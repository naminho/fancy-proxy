// Get access middleware for non-functions not supported with fallback, ignore.
export default (mockMiddleware, call, arg, fallback, check) => {
  if (!fallback) {
    const value = mockMiddleware.mock.calls[call][arg]
    // Stringify the Path (arg 0).
    return check(expect(arg === 0 ? value.toString() : value))
  }
}
