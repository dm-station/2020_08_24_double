
// import utils from 'utils.js'
// import utils from './utils'

var landscape = function () {
  var orienterTip = document.createElement('div')
  orienterTip.style.cssText = 'width:100%;height:100%;position:fixed;left:0px;top:0px;z-index:999999999;background:#000 url(./img/tip2.png) no-repeat center center;display:none;'
  setTimeout(function () {
    document.body.appendChild(orienterTip)
  }, 200)
  function updateOrientation () {
    setTimeout(function () {
      var myWidth = document.body.clientWidth
      var myHeight = document.body.clientHeight
      if (myWidth > myHeight) {
        orienterTip.style.display = 'block'
      } else {
        orienterTip.style.display = 'none'
      }
    }, 250)
  }
  updateOrientation()
  window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', updateOrientation, false)
}

$(function () {
  // console.log('utils', utils)

  document.body.addEventListener('touchmove', function (e) {
    e.preventDefault() // 阻止默认的处理方式(阻止下拉滑动的效果)
  }, {passive: false}) // passive 参数不能省略，用来兼容ios和android

  window.alert = function (name) {
    var iframe = document.createElement('IFRAME')
    iframe.style.display = 'none'
    iframe.setAttribute('src', 'data:text/plain,')
    document.documentElement.appendChild(iframe)
    window.frames[0].window.alert(name)
    iframe.parentNode.removeChild(iframe)
  }

  landscape()

  /* eslint-disable */
  var mousedown = 'mousedown '// 鼠标按下
  var mousemove = 'mousemove '// 鼠标移动
  var mouseup = 'mouseup '// 鼠标抬起
  var mouseout = 'mouseout '// 鼠标移除
  var mouse = 'PC'
    /* eslint-enable */
  if (document.hasOwnProperty('ontouchstart') || 'ontouchstart' in window) {
    mousedown = 'touchstart '// 手指按下
    mousemove = 'touchmove '// 手指移动
    mouseup = 'touchend '// 手指抬起
    mouseout = 'touchcancel '// 手指移除
    mouse = 'YD'
  }

  // var s = document.body.clientWidth / 750
  // var stageW = document.body.clientWidth / s
  // var stageH = document.body.clientHeight / s
  // console.log('stage', stageW, stageH)

  // 关闭
  $('.coupon_x').on(mouseup, function () {
    // alert('close')
    // window.location.href = 'index.html' + window.location.search
    window.location.replace('//campaign.realh5.cn/2020/tls_double/index.html' + window.location.search)
  })

  // 收入囊中按钮
  $('.coupon_btn').on(mouseup, function () {
    alert('收入囊中')
    BHDmp('track', '23')
  })
})
