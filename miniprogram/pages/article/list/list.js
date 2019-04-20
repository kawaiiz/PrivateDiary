const db = wx.cloud.database()
const app = getApp()
const util = require('../../../public/utils/util.js');
const http = require('../../../public/utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goto:'',// edit detail
    imageURL: app.globalData.imageURL,
    baseURL: app.globalData.baseURL,
    todayMonth: '',//当前月
    requestData: {
      p: 1,
      limit: 5,
      sign: '0',
      month: ''//选中的月份
    },
    maxP: 1,
    typeList: [{name: '全部', id: 1}, {name: '标记', id: 2}],
    dataList:[],
    isPullDown:false, //判断是否是上拉刷新
    typeIndex:0//文章全部还是标记
  },
  //前往修改
  gotoEdit(e){
    let url=e.currentTarget.dataset.url
    wx.navigateTo({
      url: `${url}`
    })
  },
  //前往详情
  gotoDetail(e){
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/article/detail/detail?id=${id}&t=detail`
    })
  },
  // 加上标记
  setSign(e){
    let data = e.detail
    db.collection('article').doc(data.id).update({
      // data 传入需要局部更新的数据
      data: {
        sign:data.sign===1?0:1
      }
    }).then(res=>{
      let str = `dataList[${data.index}].sign`
      this.setData({
        [str]:data.sign===1?0:1
      })
    }).catch(err=>{
      console.log(err)
      util.toast('标记失败')
    })
  },
  // 设置月份
  setMonth(e) {
    this.setData({
      'requestData.month': e.detail.value
    })
    this.initList()
  },
  // 设置类型
  setType(e) {
    this.setData({
      typeIndex:e.detail.value
    })
    this.setData({
      'requestData.sign': e.detail.value
    })
    this.initList()
  },
  // 获取总页数
  getMaxP(){
    let requestData = this.data.requestData
    let {limit,sign,month} = requestData
    let where = {
      month
    }
    if(sign !== 'all'){
      where.sign = sign
    }
    db.collection('article').where(where).count().then(res => {
      this.setData({
        maxP: Math.ceil(res.total/limit)
      })
    })
  },
  // 获取列表
  getList() {
    let requestData = this.data.requestData
    if (this.data.maxP < requestData.p) return false
    this.setData({
      onLoading: true
    })

    let setData = {
      onLoading: false,
      requestData: util.deepCopy(requestData)
    }

    const _ = db.command
    let {p,limit,sign,month} = requestData
    let where = {
      month
    }
    if(sign !== '0'){
      where.sign = Number(sign)
    }
    console.log(where)
    console.log(requestData)
    db.collection('article').skip((p-1)*limit).limit(limit).where(where)
      .field({
        _id:true,
        cover_img:true,
        mood:true,
        sign:true,
        title:true
      })
      .get()
      .then((res)=>{
        console.log(res.data)
        let dataList = this.data.dataList
        setData.dataList = dataList.concat(Array.isArray(res.data)? res.data:[])
        setData.requestData.p = requestData.p + 1
        if (res.data.length < requestData.limit) {
          setData.noMore = true
        }
        this.setData(setData)
        if(this.data.isPullDown){
          this.setData({
            isPullDown:false
          })
          wx.stopPullDownRefresh()
        }
      })
      .catch(err=>{
        console.log(err)
        this.setData(setData)
      })
  },
  initList() {
    let requestData = this.data.requestData
    this.setData({
      requestData: {
        p: 1,
        limit: 5,
        sign: requestData.sign,
        month: requestData.month//选中的月份
      },
      dataList:[],
      maxP: 1
    })
    this.getList()
    this.getMaxP()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date()
    let month =`${date.getFullYear()}-${util.formatNumber(date.getMonth()+1)}`
    this.setData({
      'requestData.month': month,
      todayMonth:month
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   this.initList()
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      isPullDown:true
    })
    this.initList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})