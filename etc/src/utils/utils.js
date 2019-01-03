// 个位加0
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// rpx换算px
const rpx2px = rpx => {
  let sysInfo = wx.getSystemInfoSync()
  return rpx * sysInfo.windowWidth / 750
}

// 字符串版本号判断函数
const compareVersion = (v1, v2) => {
  v1 = v1.split('.')
  v2 = v2.split('.')
  let len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    let num1 = parseInt(v1[i])
    let num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

// 金额格式化
const formatCurrency = (s) => {
  if (!/^(-?\d+)(\.\d*)?$/.test(s)) {
    return 'invalid value'
  }

  let sign = ''
  s = Number(s)
  if (s < 0) {
    sign = '-'
  } else {
    sign = ''
  }
  s = Math.abs(s)
  if (/^\d+$/.test(s)) {
    return (sign + (s + '').replace(/\B(?=(\d{3})+$)/g, ',') + '.00')
  }
  if (/^(\d+)\.(\d+)$/.test(s)) {
    s = s + '0'
    var v = s.split('.')
    var f = (v[0] + '').replace(/\B(?=(\d{3})+$)/g, ',')
    var h = v[1].substring(0, 2)
    return (sign + f + '.' + h)
  }
}

// 格式化日期 formatDate('yyyy-MM-dd HH:mm:ss','时间戳')
const formatDate = (format, time) => {
  let t = time !== undefined ? new Date(time) : new Date()
  let tf = function (i) {
    return (i < 10 ? '0' : '') + i
  }
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear())
        break
      case 'MM':
        return tf(t.getMonth() + 1)
        break
      case 'mm':
        return tf(t.getMinutes())
        break
      case 'dd':
        return tf(t.getDate())
        break
      case 'HH':
        return tf(t.getHours())
        break
      case 'ss':
        return tf(t.getSeconds())
        break
    }
  })
}

// 分转元
const fenToYuan = function (s) {
  if (s >= 100) {
    s = s + ''
    return s.slice(0, -2) + '.' + s.slice(-2)
  } else if (s >= 10) {
    return '0.' + s
  } else if (s > 0) {
    return '0.0' + s
  } else {
    return s
  }
}

// 获取全部路径
const getFullUrl = function () {
  var pages = getCurrentPages()
  var currentPage = pages[pages.length - 1]
  var url = currentPage.route
  var options = currentPage.options
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

// 发送埋点数据
const sendPoint = function sendPoint (sendObj = {}) {
  if (!(sendObj instanceof Object)) {
    return false
  }

  sendObj.biz = sendObj.biz || 'ETC-MINI'
  sendObj.pin = sendObj.pin || requirePlugin('loginPlugin').getStorageSync('jdlogin_pt_pin') || 'default'
  sendObj.key_view = sendObj.key_view || 'default'
  sendObj.key_Type = sendObj.key_Type || 'default'
  sendObj.key_event = sendObj.key_event || 'default'
  sendObj.key_area = sendObj.key_area || 'default'
  sendObj.key_reserve1 = sendObj.key_reserve1 || 'default'
  sendObj.key_reserve2 = sendObj.key_reserve2 || 'default'

  let keyVal = sendObj.key_view + ',' + sendObj.key_Type + ',' + sendObj.key_event + ',' + sendObj.key_area + ',' + sendObj.key_reserve1 + ',' + sendObj.key_reserve2

  let reqData = {
    biz: sendObj.biz,
    key: keyVal,
    count: 1,
    uuid: '',
    timestamp: formatDate('yyyy-MM-dd HH:mm:ss'),
    visitor: sendObj.pin,
    eventId: '',
    callback: ''
  }

  wx.request({
    url: 'https://oriondm.jd.com/service/writeH5Log?data=' + encodeURIComponent(JSON.stringify(reqData)),
    complete: function (res) {
      // console.log(res)
    }
  })
}

// module.exports = { // commonjs规范
//   formatNumber: formatNumber,
//   rpx2px: rpx2px,
//   compareVersion: compareVersion,
//   formatCurrency: formatCurrency,
//   formatDate: formatDate,
//   fenToYuan: fenToYuan,
//   getFullUrl: getFullUrl,
//   sendPoint: sendPoint
// }

export default { // es6 规范
  formatNumber: formatNumber,
  rpx2px: rpx2px,
  compareVersion: compareVersion,
  formatCurrency: formatCurrency,
  formatDate: formatDate,
  fenToYuan: fenToYuan,
  getFullUrl: getFullUrl,
  sendPoint: sendPoint
}
