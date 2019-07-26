//app.js
const http = require('./public/utils/http.js')
const util = require('./public/utils/util.js')
// 刘海屏适配
let config = require('./public/components/navigator_bar/config.js');
App({
  onLaunch: function () {
    wx.cloud.init()
    //设置顶部导航
    this.setNavStyle()
    this.globalData.recordTag = wx.getRecorderManager()
  },
  //设置顶部导航
  setNavStyle() {
    try {
      let res = wx.getSystemInfoSync();
      config.pixelRate = res.windowWidth / 750;
      config.platform = res.platform;
      config.statusBarHeight = res.statusBarHeight;
      if (res.platform.toLowerCase() === 'android') {
        config.capsuleHeight += 4;
      }
      config.titleHeight = (config.capsuleHeight + config.statusBarHeight) / config.pixelRate;
      if (res.statusBarHeight >= 44) {
        config.isHighHead = true;
      }
      if (res.windowHeight > 750) config.isAllScreen = true;
      config.systemHeight = res.windowHeight;
    } catch (e) {
      console.log(e);
    }
  },
  globalData: {
    imageURL: http.imageURL,
    baseURL: http.baseURL,
    upFileURL: http.upFileURL,
    loginFlag: true, //登录阈值  当登陆成功后则不在触发登录
    requestFlag: true, //打开请求阈值
    requestList: [], //请求列表 用于请求报错时的中断请求
    userInfo: {}, //用户信息
    token: '', //token
    transmit: {
      title: '辑言',
      path: '',
      success: function (res) {
        util.toast('转发成功')
      },
      fail: function (res) {
        // util.toast('转发失败')
      }
    }
  }
})
