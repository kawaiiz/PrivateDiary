// public/components/up_audio/up_audio.js
const app = getApp()
const util = require('../../utils/util.js');
const http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //存储音频的返回信息
    valueList: {
      type: Array,
      value: [],
      observer: 'changeAudioArr'
    },
    disabled: {
      type: Boolean,
      value: false,
      observer: 'changeDisabled'
    },
    isRecording: {// 是否在录音
      type: Boolean,
      value: false
    },
    isAudioPlay: { // 是否在播放
      type: Boolean,
      value: false
    },
    audioList: { //存储音频
      type: Array,
      value: []
    },
    maxLength: {
      type: Number,
      value: 1000000
    },
    recordTag: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    baseURL: app.globalData.baseURL,
    imageURL: app.globalData.imageURL,
    audioTag: null,// 录音对象
    audioPlayIndex: null // 正在播放的
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行

    },
    ready: function () {
      // 在组件在视图层布局完成后执行
      this.initAudio()
      this.initRecord()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      this.setData({
        audioList: [],
        valueList: []
      })
    },
    error(err) {
      console.log(err)
    }
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示

    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 开始录音
    startRecord() {
      if (this.data.isAudioPlay) {
        util.toast('音频正在播放，请关闭后在重试')
        return false
      }
      if (this.data.isRecording) {
        util.toast('音频正在上传，请结束后在重试')
        return false
      }
      if (this.data.audioList.length + 1 > this.data.maxLength) {
        util.toast(`最多上传${this.data.maxLength}段音频`)
        return false
      }
      this.recordTag.start({
        duration: 600000
      })
    },

    //停止录音
    stopRecord(e) {
      this.recordTag.stop()
    },

    // 初始化 录音
    initRecord() {
      this.recordTag = this.data.recordTag
      this.recordTag.onStart(() => {
        this.setData({
          isRecording: true
        })
        this.changeIsRecording()
      })
      this.recordTag.onStop((res) => {
        wx.showLoading({
          title: '请等待',
        })

        /* this.innerAudioContext.src = res.tempFilePath
        this.innerAudioContext.play() */

        this.upAudio(res.tempFilePath, this.data.valueList.length).then(res => {
          this.setData({
            isRecording: false
          })
          this.changeIsRecording()

          wx.hideLoading()
        }).catch(err => {
          console.log(err)
          this.setData({
            isRecording: false
          })
          this.changeIsRecording()
          wx.hideLoading()
        })
      })
    },
    //上传音频
    upAudio(tempFilePath, i) {
      let _this = this
      return new Promise((resolve, reject) => {
        let del = 'audioList[' + i + '].del'
        let error = 'audioList[' + i + '].error'
        let str = 'valueList[' + i + ']'
        let audioStr = 'audioList[' + i + '].path'
        let x = Math.random()
        console.log(tempFilePath)
        wx.cloud.uploadFile({
          cloudPath: `audio/${x}${(new Date()).getTime()}`,
          filePath: tempFilePath, // 文件路径
          success: (res) => {
            console.log(res)
            if (res.statusCode === 200) {
              _this.setData({
                [audioStr]: res.fileID,
                [str]: res.fileID,
                [del]: true,
                [error]: false
              })
            } else {
              _this.setData({
                [audioStr]: tempFilePath,
                [str]: "",
                [del]: true,
                [error]: true
              })
            }
          },
          fail: () => {
            _this.setData({
              [imgStr]: tempFilePath,
              [str]: "",
              [del]: true,
              [error]: true
            })
          },
          complete() {
            _this.setData({
              disabled: false
            })
            resolve()
          }
        })
      })
    },
    // 点击预览音频
    startAudio(e) {

      if (this.data.isAudioPlay) {
        util.toast('音频正在播放，请关闭后在重试')
        return false
      }
      if (this.data.isRecording) {
        util.toast('音频正在上传，请结束后在重试')
        return false
      }
      let index = e.currentTarget.dataset.index
      this.setData({
        audioPlayIndex: index
      })
      this.innerAudioContext.src = this.data.audioList[index].path
      this.innerAudioContext.play()
    },
    // 停止预览音频
    stopAudio(e) {
      this.innerAudioContext.stop()
    },
    // 初始化音频
    initAudio() {
      this.innerAudioContext = wx.createInnerAudioContext()

      if (wx.setInnerAudioOption) {
        wx.setInnerAudioOption({
          obeyMuteSwitch: false
        })
      } else {
        this.innerAudioContext.obeyMuteSwitch = false;
      }
     

      
      this.innerAudioContext.onPlay(() => {
        this.setData({
          isAudioPlay: true
        })
        console.log('开始播放')
        this.changeIsAudioPlay()
      })
      this.innerAudioContext.onStop(() => {
        this.setData({
          isAudioPlay: false
        })
        console.log('停止播放')
        this.changeIsAudioPlay()
      })
      this.innerAudioContext.onError((res) => {
        console.log(res)
      })

    },
    // 删除音频
    delAudio(e) {
      let index = e.currentTarget.dataset.index
      let audioList = this.data.audioList
      let valueList = util.deepCopy(this.data.valueList)
      audioList.splice(index, 1)
      valueList.splice(index, 1)
      this.setData({
        audioList,
        valueList
      })
    },

    //侦听音频数量变化触发函数
    changeAudioArr(e) {
      let valueList = this.data.valueList
      let value = []
      console.log(valueList)
      for (let i = 0; i < valueList.length; i++) {
        if (valueList[i].length !== 0) {
          value.push(valueList[i])
        }
      }
      this.triggerEvent('setAudio', {
        audioList: value
      })
    },
    //侦听上传事件 触发disabled事件
    changeDisabled(e) {
      this.triggerEvent('setDisabled', {
        disabled: this.data.disabled
      })
    },
    //侦听录制事件 触发disabled事件
    changeIsRecording(e) {
      this.triggerEvent('setRecording', {
        isRecording: this.data.isRecording
      })
    },
    //侦听播放事件 触发disabled事件
    changeIsAudioPlay(e) {
      this.triggerEvent('setAudioPlay', {
        isAudioPlay: this.data.isAudioPlay
      })
    }
  }
})
