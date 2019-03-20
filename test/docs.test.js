import run from './utils/run'

// Tests for examples found in the README.
run('Products store with middlware', (fallback, fancy) => {
  if (fallback) return
  global.console.log = jest.fn()
  const target = {
    products: [
      'apple',
      'banana',
      'citron'
    ]
  }
  const options = {
    middleware: path => console.log(path)
  }
  const proxy = fancy(target, options)

  expect(global.console.log.mock.calls.length).toEqual(0)

  proxy.products.length === 3     // logs: products.length
  expect(global.console.log.mock.calls.length).toEqual(1)
  expect(global.console.log.mock.calls[0][0].toString()).toEqual('products[length]')
  proxy.products[1] === 'banana'  // logs: products[1]
  expect(global.console.log.mock.calls.length).toEqual(2)
  expect(global.console.log.mock.calls[1][0].toString()).toEqual('products[1]')
})

run('Handle with add method', (fallback, fancy) => {
  const proxy = fancy({
    count: 5
  }, {
    handles: [
      {
        target: {
          add: (inputs, target) => {
            // Add the sum of inputs to the count.
            const add = (a, b) => (a + b)
            const total = inputs.reduce(add, 0)
            target.count += total
            return total
          }
        },
        handler: (inputs, target, value, path, type) => {
          if (type === 'read') {
            return value
          }

          return value.apply(null, [inputs, target])
        }
      }
    ]
  })

  expect(proxy.count).toEqual(5)
  expect(proxy.add()).toEqual(0)
  expect(proxy.count).toEqual(5)
  expect(proxy.add(4)).toEqual(4)
  expect(proxy.count).toEqual(9)
  expect(proxy.add(5, 6)).toEqual(11)
  expect(proxy.count).toEqual(20)
})
