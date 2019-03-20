export const simple = (incrementMock, decrementMock) => ({
  increment: incrementMock,
  decrement: decrementMock
})

export const deep = (incrementMock, decrementMock) => ({
  increment: incrementMock,
  nested: {
    decrement: decrementMock
  }
})

export const mixed = (incrementMock, decrementMock) => ({
  count: 1,
  increment: incrementMock,
  nested: {
    count: 2,
    decrement: decrementMock
  }
})

export const array = (incrementMock, decrementMock) => ({
  count: 2,
  array: [
    {
      count: 3,
      increment: incrementMock
    },
    {
      counts: [4, 5],
      nested: {
        decrement: decrementMock
      }
    }
  ]
})
