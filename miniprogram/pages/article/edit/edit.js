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
    pageType: 'add',
    imageURL: app.globalData.imageURL,
    baseURL: app.globalData.baseURL,
    addList: [{ type: 'text', name: '文本域' }, { type: 'image', name: '图片域' }, { type: 'audio', name: '音频域' }],
    title: '',
    contentList: [{ type: 'image', value: [] }, { type: 'text', value: '' }, { type: 'image', value: [] }, { type: 'audio', value: [] }],
    swiperCurrent: 0,
    moodList: [{ id: 0, name: '开心' }, { id: 1, name: '自在' }, { id: 2, name: '生气' }, { id: 3, name: '感到寒冷' }, { id: 4, name: '心情低沉' }, { id: 5, name: '也无风来也无晴' }],
    moodIndex: 0,
    detail: {},
    recordTag: '',// 获取id
    audioId: ''// 当前触发活动的音频标签id
  },

  // 查看预览
  seeView() {
    console.log(this.data.contentList)

    if (this.data.title.length === 0) {
      util.toast('请输入标题')
    } else {
      wx.navigateTo({
        url: `/pages/article/detail/detail?t=${this.data.pageType}`
      })
    }
  },

  //设置标题
  setTitle(e) {
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
  pickerChange(e) {
    let t = e.currentTarget.dataset.t
    let v = e.detail.value
    if (t === 'add') {
      this.addNode(v)
    } else if (t === 'mood') {
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
    let contentList = util.deepCopy(this.data.contentList)
    let swiperCurrent = this.data.swiperCurrent
    let tag = {}
    if (v === '0') {
      tag = {
        type: 'text',
        value: ''
      }
    } else if (v === '1') {
      tag = {
        type: 'image',
        value: []
      }
    } else if (v === '2') {
      tag = {
        type: 'audio',
        value: []
      }
    }
    contentList.splice(swiperCurrent + 1, 0, tag)
    debugger
    contentList = this.setMediaList(contentList)

    console.log(contentList)
    this.setData({
      contentList: contentList,
      swiperCurrent: swiperCurrent + 1
    })
  },

  // 删除某个节点
  delNode(e) {
    let contentList = this.data.contentList
    let swiperCurrent = this.data.swiperCurrent
    if (swiperCurrent === 0) {
      util.toast('封面图节点禁止删除')
    } else if (contentList.length > 2) {
      wx.showModal({
        title: '提示',
        content: '是否删除当前节点',
        success: res => {
          if (res.confirm) {
            contentList.splice(swiperCurrent, 1)
            contentList = this.setMediaList(contentList)
            this.setData({
              contentList
            })
            if (contentList.length - 1 < swiperCurrent) {
              this.setData({
                swiperCurrent: contentList.length - 1
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

  //设置音频函数
  setAudio(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    let strValue = `contentList.[${index}].value`
    this.setData({
      [strValue]: e.detail.audioList
    })
  },

  // 设置录音页
  setRecording(e) {
    this.setData({
      isRecording: e.detail.isRecording,
      audioId: `swiper-${e.currentTarget.dataset.index}`
    })
  },

  // 停止录音
  stopRecord() {
    console.log(this.data.audioId)
    this.selectComponent(`#${this.data.audioId}`).stopRecord()
  },

  // 设置播放页
  setAudioPlay(e) {
    this.setData({
      isAudioPlay: e.detail.isAudioPlay,
      audioId: `swiper-${e.currentTarget.dataset.index}`
    })
  },
  // 停止播放
  stopAudioPlay(e) {
    this.selectComponent(`#${this.data.audioId}`).stopAudio()
  },

  stopEvent() {
    if (this.data.isRecording) {
      this.stopRecord()
    }
    if (this.data.isAudioPlay) {
      this.stopAudioPlay()
    }
  },
  //设置媒体
  setMediaList(list) {
    console.log(list)
    return list.map(item => {
      if (item.type === 'image') {
        item.imageList = []
        item.value.map(item1 => {
          item.imageList.push({
            path: item1
          })
        })
      } else if (item.type === 'audio') {
        item.audioList = []
        item.value.map(item1 => {
          item.audioList.push({
            path: item1
          })
        })
      }
      return item
    })
  },

  //如果是修改则需要初始化页面
  initPage() {
    db.collection('article').doc(this.data.id).get()
      .then(res => {
        let data = res.data
        let content = data.content
        content = this.setMediaList(content)
        this.setData({
          detail: data,
          title: data.title,
          contentList: content,
          moodIndex: data.mood
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
    this.setData({
      recordTag: app.globalData.recordTag
    })
    if (id) {
      this.setData({
        pageType: 'edit',
        id
      })
      this.initPage()
    } else {
      let contentList = this.setMediaList(this.data.contentList)
      this.setData({
        contentList
      })
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
