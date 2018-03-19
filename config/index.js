const objectAssign = require('object-assign')

let config = require('./config')
let options = require('./options')

const result = objectAssign({}, config, options)

module.exports = result
