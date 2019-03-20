// Finds path value of object, inspired by npmjs.com/object-get.
export default (reference, path) => {
  return path.reduce(function (result, current) {
    return result && result[current]
  }, reference)
}
