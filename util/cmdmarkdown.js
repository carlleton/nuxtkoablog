let db = require('./db')
const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);
const stat = promisify(fs.stat);


var cates = {}

function add(post) {
  let sql = 'insert into notes (title,content,cid,tags,addtime,updatetime) values (?, ?, ?, ?, ?, ?)'
  let params = [
    post.title,
    post.content,
    post.cid,
    post.tags,
    post.addtime || new Date().getTime(),
    new Date().getTime()
  ]
  return db.query(sql, params)
}

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : {
      realpath: res,
      filename: subdir
    };
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

// 处理每个文件
async function readfile(obj, basefolder) {
  var filename = obj.filename
  var ext = filename.substr(filename.lastIndexOf('.'))
  if (ext !== '.md') {
    return 'not md'
  }
  var folder = obj.realpath
  folder = folder.replace(basefolder, '').replace('\\' + filename, '')
  var cid = cates[folder]
  if (cid === undefined) {
    cid = 0
  }
  var title = filename.replace(ext, '')
  var addtime = (new Date()).getTime()
  var tags = ''
  var content = await fs.readFileSync(obj.realpath, 'utf8')
  var params = {
    title: title,
    content: content,
    cid: cid,
    addtime: addtime,
    tags: tags
  }
  var result = await add(params)
  if (result.err) {
    console.log('404')
  } else {
    console.log(result.result.insertId)
  }
  return
}

async function read(folder) {
  let catesresult = await db.query('select * from notecates order by path asc')
  var data = catesresult.result
  var tmps = []
  for (var i = 0, n = data.length; i < n; i++) {
    if (data[i].pid === 0) {
      data[i].folder = '\\' + data[i].catename
      cates[data[i].folder] = data[i].id
      tmps.push(data[i])
    } else {
      var maxi = tmps.length - 1
      if (data[i].pid === tmps[maxi].id) {
        data[i].folder = tmps[maxi].folder + '\\' + data[i].catename
        cates[data[i].folder] = data[i].id
        if (tmps[maxi].childs === undefined) {
          tmps[maxi].childs = []
        }
        tmps[maxi].childs.push(data[i])
      } else {
        data[i].folder = '\\' + data[i].catename
        cates[data[i].folder] = data[i].id
      }
    }
  }
  getFiles(folder).then(files => {
    for (let i = 0, n = files.length; i < n; i++) {
      readfile(files[i], folder)
    }
  }).catch(e => console.error(e));
}

module.exports.read = read
