import run from './utils/run'
import fancyNoFallback from 'fancy-proxy'
import { read, call } from './../src/constants/types'
import { one, two, three } from './data/objects'
import { counter, nested } from './data/handles'
import { simple } from './data/methods'
import expectMiddleware from './utils/expect-middleware'
import handle from './utils/handle'

beforeAll(() => {
  // Hide 'path not found' warnings.
  console.warn = () => {}
})

run('Handle will be called upon method access', (fallback, fancy) => {
  const mockHandle = jest.fn(handle)
  const mockMiddleware = jest.fn()
  const mockIncrement = jest.fn((target, path, type) => {
    return target.count += 1
  })
  const proxy = fancy({
    count: 1
  }, {
    handles: [
      [ counter(mockIncrement), mockHandle ]
    ],
    middleware: mockMiddleware
  })

  expect(proxy.increment()).toEqual(2)
  expect(mockMiddleware.mock.calls.length).toEqual(1)
  expectMiddleware(mockMiddleware, 0, 0, fallback, expect => expect.toEqual('increment()'))
  expectMiddleware(mockMiddleware, 0, 1, fallback, expect => expect.toEqual(2))
  expectMiddleware(mockMiddleware, 0, 2, fallback, expect => expect.toEqual(call))
  expect(mockIncrement.mock.calls.length).toEqual(1)
  expect(mockHandle.mock.calls.length).toEqual(1)
  expect(mockHandle.mock.calls[0][4]).toEqual(call)

  expect(proxy.count).toEqual(2)
  expect(mockMiddleware.mock.calls.length).toEqual(fallback ? 1 : 2)
  expectMiddleware(mockMiddleware, 1, 0, fallback, expect => expect.toEqual('count'))
  expectMiddleware(mockMiddleware, 1, 1, fallback, expect => expect.toEqual(2))
  expectMiddleware(mockMiddleware, 1, 2, fallback, expect => expect.toEqual(read))
  expect(mockHandle.mock.calls.length).toEqual(1)
})

run('Functions on handles will be called in context', (fallback, fancy) => {
  const mockIncrement = jest.fn((target, path, type) => {
    return target.count += 1
  })
  const mockHandle = jest.fn(handle)
  const mockMiddleware = jest.fn()
  const proxy = fancy({
    count: 1
  }, {
    handles: [
      [ counter(mockIncrement), mockHandle ]
    ],
    middleware: mockMiddleware
  })

  expect(proxy.count).toEqual(1)

  proxy.increment()

  expect(proxy.count).toEqual(2)
  expect(mockMiddleware.mock.calls.length).toEqual(fallback ? 1 : 3)
  expectMiddleware(mockMiddleware, 1, 0, fallback, expect => expect.toEqual('increment()'))
  expect(mockHandle.mock.calls.length).toEqual(1)
  expectMiddleware(mockHandle, 0, 1, fallback, expect => expect.toBeInstanceOf(Object))
  expectMiddleware(mockHandle, 0, 1, fallback, expect => expect.toHaveProperty('count', 2))
  expectMiddleware(mockHandle, 0, 4, fallback, expect => expect.toEqual(call))
  expect(mockIncrement.mock.calls.length).toEqual(1)

  proxy.increment()

  expect(proxy.count).toEqual(3)
  expect(mockIncrement.mock.calls.length).toEqual(2)
})

run('Only the first matching handle will be called', (fallback, fancy) => {
  const mockIncrement = jest.fn()
  const mockIncrement2 = jest.fn()
  const mockHandle = jest.fn(handle)
  const mockHandle2 = jest.fn(handle)
  const proxy = fancy({}, {
    handles: [
      [ counter(mockIncrement), mockHandle ],
      [ counter(mockIncrement2), mockHandle2 ]
    ],
    ambiguous: true
  })

  proxy.increment()

  expect(mockHandle.mock.calls.length).toEqual(1)
  expect(mockHandle2.mock.calls.length).toEqual(0)
  expect(mockIncrement.mock.calls.length).toEqual(1)
  expect(mockIncrement2.mock.calls.length).toEqual(0)
})

run('If several handles match a path each path will be considered', (fallback, fancy) => {
  const mockHandle = jest.fn()
  const mockHandle2 = jest.fn()
  const mockMiddleware = jest.fn()
  const proxy = fancy({}, {
    handles: [
      {
        target: { nested: { this: () => {} } },
        handler: mockHandle
      },
      {
        target: { nested: { that: () => {} } },
        handler: mockHandle2
      }
    ],
    middleware: mockMiddleware
  })

  proxy.nested.that()

  expect(mockHandle.mock.calls.length).toEqual(0)
  expect(mockHandle2.mock.calls.length).toEqual(1)

  expect(mockMiddleware.mock.calls[0][0].toString()).toEqual('nested.that()')
})

