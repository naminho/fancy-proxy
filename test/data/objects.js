export const one = () => ({
  count: 1
})

export const two = () => ({
  count: 1,
  nested: {
    count: 2
  }
})

export const three = () => ({
  count: 1,
  nested: {
    count: 2,
    nested: {
      count: 3
    }
  }
})
