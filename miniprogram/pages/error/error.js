// pages/error/error.js
const app = getApp()
const util = require('../../public/utils/util.js');
const http = require('../../public/utils/http.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageURL: app.globalData.imageURL,
    t: 1
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //type=1判断是普通登录失败 type=2 是首页登录失败 type=0是网络失败
  onLoad: function(options) {
    this.setData({
      t: options.t
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.globalData.requestFlag = true
  },
  // 分享
  onShareAppMessage: function(res) {
    return app.globalData.transmit
  }
})