run('Handles and the regular object can be combined', (fallback, fancy) => {
  const mockHandle = jest.fn()
  const mockHandle2 = jest.fn()
  const mockHandle3 = jest.fn()
  const mockMiddleware = jest.fn()
  const proxy = fancy({
    nested: {
      foo: mockHandle3
    }
  }, {
    handles: [
      [ { nested: { this: () => {} } }, mockHandle ],
      [ { nested: { that: () => {} } }, mockHandle2 ]
    ],
    middleware: mockMiddleware
  })

  proxy.nested.that()

  expect(mockHandle.mock.calls.length).toEqual(0)
  expect(mockHandle2.mock.calls.length).toEqual(1)

  expect(mockMiddleware.mock.calls[0][0].toString()).toEqual('nested.that()')

  proxy.nested.foo()

  // Mock shouldn't be called, found on the target.
  expect(mockHandle.mock.calls.length).toEqual(0)
  expect(mockHandle2.mock.calls.length).toEqual(1)
  expect(mockHandle3.mock.calls.length).toEqual(1)

  expect(mockMiddleware.mock.calls.length).toEqual(fallback ? 1 : 2)
  expectMiddleware(mockMiddleware, 1, 0, fallback, expect => expect.toEqual('nested.foo()'))
})

run('Methods return value upon call', (fallback, fancy) => {
  const mockHandle = jest.fn(handle)
  const mockIncrement = jest.fn(() => (5))
  const mockDecrement = jest.fn(() => (6))
  const mockMiddleware = jest.fn()
  const proxy = fancy({}, {
    handles: [
      [ simple(mockIncrement, mockDecrement), mockHandle ]
    ],
    middleware: mockMiddleware
  })

  expect(proxy.increment()).toEqual(5)
  expect(proxy.decrement()).toEqual(6)

  expect(mockHandle.mock.calls.length).toEqual(2)
  expect(mockIncrement.mock.calls.length).toEqual(1)
  expect(mockDecrement.mock.calls.length).toEqual(1)
})

run('Handles receive the proper arguments', (fallback, fancy) => {
  const mockHandle = jest.fn((inputs, target, method, path, type) => {
    if (type === call) {
      return method(inputs[0], inputs[1], target, path, type)
    } else {
      return method
    }
  })
  const mockIncrement = jest.fn(() => (5))
  const mockDecrement = jest.fn(() => (6))
  const mockMiddleware = jest.fn()
  const proxy = fancy({
    count: 1
  }, {
    handles: [
      [ simple(mockIncrement, mockDecrement), mockHandle ]
    ],
    middleware: mockMiddleware
  })

  expect(proxy.increment('value', 'secondValue')).toEqual(5)

  expect(mockHandle.mock.calls.length).toEqual(1)
  expect(mockHandle.mock.calls[0].length).toEqual(5)
  expect(mockHandle.mock.calls[0][0]).toEqual(['value', 'secondValue'])
  expect(mockHandle.mock.calls[0][1]).toHaveProperty('count')
  expect(mockHandle.mock.calls[0][3].toString()).toEqual('increment()')
  expect(mockHandle.mock.calls[0][4]).toEqual(call)
  expect(mockIncrement.mock.calls[0].length).toEqual(5)
  expect(mockIncrement.mock.calls[0][0]).toEqual('value')
  expect(mockIncrement.mock.calls[0][1]).toEqual('secondValue')
  expect(mockIncrement.mock.calls[0][2]).toHaveProperty('count')
  expect(mockIncrement.mock.calls[0][3].toString()).toEqual('increment()')
  expect(mockIncrement.mock.calls[0][4]).toEqual(call)
})

run('Handles can modify the target', (fallback, fancy) => {
  const mockHandle = jest.fn(handle)
  const mockIncrement = jest.fn((target) => (++target.count))
  const mockDecrement = jest.fn((value, target) => (target.count = target.count - value))
  const proxy = fancy({
    count: 1,
    nested: {
      count: 2
    }
  }, {
    handles: [
      [ nested(mockIncrement, mockDecrement), mockHandle ]
    ],
    ambiguous: true
  })

  expect(proxy.count).toEqual(1)
  expect(proxy.increment()).toEqual(2)
  expect(proxy.count).toEqual(2)
  expect(proxy.decrement(2)).toEqual(0)
  expect(proxy.count).toEqual(0)
})

run('Handle receives the proper target', (fallback, fancy) => {
  const mockHandle = jest.fn(handle)
  const mockIncrement = jest.fn((target, path, type) => {
    return target.count += 1
  })
  const proxy = fancy({
    count: 1,
    main: {
      count: 5
    }
  }, {
    handles: [
      [ counter(mockIncrement), mockHandle ],
      [ { handle: { count: 6 }}, mockHandle]
    ]
  })

  expect(proxy.increment()).toEqual(2)
  expect(mockHandle.mock.calls[0][1]).toHaveProperty('main')
  expect(mockHandle.mock.calls[0][1]).not.toHaveProperty('handle')
  expect(mockHandle.mock.calls[0][1]).toHaveProperty('count')
})

