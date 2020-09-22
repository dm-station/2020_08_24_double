
// 横竖屏检测
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

// 获取url参数
function getRequestParams (strname) {
  var url = location.search // 获取url中"?"符后的字串
  // eslint-disable-next-line no-new-object
  var theRequest = new Object()
  if (url.indexOf('?') !== -1) {
    var str = url.substr(1)
    var strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
    }
  }
  return theRequest[strname]
}

function getStageHeight () {
  var s = document.body.clientWidth / 750
  //   var stageW = document.body.clientWidth / s
  var stageH = document.body.clientHeight / s
  return stageH
}

function getPos (h) {
  var H = getStageHeight()
  var y = (H - h) / 2
  return y / 100 + 'rem'
}

var video = document.getElementById('video')
document.addEventListener('WeixinJSBridgeReady', function () {
  WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
    // document.getElementById('video').play()
    // document.getElementById('video').pause()
    WeixinReady()
  })
}, false)

function WeixinReady () {
  if (video) {
    video.audioOut.unlock()
    video.audioOut.volume = 1
  }
}

var themes = getRequestParams('themes') || 'tw'
var channel = getRequestParams('channel') || ''

$(function () {
  share()
  // 禁止页面滚动
  document.body.addEventListener('touchmove', function (e) {
    e.preventDefault() // 阻止默认的处理方式(阻止下拉滑动的效果)
  }, {passive: false}) // passive 参数不能省略，用来兼容ios和android

  // 重写alert
  window.alert = function (name) {
    var iframe = document.createElement('IFRAME')
    iframe.style.display = 'none'
    iframe.setAttribute('src', 'data:text/plain,')
    document.documentElement.appendChild(iframe)
    window.frames[0].window.alert(name)
    iframe.parentNode.removeChild(iframe)
  }

  landscape()

  // 为统一用户交互即muted（静音）自动播放，Android系统下未使用chromium M71版本的webview仍不支持autoplay策略（浏览器市场占比较大）。
  function toggleVolumn () {
    console.log('toggleVolumn')
    // 如果是依据autoplay policy而消音
    if (!video.audioOut.unlocked) {
      // 解除消音
      video.audioOut.unlock()
      // 避免一些隐患手动设置volume
      video.audioOut.volume = 1
    } else {
      // video.volume = video.volume > 0 ? 0 : 1
    }
    document.getElementById('main').removeEventListener('click', toggleVolumn)
  }

  // $('.ce_photo').attr('src', './img/' + themes + '_photo.png').removeClass('none')
  $('.load').attr('src', './img/load_' + themes + '.gif')

  // 初始化素材
  var type = ''
  var H = getStageHeight()

  $('#game').css('height', '7.5rem')
  $('#game').css('width', H / 100 + 'rem')
  if (H > 1300) {
    type = 'big'
  } else {
    type = 'small'
    $('.more').css('top', '2rem')
    $('.getCoupon').css('top', '6.6rem')
    $('.swiper_btn').css('top', getPos(337))
    $('.scroll').addClass('scrolls')
  }

  $('.scroll_bg').attr('src', './img/' + type + '/scroll_bg.jpg')
  $('.scroll').attr('src', './img/' + type + '/scroll.png').addClass('scrolls')
  $('.p3bg').attr('src', './img/' + type + '/p3_' + themes + '.jpg')
  $('.p4bg').attr('src', './img/' + type + '/swiper_bg.jpg')

  if (H < 1448) {
    // $('.height').removeClass('height')
  }

  for (var i = 0; i < 3; i++) {
    $('.swiper-wrapper img').eq(i).attr('src', './img/' + type + '/swiper' + (i + 1) + '.png')
  }

  // 进度条
  track('loading')
  var num = 0
  var tm
  if (channel === 'close') {
    console.log('close----->')
    $('#p3,.p3bg').removeClass('none')
  } else {
    $('#login').removeClass('none')
    tm = setInterval(() => {
      num++
      if (num >= 100) {
        num = 100
        clearInterval(tm)
        setTimeout(function () {
          $('#login').remove()
          $('#p1').removeClass('none')
        }, 1000)
      }
      $('.progress').html(num + '%')
    }, 20)
  }

  // 视频部分
  var video
  var url
  var canvas = document.getElementById('game')

  url = 'video/' + type + '_' + themes + '.ts'
  url = 'video/ce.ts'

  // 监听视频播放进度
  var tms = setInterval(function () {
    console.log('currentTime', video.currentTime)
    if (video.currentTime > 0.1) {
      clearInterval(tms)
      video.pause()
    }
  }, 50)

  video = new JSMpeg.Player(url, {canvas: canvas,
    loop: false,
    autoplay: true, // 是否立即开始播放
    // chunkSize: 1024 * 1024,//一次加载的块大小（以字节为单位）。默认值1024*1024（1mb）
    onEnded: videoEnd
  })
  document.getElementById('main').removeEventListener('click', toggleVolumn)

  function videoEnd () {
    video.currentTime = 0.1
    // 销毁视频
    video.destroy()
    if (channel === 'close') {
      $('.p3bg').removeClass('none')
    } else {
      $('.p3bg').addClass('none')
    }
    $('#p3').removeClass('none')
    console.log('videoEnd')
  }

  var swiper = new Swiper('.swiper-container', {
    autoplay: false, // 可选选项，自动滑动
    direction: 'vertical',
    loop: false,
    observer: true, // 修改swiper自己或子元素时，自动初始化swiper
    observeParents: true, // 修改swiper的父元素时，自动初始化swiper
    on: {
      touchEnd: function (swiper, event) {
        // 你的事件
        // console.log('touchEnd', swiper, event, 'activeIndex:', swiper.activeIndex)
      },
      slideChangeTransitionStart: function () {
        // console.log(swiper.activeIndex)// 切换结束时，告诉我现在是第几个slide
      }
    }
  })

  /* eslint-disable */
  var mousedown = 'mousedown '// 鼠标按下
  var mousemove = 'mousemove '// 鼠标移动
  var mouseup = 'mouseup '// 鼠标抬起
  var mouseout = 'mouseout '// 鼠标移除
  var mouse = 'PC'
  if (document.hasOwnProperty('ontouchstart') || 'ontouchstart' in window) {
    mousedown = 'touchstart '// 手指按下
    mousemove = 'touchmove '// 手指移动
    mouseup = 'touchend '// 手指抬起
    mouseout = 'touchcancel '// 手指移除
    mouse = 'YD'
  }

  // 点击卷轴
  $('.scroll').on(mouseup, function () {
    video.play()
    if (!video.audioOut.unlocked) {
      // 解除消音
      video.audioOut.unlock()
      // 避免一些隐患手动设置volume
      video.audioOut.volume = 1
    }
    $('#p1').addClass('none')
    $('#p2').removeClass('none')
    track('点击亲启')
    track('视频页播放')
  })
  // 享受更多
  $('.more').on(mouseup, function () {
    $('#p4').removeClass('none')
    track('其他视频')
  })
  // 领佳节好礼
  $('.getCoupon').on(mouseup, function () {
    // console.log('coupon.html?themes=' + themes)
    track('领取优惠')
    setTimeout(function(){
      window.location.replace('https://v2.javamall.cn/telunsu/shuanjie/coupon.html?themes=' + themes + '&channel=close')
    },500)
    // window.location.href = 'coupon.html?themes=' + themes + '&channel=close'
  })

  // 即刻观看
  $('.swiper_btn').on(mouseup, function () {
    var k=$('.swiper-slide-active').attr('data-swiper-slide-index')*1
    if (k === 0) {
      themes = 'ce'
    } else if (k === 1) {
      themes = 'tw'
    } else if (k === 2) {
      themes = 'yt'
    }
    console.log(swiper.activeIndex,themes,swiper.realIndex, $('.swiper-slide-active').attr('data-swiper-slide-index'))
    
    track('即刻观赏')
    // 销毁视频
    if (video) video = null
    url = 'video/' + type + '_' + themes + '.ts'
    url = 'video/video.ts'
    $('#p4,#p3').addClass('none')
    $('#p2').removeClass('none')
    channel = ''
    video = new JSMpeg.Player(url, {canvas: canvas,
      loop: false,
      autoplay: true, // 是否立即开始播放
      // chunkSize: 1024 * 1024,//一次加载的块大小（以字节为单位）。默认值1024*1024（1mb）
      onEnded: videoEnd
    })
  })

  // 左按钮
  $('.swiper_left').on(mouseup, function () {
    swiper.slideNext()
    track('视频页_L')
  })

  // 右按钮
  $('.swiper_right').on(mouseup, function () {
    swiper.slidePrev()
    track('视频页_R')
  })

  // 返回
  $('.back').on(mouseup, function () {
    $('#p4').addClass('none')
  })
})

