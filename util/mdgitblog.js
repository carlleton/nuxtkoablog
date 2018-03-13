var YAML = require('yamljs')

function deal(str, params) {
  var tmp = str.indexOf('<!--')
  if (tmp === -1 || tmp > 10) {
    return params
  }
  var str2 = str.substr(str.indexOf('<!--') + 4)
  str2 = str2.substr(0, str2.indexOf('-->'))
  var content = str.substr(str.indexOf('-->') + 3)
  params.content = content

  titleconfig = YAML.parse(str2)

  titleconfig.title && (params.title = titleconfig.title)
  titleconfig.tags && (params.tags = titleconfig.tags.replace(/ /g,','))
  titleconfig.date && (params.addtime = (new Date(titleconfig.date)).getTime())

  return params
}

module.exports.deal = deal
