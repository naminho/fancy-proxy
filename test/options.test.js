import run from './utils/run'

run('Immutable option adds properties to the store', (fallback, fancy) => {
  const proxy = fancy({
    count: 5
  }, {
    immutable: {
      hello: 'world',
      func: () => (8),
      nested: {
        counter: 9
      },
      // Won't override state.
      count: 3
    }
  })

  expect(proxy.count).toEqual(5)
  expect(proxy.hello).toEqual('world')
  expect(proxy.func()).toEqual(8)
  expect(proxy.nested.counter).toEqual(9)
})
