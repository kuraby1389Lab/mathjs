'use strict'

const errorTransform = require('./error.transform').transform
const isCollection = require('../../utils/collection/isCollection')

/**
 * Attach a transform function to math.max
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function max
 * from one-based to zero based
 */
function factory (type, config, load, typed) {
  const max = load(require('../../function/statistics/max'))

  return typed('max', {
    '...any': function (args) {
      // change last argument dim from one-based to zero-based
      if (args.length === 2 && isCollection(args[0])) {
        const dim = args[1]
        if (type.isNumber(dim)) {
          args[1] = dim - 1
        } else if (type.isBigNumber(dim)) {
          args[1] = dim.minus(1)
        }
      }

      try {
        return max.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}

exports.name = 'max'
exports.path = 'expression.transform'
exports.factory = factory
