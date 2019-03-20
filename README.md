<p align="center">
  <img src="https://raw.githubusercontent.com/naminho/fancy-proxy/master/logo.png" alt="Fancy Proxy">
</p>

# fancy-proxy

Interface Around a Proxied Object: `npm i fancy-proxy`.

* Access to Nested Values
* Middleware with Stringified Path
* Handles (Custom Methods Before Accessing Values)
* Deep Merge of Target Objects including Arrays
* ES5 Object Fallback for IE11 Support
  * Except Handles & Middleware for read access

## Usage

`fancy(target, options): proxy`

```js
import fancy from 'fancy-proxy'

const target = {
  products: [
    'apple',
    'banana',
    'citron'
  ]
}
const options = {
  middleware: path => console.log(path.toString())
}
const proxy = fancy(target, options)

proxy.products.length === 3     // logs: products[length]
proxy.products[1] === 'banana'  // logs: products[1]
```

## Features

### Middleware

Middleware is a function that will receive the following arguments:

`middleware: (path, value, type) => console.log(\`${path}: ${value}\`)`

`path`: A stringified representation of the path being accessed. The call
`shop.nested[0].count` returns `nested[0].count`.

`value`: The value being accessed, or the value returned by a method. For `read`
access the middleware will be called before the value is returned, while for
`call` the middleware can only be called once the return value is available.

`type`: Either `read` or `call` for functions.

### Handles

A handle consists of a target object and a handle function that will be wrapped
around every call to a function found on the target. The handle receives the
following arguments:

`handle(inputs, target, value, path, type) => result`

`inputs: []`: Array of arguments received when the function on the target is called.

`target: {}`: The whole proxy target (target + all handle targets).

`value: func/any`: The function or the value (if proxy available) being accessed.

`path: string`: The current path being accessed.

`type: string`: Type of the call, either 'call' or 'read' (only when proxies available).

Handles should call the value for calls or return the value for get access.

```js
const proxy = fancy({
    count: 5
  }, {
  handles: [
    {
      target: {
        add: (inputs, target) => {
          // Add the sum of inputs to the count.
          const add = (a, b) => (a + b)
          const total = inputs.reduce(add, 0)
          target.count += total
          return total
        }
      },
      handler: (inputs, target, value, path, type) => {
        if (type === 'read') {
          return value
        }

        return value.apply(null, [inputs, target])
      }
    }
  ]
})

proxy.count     → 5
proxy.add()     → 0
proxy.count     → 5
proxy.add(4)    → 4
proxy.count     → 9
proxy.add(5, 6) → 11
proxy.count     → 20
```

## Options

`fancy(target, options): proxy`

The second object can be used to further configure the proxy, with the following options:

`fallback: boolean` If true the object fallback will be used even if Proxy is available.

`immutable: {}` An optional object that will be exported by the proxy, but doesn't affect the target supplied to the handles.

## Considerations

### Merging Targets

When a path is accessed the target will be searched for a match first, if the
path cannot be found there, then the handles are checked, first to last.

Access Order: `target → first handle → ... → last handle`

## Upcoming Features

* Types (TypeScript)
* Setters when Proxy support assumed