test('Warns when property of handle found on target.', () => {
  process.env = Object.assign(process.env, { NODE_ENV: 'development' })
  global.console.warn = jest.fn()
  const target = {
    count: 1
  }
  const options = {
    handles: [
      {
        target: {
          count: 2
        },
        handler: () => {}
      }
    ]
  }

  expect(global.console.warn.mock.calls.length).toEqual(0)

  const store = fancyNoFallback(target, options)

  expect(global.console.warn.mock.calls.length).toEqual(1)

  expect(global.console.warn.mock.calls[0][0]).toEqual('The handle property \'count\' was found both on the target and a handle, properties must be unique.')

  options.ambiguous = true // Ambiguous option can be used to bypass check.

  const ambiguousStore = fancyNoFallback(target, options)

  expect(global.console.warn.mock.calls.length).toEqual(1)

  process.env = Object.assign(process.env, { NODE_ENV: 'production' })
})

test('Warns when nested property of handle found on target.', () => {
  process.env = Object.assign(process.env, { NODE_ENV: 'development' })
  global.console.warn = jest.fn()
  const target = {
    nested: {
      count: 1
    }
  }
  const options = {
    handles: [
      {
        target: {
          nested: {
            count: 2
          }
        },
        handler: () => {}
      }
    ]
  }

  const store = fancyNoFallback(target, options)

  expect(global.console.warn.mock.calls[0][0]).toEqual('The handle property \'nested.count\' was found both on the target and a handle, properties must be unique.')
  process.env = Object.assign(process.env, { NODE_ENV: 'production' })
})

test('Warns when a property of handle found on another handle as well.', () => {
  process.env = Object.assign(process.env, { NODE_ENV: 'development' })
  global.console.warn = jest.fn()
  const target = {}
  const options = {
    handles: [
      {
        target: {
          count: 1
        },
        handler: () => {}
      },
      {
        target: {
          count: 2
        },
        handler: () => {}
      }
    ]
  }

  const store = fancyNoFallback(target, options)

  expect(global.console.warn.mock.calls[0][0]).toEqual('The handle property \'count\' was found on another handle as well, must be unique.')
  process.env = Object.assign(process.env, { NODE_ENV: 'production' })
})

test('Warns when a nested property of handle found on another handle as well.', () => {
  process.env = Object.assign(process.env, { NODE_ENV: 'development' })
  global.console.warn = jest.fn()
  const target = {}
  const options = {
    handles: [
      {
        target: {
          nested: {
            count: 1
          }
        },
        handler: () => {}
      },
      {
        target: {
          nested: {
            count: 2
          }
        },
        handler: () => {}
      }
    ]
  }

  const store = fancyNoFallback(target, options)

  expect(global.console.warn.mock.calls[0][0]).toEqual('The handle property \'nested.count\' was found on another handle as well, must be unique.')
  process.env = Object.assign(process.env, { NODE_ENV: 'production' })
})

test('Doesn\'t warn when the leafs differ.', () => {
  process.env = Object.assign(process.env, { NODE_ENV: 'development' })
  global.console.warn = jest.fn()
  const target = {}
  const options = {
    handles: [
      {
        target: {
          nested: {
            countOne: 1
          }
        },
        handler: () => {}
      },
      {
        target: {
          nested: {
            countTwo: 2
          }
        },
        handler: () => {}
      }
    ]
  }

  const store = fancyNoFallback(target, options)

  expect(global.console.warn.mock.calls.length).toEqual(0)
  process.env = Object.assign(process.env, { NODE_ENV: 'production' })
})

test('Unique comparison also works with arrays in the tree.', () => {
  process.env = Object.assign(process.env, { NODE_ENV: 'development' })
  global.console.warn = jest.fn()
  const target = {}
  const options = {
    handles: [
      {
        target: {
          nested: [
            {
              count: 1
            }
          ]
        },
        handler: () => {}
      },
      {
        target: {
          nested: [
            {
              count: 2
            }
          ]
        },
        handler: () => {}
      }
    ]
  }

  const store = fancyNoFallback(target, options)

  expect(global.console.warn.mock.calls[0][0]).toEqual('The handle property \'nested.0.count\' was found on another handle as well, must be unique.')
  process.env = Object.assign(process.env, { NODE_ENV: 'production' })
})

test('Unique comparison also works with arrays in the tree won\'t warn if indexes differ.', () => {
  process.env = Object.assign(process.env, { NODE_ENV: 'development' })
  global.console.warn = jest.fn()
  const target = {}
  const options = {
    handles: [
      {
        target: {
          nested: [
            {
              first: 1
            },
            {
              second: 2
            }
          ]
        },
        handler: () => {}
      },
      {
        target: {
          nested: [
            {
              second: 2
            },
            {
              first: 1
            }
          ]
        },
        handler: () => {}
      }
    ]
  }

  const store = fancyNoFallback(target, options)

  expect(global.console.warn.mock.calls.length).toEqual(0)
  process.env = Object.assign(process.env, { NODE_ENV: 'production' })
})
