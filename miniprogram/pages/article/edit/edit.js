// miniprogram/pages/article/edit/edit.js
const db = wx.cloud.database()
const app = getApp()
const util = require('../../../public/utils/util.js');
const http = require('../../../public/utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageType:'add',
    imageURL: app.globalData.imageURL,
    baseURL: app.globalData.baseURL,
    addList: [{ type: 'text', name: '文本域' }, { type: 'image', name: '图片域' }, { type: 'audio', name: '音频域' }],
    title:'',
    contentList: [{type: 'image', value: []}, {type: 'text', value: ''}, {type: 'image', value: []},{type:'audio',value:''}],
    swiperCurrent: 0,
    moodList: [{id:0,name:'开心'},{id:1,name:'自在'},{id:2,name:'生气'},{id:3,name:'感到寒冷'},{id:4,name:'心情低沉'},{id:5,name:'也无风来也无晴'}],
    moodIndex: 0,
    detail:{}
  },
  // 查看预览
  seeView(){
    console.log(this.data.contentList)

    if(this.data.title.length === 0){
      util.toast('请输入标题')
    }else{
      wx.navigateTo({
        url: `/pages/article/detail/detail?t=${this.data.pageType}`
      })
    }
  },
  //设置标题
  setTitle(e){
    this.setData({
      title: e.detail.value
    })
  },
  // 文字域输入
  inputChange(e) {
    let index = e.currentTarget.dataset.index
    let str = `contentList[${index}].value`
    this.setData({
      [str]: e.detail.value
    })
  },
  // picker选择的公共接入
  pickerChange(e){
    let t = e.currentTarget.dataset.t
    let v = e.detail.value
    if(t === 'add'){
      this.addNode(v)
    }else if(t === 'mood'){
      this.setMood(v)
    }
  },
  //设置月份
  setMood(v) {
    this.setData({
      moodIndex: Number(v)
    })
  },
  // 添inputChange加节点函数
  addNode(v) {
    let contentList = this.data.contentList
    let swiperCurrent = this.data.swiperCurrent
    console.log(v)
    let tag = {}
    if(v === '0'){
      tag = {
        type: 'text',
        value:''
      }
    }else if(v === '1'){
      tag = {
        type: 'image',
        value:[]
      }
    }else{
      tag = {
        type:'audio',
        value: ''
      }
    }
    contentList.splice(swiperCurrent + 1, 0, tag)
    contentList = this.setImageList(contentList)
    this.setData({
      contentList,
      swiperCurrent:swiperCurrent+1
    })
  },

  // 删除某个节点
  delNode(e) {
    let contentList = this.data.contentList
    let swiperCurrent = this.data.swiperCurrent
    if (swiperCurrent === 0) {
      util.toast('封面图节点禁止删除')
    } else if(contentList.length > 2){
      wx.showModal({
        title: '提示',
        content: '是否删除当前节点',
        success: res=>{
          if (res.confirm) {
            contentList.splice(swiperCurrent, 1)
            contentList = this.setImageList(contentList)
            this.setData({
              contentList
            })
            if (contentList.length-1 < swiperCurrent) {
              this.setData({
                swiperCurrent: contentList.length-1
              })
            }
          }
        }
      })
    } else {
      util.toast('请确保有内容节点')
    }
  },
  //设置图片函数
  setImg(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    let strValue = `contentList.[${index}].value`
    this.setData({
      [strValue]: e.detail.imageList
    })
  },

  setImageList(list){

    return list.map(item1=>{
      if(item1.type === 'image'){
        item1.imageList = []
        item1.value.map(item2=>{
          item1.imageList.push({
            path: item2
          })
        })
      }
      return item1
    })
  },
  //如果是修改则需要初始化页面
  initPage(){
    db.collection('article').doc(this.data.id).get()
      .then(res=>{
        console.log(res)
        let data = res.data
        let content = data.content
        content = this.setImageList(content)
        this.setData({
          detail:data,
          title:data.title,
          contentList:content,
          moodIndex:data.mood
        })
      })
  },
  // swiper切换
  swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击底部切换
  setSwiper(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      swiperCurrent: index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    if(id){
      this.setData({
        pageType:'edit',
        id
      })
      this.initPage()
    }
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
