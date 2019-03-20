export const counter = (mockIncrement) => ({
  increment: mockIncrement
})

export const nested = (mockIncrement, mockDecrement, mockIncrement2, mockDecrement2) => ({
  increment: mockIncrement,
  decrement: mockDecrement,
  nested: {
    count: 2,
    increment: mockIncrement2,
    decrement: mockDecrement2
  }
})
