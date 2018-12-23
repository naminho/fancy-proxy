import fancyProxy from './..'
import * as objects from './data/objects'
import * as arrays from './data/arrays'

test('Middleware isn\'t called initially.', () => {
  const mockMiddleware = jest.fn()
  const proxy = fancyProxy(objects.two(), {
    middleware: mockMiddleware
  })

  expect(mockMiddleware.mock.calls.length).toEqual(0)
})

test('Middleware returns the correct path for object access.', () => {
  const mockMiddleware = jest.fn()
  const proxy = fancyProxy(objects.two(), {
    middleware: mockMiddleware
  })

  proxy.count
  expect(mockMiddleware.mock.calls[0][0]).toEqual('count')
  proxy.nested.count
  expect(mockMiddleware.mock.calls[1][0]).toEqual('nested.count')
})

test('Middleware returns the correct path for array access.', () => {
  const mockMiddleware = jest.fn()
  const proxy = fancyProxy({ state: arrays.two(), deep: arrays.three() }, {
    middleware: mockMiddleware
  })

  proxy.state[0]
  expect(mockMiddleware.mock.calls[0][0]).toEqual('state[0]')
  proxy.state[1][1]
  expect(mockMiddleware.mock.calls[1][0]).toEqual('state[1][1]')
  proxy.deep[1].nested[2][0]
  expect(mockMiddleware.mock.calls[2][0]).toEqual('deep[1].nested[2][0]')
})

test('Middleware only called for hits.', () => {
  const mockMiddleware = jest.fn()
  const proxy = fancyProxy({}, {
    middleware: mockMiddleware
  })

  proxy.missing
  expect(mockMiddleware.mock.calls.length).toEqual(0)
})
