
// yaml格式的字符串转换为对象
function yaml2obj (str) {
  var arr = str.split('\n')
  var obj = {}
  var name = ''
  var content = ''
  for (var i = 0, n = arr.length; i < n; i++) {
    if (arr[i].indexOf(':') > -1) {
      name = arr[i].substr(0, arr[i].indexOf(':')).trim()
      content = arr[i].substr(arr[i].indexOf(':') + 1).trim()
      obj[name] = content
    } else if (i !== 0) {
      obj[name] += '\n' + arr[i]
    }
  }
  return obj
}

function deal (str, params) {
  var tmp = str.indexOf('<!--')
  if (tmp === -1 || tmp > 10) {
    return params
  }
  var str2 = str.substr(str.indexOf('<!--') + 4)
  str2 = str2.substr(0, str2.indexOf('-->'))
  var content = str.substr(str.indexOf('-->') + 3)
  params.content = content

  var titleconfig = yaml2obj(str2)

  titleconfig.title && (params.title = titleconfig.title)
  titleconfig.tags && (params.tags = titleconfig.tags.replace(/ /g, ','))
  titleconfig.date && (params.addtime = (new Date(titleconfig.date)).getTime())

  return params
}

module.exports.deal = deal
