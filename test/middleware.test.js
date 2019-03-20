import run from './utils/run'
import * as objects from './data/objects'
import * as arrays from './data/arrays'
import { read, call } from './../src/constants/types'
import expectMiddleware from './utils/expect-middleware'

beforeAll(() => {
  // Hide 'path not found' warnings.
  console.warn = () => {}
})

run('Middleware isn\'t called initially', (fallback, fancy) => {
  const mockMiddleware = jest.fn()
  const proxy = fancy(objects.two(), {
    middleware: mockMiddleware
  })

  expect(mockMiddleware.mock.calls.length).toEqual(0)
})

run('Middleware returns the correct path for object access', (fallback, fancy) => {
  const mockMiddleware = jest.fn()
  const proxy = fancy(objects.two(), {
    middleware: mockMiddleware
  })

  proxy.count
  expectMiddleware(mockMiddleware, 0, 0, fallback, expect => expect.toEqual('count'))
  proxy.nested.count
  expectMiddleware(mockMiddleware, 1, 0, fallback, expect => expect.toEqual('nested.count'))
})

run('Middleware returns the correct path for array access', (fallback, fancy) => {
  const mockMiddleware = jest.fn()
  const proxy = fancy({ state: arrays.two(), deep: arrays.three() }, {
    middleware: mockMiddleware
  })

  proxy.state[0]
  expectMiddleware(mockMiddleware, 0, 0, fallback, expect => expect.toEqual('state[0]'))
  proxy.state[1][1]
  expectMiddleware(mockMiddleware, 1, 0, fallback, expect => expect.toEqual('state[1][1]'))
  proxy.deep[1].nested[2][0]
  expectMiddleware(mockMiddleware, 2, 0, fallback, expect => expect.toEqual('deep[1].nested[2][0]'))
})

run('Middleware only called for hits', (fallback, fancy) => {
  const mockMiddleware = jest.fn()
  const proxy = fancy({}, {
    middleware: mockMiddleware
  })

  proxy.missing
  expect(mockMiddleware.mock.calls.length).toEqual(0)
})

run('Middleware receives the proper arguments', (fallback, fancy) => {
  const mockMiddleware = jest.fn()
  const proxy = fancy({
    count: 1,
    increment: () => (2)
  }, {
    middleware: mockMiddleware
  })

  // Middleware arguments: path, value, type
  expect(proxy.count).toEqual(1)
  // Middleware would only be called in fallback mode, if on a handle.
  expect(proxy.increment()).toEqual(2)

  expect(mockMiddleware.mock.calls.length).toEqual(fallback ? 0 : 2)
  if (!fallback) {
    // count -> read
    expect(mockMiddleware.mock.calls[0][0].toString()).toEqual('count')
    expect(mockMiddleware.mock.calls[0][1]).toEqual(1)
    expect(mockMiddleware.mock.calls[0][2]).toEqual(read)
    // increment -> call
    expect(mockMiddleware.mock.calls[1][0].toString()).toEqual('increment()')
    expect(mockMiddleware.mock.calls[1][1]).toEqual(2)
    expect(mockMiddleware.mock.calls[1][2]).toEqual(call)
  }
})
