const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);
const stat = promisify(fs.stat);
let db = require('./db')
let gitblog = require('./mdgitblog')
let cmdmarkdown_write = require('./cmdmarkdown_write')
module.exports.write = cmdmarkdown_write.write

var cates = {}

// 数据插入到数据库
function add(post) {
  let id = db.nextId()
  let sql = 'insert into notes (id,title,content,cid,tags,addtime,updatetime) values (?, ?, ?, ?, ?, ?, ?)'
  let params = [
    id,
    post.title,
    post.content,
    post.cid,
    post.tags,
    post.addtime || new Date().getTime(),
    new Date().getTime()
  ]
  return db.query(sql, params)
}
// 获取文件列表
async function getFiles(dir) {
  var isDirectory = (await stat(dir)).isDirectory()
  if(!isDirectory) {
    var filename = dir.substr(dir.lastIndexOf('\\') + 1)
    console.log(filename)
    return [{
      realpath: resolve(dir),
      filename: filename
    }]
  }
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
  params = gitblog.deal(content, params)
  var result = await add(params)
  if (result.err) {
    return '404'
  } else {
    return result.result.insertId
  }
}

// 查询类别
async function queryCates() {
  let catesresult = await db.query('select * from notecates order by path asc')
  var data = catesresult.result
  var tmps = []
  for (var i = 0, n = data.length; i < n; i++) {
    if (data[i].pid === '0') {
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
}

function read(folder) {
  queryCates()
    .then(() => getFiles(folder))
    .then(async files => {
      var proms = []
      for (let i = 0, n = files.length; i < n; i++) {
        var id = await readfile(files[i], folder)
        proms.push(id)
      }
      Promise.all(proms).then((ids) => {
        console.log(ids.join(','))
      })
    })
    .catch(e => console.error(e))
}

module.exports.read = read
