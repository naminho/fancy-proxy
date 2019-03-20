import fancy from 'fancy-proxy'

// All tests should also successfully run with the fallback option, therefore
// this util will run the test twice once with and once without the option.
export default (name, runner) => {
  const create = (fallback, target, options) => {
    if (options) {
      options.fallback = fallback
      return fancy(target, options)
    } else {
      return fancy(target)
    }
  }

  test(`${name}.`, () => runner(false, create.bind(null, false)))
  test(`${name} with fallback option.`,
    () => runner(true, create.bind(null, true)))
}
