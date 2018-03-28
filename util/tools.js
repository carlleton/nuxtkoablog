/* eslint-disable */

// 时间格式化输出
export function dateFormat(date,format){
  if(!date)return '';
  var o = {
    "M+" : date.getMonth()+1, //month
    "d+" : date.getDate(), //day
    "h+" : date.getHours(), //hour
    "m+" : date.getMinutes(), //minute
    "s+" : date.getSeconds(), //second
    "q+" : Math.floor((date.getMonth()+3)/3), //quarter
    "S" : date.getMilliseconds() //millisecond
  }
  if(/(y+)/.test(format))
    format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(format))
      format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}

export function getTen(num) {
  if (num < 10) {
    return '0' + num
  }
  return num
}

export function getCookiesInServer(req) {
  let Cookies = {}
  req && req.headers.cookie && req.headers.cookie.split(';').forEach(function (Cookie) {
    let parts = Cookie.split('=')
    Cookies[parts[0].trim()] = (parts[1] || '').trim()
  });
  return Cookies
}

export function setCookieInClient(name, value, minutes) {
  let exp = new Date()
  exp.setTime(exp.getTime() + minutes * 60 * 1000)
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()
}

export function removeToken() {
  setCookieInClient('token', '', -1)
}

export function setToken(tokenValue) {
  setCookieInClient('token', tokenValue, 60*24*7)
}

export function getCookieInClient(name) {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2])
  } else {
    return null
  }
}

// 是否登陆
export function isLogin() {
  if (getCookieInClient('token')) {
    return true
  }
  return false
}

export function writeFile(fPath, content) {
  var fs = require('fs')
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
  var fs = require('fs')
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


/* eslint-enable */
