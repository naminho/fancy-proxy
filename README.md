# fancy-proxy

Interface Around a Proxied Object: `npm i fancy-proxy`.

## Features

* Access to Nested Values
* Handles (Custom Methods Between Values)
* Middleware with Stringified Path
* Deep Merge of Inputs
* Fully-featured ES5 Object Fallback (IE11)

## Usage

```
import proxy from 'fancy-proxy'

const storage = { products: 5 }
const shop = proxy(
  storage,
  {
    middleware: path => console.log(path),
    handles: [
      {
        buy
      },
      () => storage.products--
    ]
)
```
