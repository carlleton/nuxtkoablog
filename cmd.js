let cmdmarkdown = require('./util/cmdmarkdown')

var cmdargs = process.argv.splice(2)
var cmd = cmdargs[0]

if (cmd === 'markdown') {
  var folder = cmdargs[1]
  cmdmarkdown.read(folder)
}
