import fancyProxy from './..'

test('Can init with a simple object and no options.', () => {
  const proxy = fancyProxy({}, {})
  expect(proxy).toBeDefined()
})

test('Can init with an empty array and no options.', () => {
  const proxy = fancyProxy([], {})
  expect(proxy).toBeDefined()
})
