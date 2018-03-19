let cmdmarkdown = require('./util/cmdmarkdown')
let backup = require('./util/backup')

var cmdargs = process.argv.splice(2)
var cmd = cmdargs[0]

if (cmd === 'markdown') {
  var folder = cmdargs[1]
  cmdmarkdown.read(folder)
}
if (cmd === 'backup') {
  backup.backup((err, str) => {
    if (err) {
      console.log('error:', err, str)
    } else {
      console.log('success backup')
    }
  })
}
if (cmd === 'sendmail') {
  backup.backupEmail()
}
