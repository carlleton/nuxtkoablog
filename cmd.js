let cmdmarkdown = require('./util/cmdmarkdown')
var arguments = process.argv.splice(2)
var cmd = arguments[0]

if (cmd === 'markdown') {
  var folder = arguments[1]
  cmdmarkdown.read(folder)
}
