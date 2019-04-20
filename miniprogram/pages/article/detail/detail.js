// miniprogram/pages/article/detail/detail.js
const db = wx.cloud.database()
const app = getApp()
const util = require('../../../public/utils/util.js');
const http = require('../../../public/utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageURL: app.globalData.imageURL,
    baseURL: app.globalData.baseURL,
    pageType: 'detail',
    pageTitle: '详情',
    title: '',//标题
    content: '',//内容
    moodIndex:0,//情绪
    showUpBtn: false,
    bgStyle: '',//顶部背景css
    isShow: true,//是否展示更多的图片
    imageList: [],
    disable: false,//控制提交
    moodShow: false
  },
  upData() {
    if (this.data.disable) return false
    this.setData({
      disable: true
    })
    let date = new Date()
    let month =`${date.getFullYear()}-${util.formatNumber(date.getMonth()+1)}`
    let requestData = {
      title: this.data.title,
      content: this.data.content,
      cover_img:this.data.content[0].value[0],
      mood:this.data.moodIndex,
      update_time: date,
    }
    let _this = this
    let detail = this.data.detail
    function upData (){
      if(_this.data.pageType === 'add'){
        requestData.create_time = date
        requestData.month = month
        requestData.sign = 0
        return  db.collection('article').add({
          // data 字段表示需新增的 JSON 数据
          data: requestData,
        })
      }else {
        requestData.month = detail.month
        requestData.sign = detail.sign
        return db.collection('article').doc(detail._id).update({
          // data 传入需要局部更新的数据
          data: requestData
        })
      }
    }
    upData().then((res) => {
      util.toast('保存成功，即将前往首页', setTimeout(() => {
        wx.switchTab({
          url: '/pages/article/list/list'
        })
      }, 1500))
    }).catch(err => {
      this.setData({
        disable: false
      })
      util.toast('保存失败，请稍后再试')
    })
  },
  // 查看图片列表
  seeImageList(e) {
    let src = e.currentTarget.dataset.src
    let imageList = this.data.imageList
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imageList // 需要预览的图片http链接列表
    })
  },
  // 产生可以预览的图片列表
  setImageList(list) {
    let imageList = []
    list.map(item => {
      if (item.type === 'image') {
        imageList = imageList.concat(item.value)
      }
    })
    this.setData({
      imageList
    })
  },
  // 设置封面图
  setCoverImg(src){
    if (src) {
      wx.cloud.getTempFileURL({
        fileList: src
      }).then(res => {
        console.log(res)
        this.setData({
          bg: res.fileList[0].tempFileURL,
          bgStyle: `background-image: url('${res.fileList[0].tempFileURL}')`
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },
  // 查看修改活新增
  initSeeEdit(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];//当前页面的上一个页面
    this.setData({
      detail:prevPage.data.detail,
      title: prevPage.data.title,
      content: prevPage.data.contentList,
      moodIndex:prevPage.data.moodIndex,
      pageTitle: '预览',
      showUpBtn: true
    })
    // 处理图片列表
    this.setImageList(prevPage.data.contentList)
    //设置封面图
    this.setCoverImg(prevPage.data.contentList[0].value)
  },
  initSeeDetail(){
    db.collection('article').doc(this.data.id).get()
      .then(res=>{
        console.log(res)
        let data = res.data
        this.setData({
          detail:data,
          title: data.title,
          content: data.content,
          moodIndex:data.mood,
          pageTitle: '文',
          showUpBtn: true
        })
        // 处理图片列表
        this.setImageList( data.content)
        //设置封面图
        this.setCoverImg( data.content[0].value)
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let setData = { pageType: options.t}
    if(options.id){
      setData.id=options.id
    }
    this.setData(setData)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let pageType =  this.data.pageType
    if (pageType === 'edit'|| pageType === 'add') {
      this.initSeeEdit()
    } else {
      this.initSeeDetail()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onPageScroll: function (e) {
    let tempFileURL = this.data.bg
    if (e.scrollTop > 5 && this.data.isShow) {
      this.setData({
        isShow: false,
        bgStyle: 'height:128rpx',
        contentStyle: 'padding-top:328rpx',
        moodShow:true
      })
      wx.pageScrollTo({
        scrollTop: e.scrollTop,
        duration: 300
      })
    } else if (e.scrollTop <= 5 && !this.data.isShow) {
      this.setData({
        isShow: true,
        bgStyle: `background-image: url('${tempFileURL}');height:500rpx`,
        contentStyle: 'padding-top:700rpx',
        moodShow:false
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
