// Nested stores are returned directly, since they have their own traps.
export default (property, target) => {
  const value = target[property]
  if (typeof value === 'object' && value['__fancyProxy']) {
    return value
  }
}
