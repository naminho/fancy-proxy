export default {
  arguments: 'Two arguments, an object and some options need to be passed to fancy-proxy.',
  firstArgument: 'The first argument passed to fancy-proxy needs to be an object or an array',
  secondArgument: 'The second argument (options) passed to fancy proxy needs to be an object.',
  middleware: 'The middleware option passed to fancy-proxy needs to be a function.',
  handles: 'The handles option passed to fancy-proxy needs to be an array.',
  arrayHandle: 'An array handle needs to consist of a target and a handler function.',
  objectHandle: 'A handle needs to be either an object or an array.',
  objectHandleProperties: 'An object handle needs a target and a handler property.',
  immutableOptionObject: 'The immutable option needs to be an object.',
  arrayTargetWithImmutableProperties: 'If the target is an array, no immutable properties can be added.',
  handleFoundOnTarget: property => `The handle property '${property}' was found both on the target and a handle, properties must be unique.`,
  handleFoundOnOtherHandle: property => `The handle property '${property}' was found on another handle as well, must be unique.`
}
