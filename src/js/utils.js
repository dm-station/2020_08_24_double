
var utils = {}

// UA 判断  提供了全局对象netease.ua， 如：netease.ua.ios 即可调用
utils.parseUA = function () {
  var u = navigator.userAgent
  var u2 = navigator.userAgent.toLowerCase()
  return { // 移动终端版本信息
    mobile: !!u.match(/(iPhone|iPod|Android|ios|Mobile)/i), // 是否为移动终端
    pc: !u.match(/(iPhone|iPod|Android|ios|Mobile)/i), // 是否为pc终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // 是否为ios终端
    android: u.indexOf('Android') > -1, // 是否为android终端
    weixin: u2.match(/MicroMessenger/i) === 'micromessenger', // 是否为微信客户端
    newsapp: u.indexOf('NewsApp') > -1, // 是否为网易新闻客户端
    yixin: u.indexOf('YiXin') > -1, // 易信客户端
    weibo: u.indexOf('weibo') > -1, // 微博客户端
    yunyuedu: u.indexOf('PRIS') > -1 // 云阅读客户端
  }
}

// 获取链接参数方法   getPara("参数名");
utils.getPara = function (paraName) {
  var urlPara = location.search
  var reg = new RegExp('[&|?]' + paraName + '=([^&$]*)', 'gi')
  var a = reg.test(urlPara)
  return a ? RegExp.$1 : ''
}

// export {utils}

export default utils
