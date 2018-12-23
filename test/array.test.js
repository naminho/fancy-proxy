import fancyProxy from './..'
// Example arrays with named depth.
import { one, two, three } from './data/arrays'

test('Can access top-level array.', () => {
  const proxy = fancyProxy({
    // Proxies need to be an object at the top-level.
    state: one()
  }, {})

  expect(proxy.state[0]).toEqual(1)
})

test('Can access second-level array.', () => {
  const proxy = fancyProxy({ state: two() }, {})
  expect(proxy.state[1][1]).toEqual('two')
})

test('Can access low-level property.', () => {
  const proxy = fancyProxy({ state: three() }, {})
  expect(proxy.state[1].nested[2][0]).toEqual(3)
})

test('Can access properties from multiple objects.', () => {
  const proxy = fancyProxy([
    { state: one() },
    { mixed: { two: two() } },
    { mixed: { three: three() } }
  ], {})
  expect(proxy.state[0]).toEqual(1)
  expect(proxy.mixed.two[1][0]).toEqual('one')
  expect(proxy.mixed.three[1].nested[2][0]).toEqual(3)
})
