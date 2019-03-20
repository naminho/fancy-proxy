// Testing core JS functionalities used.

test('Updating Proxy target will update the proxy as well', () => {
  let target = {
    count: 1,
    nested: {
      count: 2
    }
  }
  const targetReference = target
  const traps = {
    get(target, property, receiver) {
      if (typeof target[property] === 'undefined') {
        return
      }

      return Reflect.get(target, property, receiver)
    }
  }
  const proxy = new Proxy(target, traps)

  expect(proxy.count).toEqual(1)
  expect(proxy.nested.count).toEqual(2)

  // Chaning propery on target should reflect change in Proxy.
  target.count = 2

  expect(proxy.count).toEqual(2)

  target.secondCount = 2

  expect(proxy.secondCount).toEqual(2)

  target.nested.count = 3

  expect(proxy.nested.count).toEqual(3)

  // Reassigning target won't affect the proxy.
  target = {
    count: 4
  }

  expect(proxy.count).toEqual(2)

  target.count = 5

  expect(proxy.count).toEqual(2)

  targetReference.count = 5

  expect(proxy.count).toEqual(5)
})
