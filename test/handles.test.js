import fancyProxy from './..'
import { one, two, three } from './data/objects'
import { counter, nested } from './data/handles'

test('Handle will be called upon access.', () => {
  const mockHandle = jest.fn()
  const mockMiddleware = jest.fn()
  const proxy = fancyProxy({}, {
    handles: [
      [ one(), mockHandle ]
    ],
    middleware: mockMiddleware
  })

  expect(proxy.count).toEqual(1)
  expect(mockMiddleware.mock.calls[0][0]).toEqual('count')
  expect(mockHandle.mock.calls.length).toEqual(1)
  expect(mockHandle.mock.calls[0][0]).toEqual(1)
  expect(mockHandle.mock.calls[0][2]).toEqual('count')
})

test('Accessing non-existing values will have no effect.', () => {
  const mockHandle = jest.fn()
  const mockMiddleware = jest.fn()
  const proxy = fancyProxy({}, {
    handles: [
      [ one(), mockHandle ]
    ],
    middleware: mockMiddleware
  })

  proxy.nested
  expect(mockHandle.mock.calls.length).toEqual(0)
  expect(mockMiddleware.mock.calls.length).toEqual(0)

  proxy.nested.count
  expect(mockHandle.mock.calls.length).toEqual(0)
  expect(mockMiddleware.mock.calls.length).toEqual(0)
})

test('Functions on handles will be called in context.', () => {
  const counterObject = counter()
  const mockHandle = jest.fn((value, target, path, type) => {
    if (typeof value === 'function') {
      return value(target, path, type)
    }

    return value
  })
  const mockIncrement = counterObject.increment
  const mockMiddleware = jest.fn()
  const proxy = fancyProxy({}, {
    handles: [
      [ counterObject, mockHandle ]
    ],
    middleware: mockMiddleware
  })

  expect(proxy.count).toEqual(1)

  proxy.increment()

  expect(proxy.count).toEqual(2)
  expect(mockMiddleware.mock.calls.length).toEqual(3)
  expect(mockMiddleware.mock.calls[1][0]).toEqual('increment')
  expect(mockHandle.mock.calls.length).toEqual(3)
  expect(typeof mockHandle.mock.calls[1][0]).toEqual('function')
  expect(mockHandle.mock.calls[1][1].count).toEqual(2)
  expect(mockHandle.mock.calls[1][3]).toEqual('call')
  expect(mockIncrement.mock.calls.length).toEqual(1)

  proxy.increment()

  expect(proxy.count).toEqual(3)
  expect(mockIncrement.mock.calls.length).toEqual(2)
})

test('Only the first matching handle will be called.', () => {
  const counterObject = counter()
  const mockHandle = jest.fn()
  const mockHandle2 = jest.fn()
  const proxy = fancyProxy({}, {
    handles: [
      [ counterObject, mockHandle ],
      [ counterObject, mockHandle2 ]
    ]
  })

  proxy.increment()

  expect(mockHandle.mock.calls.length).toEqual(1)
  expect(mockHandle2.mock.calls.length).toEqual(0)
})

test('If several handles match a path each path will be considered.', () => {
  const mockHandle = jest.fn()
  const mockHandle2 = jest.fn()
  const mockMiddleware = jest.fn()
  const proxy = fancyProxy({}, {
    handles: [
      [ { nested: { this: () => {} } }, mockHandle ],
      [ { nested: { that: () => {} } }, mockHandle2 ]
    ],
    middleware: mockMiddleware
  })

  proxy.nested.that()

  expect(mockHandle.mock.calls.length).toEqual(0)
  expect(mockHandle2.mock.calls.length).toEqual(1)

  expect(mockMiddleware.mock.calls[0][0]).toEqual('nested.that')
})

test('Handles and the regular object can be combined.', () => {
  const mockHandle = jest.fn()
  const mockHandle2 = jest.fn()
  const mockHandle3 = jest.fn()
  const mockMiddleware = jest.fn()
  const proxy = fancyProxy({
    nested: {
      this: mockHandle3
    }
  }, {
    handles: [
      [ { nested: { this: () => {} } }, mockHandle ],
      [ { nested: { that: () => {} } }, mockHandle2 ]
    ],
    middleware: mockMiddleware
  })

  // proxy.nested.that()
  //
  // expect(mockHandle.mock.calls.length).toEqual(0)
  // expect(mockHandle2.mock.calls.length).toEqual(1)
  //
  // expect(mockMiddleware.mock.calls[0][0]).toEqual('nested.that')

  proxy.nested.this()

  // Mock shouldn't be called, found on the target.
  expect(mockHandle.mock.calls.length).toEqual(0)
  expect(mockHandle2.mock.calls.length).toEqual(0)
  expect(mockHandle3.mock.calls.length).toEqual(1)

  expect(mockMiddleware.mock.calls.length).toEqual(1)
})
