import run from './utils/run'
// Example arrays with named depth.
import { one, two, three } from './data/arrays'

run('Can access top-level array', (fallback, fancy) => {
  const proxy = fancy({
    // Proxies need to be an object at the top-level.
    state: one()
  }, {})

  expect(proxy.state[0]).toEqual(1)
})

run('Can create top-level array proxy', (fallback, fancy) => {
  const proxy = fancy([
    // If an array is at the top level, it's contents will be merged.
    one()
  ], {})

  expect(proxy[0]).toEqual(1)
})

run('Can access second-level array', (fallback, fancy) => {
  const proxy = fancy({ state: two() }, {})
  expect(proxy.state[1][1]).toEqual('two')
})

run('Can access low-level property', (fallback, fancy) => {
  const proxy = fancy({ state: three() }, {})
  expect(proxy.state[1].nested[2][0]).toEqual(3)
})

run('Can access properties from multiple objects', (fallback, fancy) => {
  const proxy = fancy([
    { state: one() },
    { mixed: { two: two() } },
    { mixed: { three: three() } }
  ], {})
  expect(proxy.state[0]).toEqual(1)
  expect(proxy.mixed.two[1][0]).toEqual('one')
  expect(proxy.mixed.three[1].nested[2][0]).toEqual(3)
})

run('Can access properties from multiple objects', (fallback, fancy) => {
  const proxy = fancy([
    one(),
    two(),
    three()
  ], {})

  expect(proxy[0]).toEqual(1)
  expect(proxy[2][0]).toEqual('one')
  expect(proxy[4].nested[2][0]).toEqual(3)
})
