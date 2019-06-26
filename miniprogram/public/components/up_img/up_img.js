// public/components/up_img/up_img.js
const app = getApp()
const util = require('../../utils/util.js');
const http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //存储图片的返回信息
    valueList: {
      type: Array,
      value: [],
      observer: 'changeImgArr'
    },
    disabled: {
      type: Boolean,
      value: false,
      observer: 'changeDisabled'
    },
    imgList: { //存储图片
      type: Array,
      value: []
    },
    maxLength: {
      type: Number,
      value: 1000000
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    baseURL: app.globalData.baseURL,
    imageURL: app.globalData.imageURL
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行

    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      this.setData({
        imgList: [],
        valueList: []
      })
    },
    error(err){
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
    setImg() {
      let _this = this
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let imgList = _this.data.imgList;
          let seeImg = _this.data.seeImg;

          if (imgList.length + res.tempFilePaths.length > _this.data.maxLength) {
            util.toast(`最多上传${_this.data.maxLength}张照片`)
            return false
          }

          wx.showLoading({
            title: '请等待',
          })

          let arr = []
          let j = 0;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            arr.push(_this.upImg(res.tempFilePaths[i], i + _this.data.valueList.length))
          }
          console.log(arr)
          Promise.all(arr).then(res =>{
            console.log(_this.data.imgList)
            console.log(_this.data.valueList)
            wx.hideLoading()
          }).catch(err=>{
            console.log(err)
            wx.hideLoading()
          })
        },
        fail: function (err) {

        }
      })
    },
    //上传图片
    upImg(tempFilePaths, i) {
      let _this = this
      return new Promise((resolve, reject) => {
        let del = 'imgList[' + i + '].del'
        let error = 'imgList[' + i + '].error'
        let str = 'valueList[' + i + ']'
        let imgStr = 'imgList[' + i + '].path'
        let x = Math.random()
        wx.cloud.uploadFile({
          cloudPath: `images/${x}${(new Date()).getTime()}`,
          filePath: tempFilePaths, // 文件路径
          success(res) {
            console.log(res)
            if(res.statusCode === 200){
              _this.setData({
                [imgStr]: res.fileID,
                [str]:  res.fileID,
                [del]: true,
                [error]: false
              })
            }else{
              _this.setData({
                [imgStr]: tempFilePaths,
                [del]: true,
                [error]: true
              })
            }
          },
          complete() {
            resolve()
          }
        })
      })
    },
    // 预览图片
    seeImg(e) {
      let imgList = this.data.imgList
      let index = e.currentTarget.dataset.index
      console.log(imgList)
      let showList = []
      for (let i = 0; i < imgList.length; i++) {
        showList.push(app.globalData.baseURL + imgList[i].path)
      }
      wx.previewImage({
        current: showList[index], // 当前显示图片的http链接
        urls: showList // 需要预览的图片http链接列表
      })
    },
    delImg(e) {
      let index = e.currentTarget.dataset.index
      let imgList = this.data.imgList
      let valueList = util.deepCopy(this.data.valueList)
      imgList.splice(e.currentTarget.dataset.index, 1)
      valueList.splice(e.currentTarget.dataset.index, 1)
      this.setData({
        imgList,
        valueList
      })
    },
    //侦听图片数量变化触发函数
    changeImgArr(e) {
      let valueList = this.data.valueList
      let value = []
      for(let i = 0 ; i < valueList.length ; i++){
        if(valueList[i].length !== 0){
          value.push(valueList[i])
        }
      }
      this.triggerEvent('setImg', {
        imgList: value
      })
    },
    //侦听上传事件 触发disabled事件
    changeDisabled(e) {
      this.triggerEvent('setDisabled', {
        disabled: this.data.disabled
      })
    }
  }
})
