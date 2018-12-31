let fs = require('fs')
const multer = require('koa-multer')

export function writeFile(fPath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fPath, content, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve('successed')
      }
    })
  })
}

export function readFile(fPath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fPath, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const upload = multer({ dest: 'out/zip/' })
