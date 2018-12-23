export const counter = () => ({
  count: 1,
  increment: jest.fn((target, path, type) => {
    target.count += 1
  })
})

export const nested = () => ({
  count: 1,
  increment: () => {},
  nested: {
    count: 2,
    increment: () => {}
  }
})
