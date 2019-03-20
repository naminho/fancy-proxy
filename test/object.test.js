import run from './utils/run'
// Example objects with named depth.
import { one, two, three } from './data/objects'

run('Can access top-level property', (fallback, fancy) => {
  const proxy = fancy(one(), {})
  expect(proxy.count).toEqual(1)
})

run('Can access second-level property', (fallback, fancy) => {
  const proxy = fancy(two(), {})
  expect(proxy.nested.count).toEqual(2)
})

run('Can access low-level property', (fallback, fancy) => {
  const proxy = fancy(three(), {})
  expect(proxy.nested.nested.count).toEqual(3)
})

run('Can access properties from multiple objects', (fallback, fancy) => {
  const proxy = fancy([one(), two(), three()], {})
  expect(proxy.count).toEqual(1)
  expect(proxy.nested.count).toEqual(2)
  expect(proxy.nested.nested.count).toEqual(3)
})
