const objectAssign = require('object-assign')
var fs= require("fs")

let config = require('./config')
let options = require('./options')

let result = objectAssign({}, config, options)

module.exports = result
