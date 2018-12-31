const fs = require('fs')
const path = require('path')
let db = require('./db')

function writeFile (folder, filename, content) {
  let filepath = folder + '/' + filename
  console.log(filepath)
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, function (err) {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

function mkdirs (dirname) {
  return new Promise((resolve, reject) => {
    fs.exists(dirname, function (exists) {
      if (exists) {
        console.log(dirname + ',exists')
        resolve()
      } else {
        console.log(path.dirname(dirname))
        fs.mkdir(dirname, (err) => {
          if (err) {
            return reject()
          }
          console.log('在' + path.dirname(dirname) + '目录创建好' + dirname + '目录')
          resolve()
        })
      }
    })
  })
}

async function writenotes (cate, folder) {
  let notes = await db.query(`select * from notes where cid=${cate.id} order by addtime`)
  for (let i in notes.result) {
    let note = notes.result[i]
    let filename = note.title
    filename = filename.replace(/\//g, '-')
    await writeFile(folder, filename + '.md', note.content)
  }
}

async function write (folder) {
  let catesresult = await db.query('select * from notecates where pid=0 order by orderid asc')
  for (let i in catesresult.result) {
    let cate = catesresult.result[i]
    await mkdirs(folder + '/' + cate.catename)
    await writenotes(cate, folder + '/' + cate.catename)

    let childcates = await db.query(`select * from notecates where pid=${cate.id} order by orderid asc`)
    for (let childi in childcates.result) {
      let child = childcates.result[childi]
      await mkdirs(folder + '/' + cate.catename + '/' + child.catename)
      await writenotes(child, folder + '/' + cate.catename + '/' + child.catename)
    }
  }
}

module.exports.write = write
