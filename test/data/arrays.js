export const one = () => ([1])

export const two = () => (['one', ['one', 'two']])

export const three = () => ([
  {count: 1},
  {count: 2,
    nested: [
      1,
      2,
      [3]
    ]},
  {count: 3}
])
