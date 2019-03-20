import '@babel/polyfill/dist/polyfill'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import proxy from 'fancy-proxy'
import prepareDocument from './document'

// Simple example to illustrate how a store could be created with fancy-proxy.
let forceUpdate
const store = proxy({
  count: 1
}, {
  handles: [
    {
      target: {
        increment: (target) => ++target.count,
        decrement: (target) => --target.count
      },
      handler: (inputs, target, method) => {
        const returnValue = method(target)
        // Manually 'patch' object for IE11
        if (typeof Proxy === 'undefined') {
          Object.assign(store, target)
        }
        return returnValue
      }
    }
  ],
  middleware: (path, value, type) => {
    if (type === 'call') {
      forceUpdate()
    }
  }
})

class App extends Component {
  constructor(props) {
    super(props)
    forceUpdate = this.forceUpdate.bind(this)
    this.store = store
  }

  render() {
    const { count } = this.store

    return (
      <div>
        <h1>React Store Built with fancy-proxy</h1>
        <p>Count: {count}</p>
        <button onClick={() => this.store.increment()}>Increment</button>
        <br/>
        <button onClick={() => this.store.decrement()}>Decrement</button>
      </div>
    )
  }
}

prepareDocument()

ReactDOM.render(<App />, document.getElementById('root'))
