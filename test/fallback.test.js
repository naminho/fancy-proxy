import fancy from './../src'
import { one, two, three } from './data/objects'
import { three as arrayThree } from './data/arrays'
import { simple, deep, mixed, array } from './data/methods'

test('Can init with fallback option.', () => {
  const regular = fancy({}, {})
  const fallback = fancy({}, {
    fallback: true
  })

  expect(regular).toBeDefined()
  expect(regular.__isProxy).toBeDefined()
  expect(fallback).toBeDefined()
  expect(typeof fallback).toEqual('object')
  expect(fallback.__isProxy).toBeUndefined()
})

test('Middleware isn\'t called with fallback for reads.', () => {
  const mockMiddleware = jest.fn()
  const proxy = fancy(two(), {
    middleware: mockMiddleware,
    fallback: true
  })

  expect(proxy.nested.count).toEqual(2)
  expect(mockMiddleware).not.toHaveBeenCalled()
})

// test('Handles are found on the fallback object.', () => {
//   const mockHandle = jest.fn()
//   const mockIncrement = jest.fn()
//   const mockDecrement = jest.fn()
//   const mockMiddleware = jest.fn()
//   const proxy = fancy({}, {
//     handles: [
//       [ simple(mockIncrement, mockDecrement), mockHandle ]
//     ],
//     middleware: mockMiddleware,
//     fallback: true
//   })
//
//   proxy.increment()
//
//   expect(mockDecrement.mock.calls.length).toEqual(0)
//   expect(mockIncrement.mock.calls.length).toEqual(1)
//   expect(mockHandle.mock.calls.length).toEqual(1)
//   expect(mockMiddleware.mock.calls.length).toEqual(1)
//   expect(mockMiddleware.mock.calls[0][0]).toEqual('increment')
//
//   proxy.decrement()
//
//   expect(mockDecrement.mock.calls.length).toEqual(1)
//   expect(mockIncrement.mock.calls.length).toEqual(1)
//   expect(mockHandle.mock.calls.length).toEqual(2)
//   expect(mockMiddleware.mock.calls.length).toEqual(2)
//   expect(mockMiddleware.mock.calls[1][0]).toEqual('decrement')
//
//   proxy.increment(5)
//
//   expect(mockIncrement.mock.calls.length).toEqual(2)
//   expect(mockIncrement.mock.calls[1][0]).toEqual(5)
// })
//
// test('Can access nested handles properly.', () => {
//   const mockHandleSimple = jest.fn()
//   const mockHandleDeep = jest.fn()
//   const mockHandleMixed = jest.fn()
//   const mockIncrementSimple = jest.fn()
//   const mockDecrementSimple = jest.fn()
//   const mockIncrementDeep = jest.fn()
//   const mockDecrementDeep = jest.fn()
//   const mockIncrementMixed = jest.fn()
//   const mockDecrementMixed = jest.fn()
//   const mockMiddleware = jest.fn()
//   const proxy = fancy({}, {
//     handles: [
//       [ simple(mockIncrementSimple, mockDecrementSimple), mockHandleSimple ],
//       [ deep(mockIncrementDeep, mockDecrementDeep), mockHandleDeep ],
//       [ mixed(mockIncrementMixed, mockDecrementMixed), mockHandleMixed ]
//     ],
//     middleware: mockMiddleware,
//     fallback: true
//   })
//
//   proxy.increment()
//
//   expect(mockIncrementSimple.mock.calls.length).toEqual(1)
//   expect(mockIncrementDeep.mock.calls.length).toEqual(0)
//   expect(mockHandleSimple.mock.calls.length).toEqual(1)
//   expect(mockHandleDeep.mock.calls.length).toEqual(0)
//   expect(mockMiddleware.mock.calls.length).toEqual(1)
//   expect(mockMiddleware.mock.calls[0][0]).toEqual('increment')
//
//   proxy.nested.decrement()
//
//   expect(mockDecrementSimple.mock.calls.length).toEqual(0)
//   expect(mockDecrementDeep.mock.calls.length).toEqual(1)
//   expect(mockHandleSimple.mock.calls.length).toEqual(1)
//   expect(mockHandleDeep.mock.calls.length).toEqual(1)
//   expect(mockMiddleware.mock.calls.length).toEqual(2)
//   expect(mockMiddleware.mock.calls[1][0]).toEqual('nested.decrement')
//
//   expect(proxy.count).toEqual(1)
//   expect(proxy.nested.count).toEqual(2)
//   expect(mockMiddleware.mock.calls.length).toEqual(2)
//   expect(mockHandleMixed.mock.calls.length).toEqual(0)
//   expect(mockIncrementMixed.mock.calls.length).toEqual(0)
//   expect(mockDecrementMixed.mock.calls.length).toEqual(0)
// })
//
// test('Can access handles with arrays.', () => {
//   const mockHandleMixed = jest.fn()
//   const mockHandleArray = jest.fn()
//   const mockIncrementMixed = jest.fn()
//   const mockDecrementMixed = jest.fn()
//   const mockIncrementArray = jest.fn()
//   const mockDecrementArray = jest.fn()
//   const mockMiddleware = jest.fn()
//   const proxy = fancy({}, {
//     handles: [
//       [ mixed(mockIncrementMixed, mockDecrementMixed), mockHandleMixed ],
//       [ array(mockIncrementArray, mockDecrementArray), mockHandleArray ]
//     ],
//     middleware: mockMiddleware,
//     fallback: true
//   })
//
//   // Mixed Access
//   proxy.increment()
//
//   expect(mockIncrementMixed.mock.calls.length).toEqual(1)
//   expect(mockIncrementArray.mock.calls.length).toEqual(0)
//   expect(mockHandleMixed.mock.calls.length).toEqual(1)
//   expect(mockHandleArray.mock.calls.length).toEqual(0)
//   expect(mockMiddleware.mock.calls.length).toEqual(1)
//   expect(mockMiddleware.mock.calls[0][0]).toEqual('increment')
//
//   proxy.nested.decrement()
//
//   expect(mockDecrementMixed.mock.calls.length).toEqual(1)
//   expect(mockDecrementArray.mock.calls.length).toEqual(0)
//   expect(mockHandleMixed.mock.calls.length).toEqual(2)
//   expect(mockHandleArray.mock.calls.length).toEqual(0)
//   expect(mockMiddleware.mock.calls.length).toEqual(2)
//   expect(mockMiddleware.mock.calls[1][0]).toEqual('nested.decrement')
//
//   expect(proxy.count).toEqual(1)
//   expect(proxy.nested.count).toEqual(2)
//   expect(mockMiddleware.mock.calls.length).toEqual(2)
//   expect(mockHandleMixed.mock.calls.length).toEqual(2)
//   expect(mockIncrementMixed.mock.calls.length).toEqual(1)
//   expect(mockDecrementMixed.mock.calls.length).toEqual(1)
//
//   // Array Access
//   expect(proxy.array[0].count).toEqual(3)
//
//   expect(mockMiddleware.mock.calls.length).toEqual(2)
//
//   proxy.array[0].increment()
//
//   expect(mockMiddleware.mock.calls.length).toEqual(3)
//   expect(mockHandleMixed.mock.calls.length).toEqual(2)
//   expect(mockHandleArray.mock.calls.length).toEqual(1)
//   expect(mockIncrementArray.mock.calls.length).toEqual(1)
//   expect(mockMiddleware.mock.calls[2][0]).toEqual('array.0.increment')
//
//   expect(proxy.array[1].counts[1]).toEqual(5)
//
//   proxy.array[1].nested.decrement()
//
//   expect(mockMiddleware.mock.calls.length).toEqual(4)
//   expect(mockHandleMixed.mock.calls.length).toEqual(2)
//   expect(mockHandleArray.mock.calls.length).toEqual(2)
//   expect(mockDecrementArray.mock.calls.length).toEqual(1)
//   expect(mockMiddleware.mock.calls[3][0]).toEqual('array.1.nested.decrement')
// })
//
// test('Target comes before handles.', () => {
//   const mockHandleMixed = jest.fn()
//   const mockHandleArray = jest.fn()
//   const mockDecrementTarget = jest.fn()
//   const mockIncrementMixed = jest.fn()
//   const mockDecrementMixed = jest.fn()
//   const mockIncrementArray = jest.fn()
//   const mockDecrementArray = jest.fn()
//   const proxy = fancy({
//     count: 10,
//     nested: {
//       count: 11
//     },
//     array: [
//       {},
//       {
//         counts: [12, 13],
//         decrement: mockDecrementTarget
//       }
//     ]
//   }, {
//     handles: [
//       [ mixed(mockIncrementMixed, mockDecrementMixed), mockHandleMixed ],
//       [ array(mockIncrementArray, mockDecrementArray), mockHandleArray ]
//     ],
//     fallback: true
//   })
//
//   expect(proxy.count).toEqual(10)
//   expect(proxy.nested.count).toEqual(11)
//
//   proxy.nested.decrement()
//
//   expect(mockDecrementMixed.mock.calls.length).toEqual(1)
//
//   expect(proxy.array[0].count).toEqual(3)
//
//   proxy.array[0].increment()
//
//   expect(mockIncrementArray.mock.calls.length).toEqual(1)
//
//   expect(proxy.array[1].counts[1]).toEqual(13)
//
//   proxy.array[1].decrement()
//
//   expect(mockDecrementTarget.mock.calls.length).toEqual(1)
// })
//
// test('Methods return value upon call.', () => {
//   const mockHandle = jest.fn()
//   const mockIncrement = jest.fn(() => (5))
//   const mockDecrement = jest.fn(() => (6))
//   const mockMiddleware = jest.fn()
//   const proxy = fancy({}, {
//     handles: [
//       [ simple(mockIncrement, mockDecrement), mockHandle ]
//     ],
//     middleware: mockMiddleware,
//     fallback: true
//   })
//
//   expect(proxy.increment()).toEqual(5)
//   expect(proxy.decrement()).toEqual(6)
//
//   expect(mockHandle.mock.calls.length).toEqual(2)
//   expect(mockIncrement.mock.calls.length).toEqual(1)
//   expect(mockDecrement.mock.calls.length).toEqual(1)
// })
//
// test('Handles receive the proper arguments.', () => {
//   const mockHandle = jest.fn(() => (['state', 'rootState', 'delay']))
//   const mockIncrement = jest.fn(() => (5))
//   const mockDecrement = jest.fn(() => (6))
//   const mockMiddleware = jest.fn()
//   const proxy = fancy({}, {
//     handles: [
//       [ simple(mockIncrement, mockDecrement), mockHandle ]
//     ],
//     middleware: mockMiddleware,
//     fallback: true
//   })
//
//   expect(proxy.increment('value', 'secondValue')).toEqual(5)
//   expect(mockHandle.mock.calls[0].length).toEqual(3)
//   expect(mockIncrement.mock.calls[0].length).toEqual(5)
//   expect(mockIncrement.mock.calls[0][0]).toEqual('value')
//   expect(mockIncrement.mock.calls[0][1]).toEqual('secondValue')
//   expect(mockIncrement.mock.calls[0][2]).toEqual('state')
//   expect(mockIncrement.mock.calls[0][3]).toEqual('rootState')
//   expect(mockIncrement.mock.calls[0][4]).toEqual('delay')
// })
