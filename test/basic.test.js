import fancyNoFallback from 'fancy-proxy'
import run from './utils/run'

run('Can init with a simple object and no options', (fallback, fancy) => {
  const proxy = fancy({}, {})
  expect(proxy).toBeDefined()
})

run('Can init with an empty array and no options', (fallback, fancy) => {
  const proxy = fancy([], {})
  expect(proxy).toBeDefined()
})

test('Needs two arguments.', () => {
  process.env = Object.assign(process.env, { NODE_ENV: 'development' })
  expect(() => fancyNoFallback({})).toThrow()
  process.env = Object.assign(process.env, { NODE_ENV: 'production' })
  expect(() => fancyNoFallback({})).not.toThrow()
})

test('Target needs to be an array or object.', () => {
  process.env = Object.assign(process.env, { NODE_ENV: 'development' })
  expect(() => fancyNoFallback('hello', {})).toThrow()
  expect(() => fancyNoFallback({}, {})).not.toThrow()
  expect(() => fancyNoFallback([], {})).not.toThrow()
  process.env = Object.assign(process.env, { NODE_ENV: 'production' })
})

test('Immutable must be an object.', () => {
  process.env = Object.assign(process.env, { NODE_ENV: 'development' })
  expect(() => fancyNoFallback({}, { immutable: 'hello' })).toThrow()
  expect(() => fancyNoFallback({}, { immutable: {} })).not.toThrow()
  process.env = Object.assign(process.env, { NODE_ENV: 'production' })
  expect(() => fancyNoFallback({}, { immutable: 'hello' })).not.toThrow()
  // debug will override __DEV__.
  expect(() => fancyNoFallback({}, { immutable: 'hello', debug: true })).toThrow()
})

test('Middleware must be a function.', () => {
  process.env = Object.assign(process.env, { NODE_ENV: 'development' })
  expect(() => fancyNoFallback({}, { middleware: 'hello' })).toThrow()
  expect(() => fancyNoFallback({}, { middleware: {} })).toThrow()
  expect(() => fancyNoFallback({}, { middleware: () => {} })).not.toThrow()
  expect(() => fancyNoFallback({}, { middleware: function() {} })).not.toThrow()
  process.env = Object.assign(process.env, { NODE_ENV: 'production' })
})
