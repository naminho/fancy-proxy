import fancyProxy from './..'
// Example objects with named depth.
import { one, two, three } from './data/objects'

test('Can access top-level property.', () => {
  const proxy = fancyProxy(one(), {})
  expect(proxy.count).toEqual(1)
})

test('Can access second-level property.', () => {
  const proxy = fancyProxy(two(), {})
  expect(proxy.nested.count).toEqual(2)
})

test('Can access low-level property.', () => {
  const proxy = fancyProxy(three(), {})
  expect(proxy.nested.nested.count).toEqual(3)
})

test('Can access properties from multiple objects.', () => {
  const proxy = fancyProxy([one(), two(), three()], {})
  expect(proxy.count).toEqual(1)
  expect(proxy.nested.count).toEqual(2)
  expect(proxy.nested.nested.count).toEqual(3)
})