function track(name){
  var k=0
  if (themes === 'ce') {
    k=0
  } else if (themes === 'tw') {
    k=1
  } else if (themes === 'yt') {
    k=2
  }
  var json=[//嫦娥，唐王，玉兔
    {name:'敬请期待',id:[26,27,28]},
    {name:'loading',id:[1,2,3]},
    {name:'点击亲启',id:[4,4,4]},
    {name:'视频页播放',id:[5,6,7]},
    {name:'其他视频',id:[8,10,12]},
    {name:'领取优惠',id:[9,11,13]},
    {name:'即刻观赏',id:[14,17,20]},
    {name:'视频页_L',id:[15,18,21]},
    {name:'视频页_R',id:[16,19,22]},
    {name:'领取优惠劵',id:[23,23,23]},
    {name:'分享朋友',id:[24,24,24]},
    {name:'分享朋友圈',id:[25,25,25]},
  ]
  
  for (var index = 0; index < json.length; index++) {
    if(name===json[index].name){
      BHDmp('track',json[index].id[k])
      console.log('track',json[index].name,json[index].id[k])
    }
  }
}

function share () {
  var url = encodeURIComponent(window.location.href.split('#')[0])
  url = url.replace('http%3A%2F%2F', '')
  $.ajax({
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'callback',
    url: '//api.slb.moneplus.cn/jssdk/real_list.php?url=' + url,
    success: function (result) {
      // console.log(JSON.stringify(data));
      wx.config({
        debug: false,
        appId: result.appId,
        timestamp: result.timestamp,
        nonceStr: result.nonceStr,
        signature: result.signature,
        jsApiList: [
          'updateAppMessageShareData',
          'updateTimelineShareData'
        ]
      })
      wx.ready(function () {
        // 在这里调用 API
        // 2. 分享接口
        // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        uploadData()
      }) // end of wx.ready
    }
  })
}
function uploadData () {
  var _title = '千年明月事，更好共此时' // 分享标题
  var _desc = '常论月宫谁人在，不知嫦娥因何奔月去？' // 分享的描述
  var _link = window.location.href // 分享的连接
  var _imgUrl = 'https://telunsu2020guli.mengniu.com.cn/wxshare_demo/index.jpg' // 分享的图片

  console.log('share', themes)

  if (themes === 'ce') {
    _desc = '常论月宫谁人在，不知嫦娥因何奔月去？'
  } else if (themes === 'tw') {
    _desc = '大唐盛世兴音律，《霓裳羽衣曲》从何来？'
  } else if (themes === 'yt') {
    _desc = '动物种类颇多，广寒宫中何以只见玉兔？'
  }
  _imgUrl = 'http://campaign.realh5.cn/2020/tls_double/share/' + themes + '.jpg'
  wx.updateAppMessageShareData({
    title: _title,
    desc: _desc,
    link: _link,
    imgUrl: _imgUrl,
    trigger: function (res) {
      //  alert('用户点击发送给朋友');
    },
    success: function (res) {
      BHDmp('track','24')
      //  alert('已分享');
    },
    cancel: function (res) {
      //  alert('已取消');
    },
    fail: function (res) {
      //  alert(JSON.stringify(res));
    }
  })
  // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
  wx.updateTimelineShareData({
    title: _title,
    link: _link,
    imgUrl: _imgUrl,
    trigger: function (res) {
      //   alert('用户点击分享到朋友圈');
    },
    success: function (res) {
      BHDmp('track','25')
      // alert('已分享');
    },
    cancel: function (res) {
      //  alert('已取消');
    },
    fail: function (res) {
      //   alert(JSON.stringify(res));
    }
  })
}
