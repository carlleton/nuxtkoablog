let cmdmarkdown = require('./util/cmdmarkdown')

var cmdargs = process.argv.splice(2)
var cmd = cmdargs[0]
var folder = cmdargs[1]

if (cmd === 'markdown') {
  cmdmarkdown.read(folder)
}

if (cmd === 'note2file') {
	cmdmarkdown.write(folder)
}