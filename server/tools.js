let fs = require('fs')
export function writeFile(fPath, content) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(fPath, content, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve("successed")
      }
    })
  })
}

export function readFile(fPath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fPath, 'utf-8', function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
