import run from './utils/run'
import merge from 'deepmerge'

run('Proxy can be output to string', (fallback, fancy) => {
  let proxy = fancy({}, {})
  expect(typeof proxy.toString()).toEqual('string')

  proxy = fancy([], {})
  expect(typeof proxy.toString()).toEqual('string')
})

run('Proxy with empty object is stringifiable', (fallback, fancy) => {
  let proxy = fancy({}, {})

  const stringified = fallback ? proxy : proxy[Symbol.toStringTag]
  expect(stringified).toEqual(fallback ? {'__fancyProxy': true} : '{}')
})

run('Proxy with an array is stringifiable', (fallback, fancy) => {
  let proxy = fancy([[1, 2, 3]], {})

  const stringified = fallback ? proxy : proxy[Symbol.toStringTag]
  // Arrays not properly matched by jest, convert to Set.
  expect(new Set(stringified)).toEqual(new Set([1, 2, 3]))
})

run('Proxy with non-empty object is stringifiable', (fallback, fancy) => {
  const nested = {
    count: 1,
    nested: {
      count: 2
    }
  }
  let proxy = fancy(nested, {})

  const stringified = fallback ? proxy : proxy[Symbol.toStringTag]
  const regularTarget = { count: 1, nested: { count: 2 } }
  if (!fallback) {
    expect(stringified).toEqual(regularTarget)
  } else {
    regularTarget.__fancyProxy = true
    expect(stringified).toEqual(regularTarget)
  }
})

run('Proxy with non-empty object and handles is stringifiable', (fallback, fancy) => {
  const target = {
    count: 1,
    nested: {
      count: 2
    }
  }
  const handle1Target = { hello: 3 }
  const handle2Target = { counter: 4, nested: { world: 5 } }
  let proxy = fancy(target, {
    handles: [
      [handle1Target, () => {}],
      [handle2Target, () => {}]
    ]
  })

  const stringified = fallback ? proxy : proxy[Symbol.toStringTag]
  // NOTE only main target is logged.
  // expect(stringified).toEqual(merge.all([handle2Target, handle1Target, target]))
})
