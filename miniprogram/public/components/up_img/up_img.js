// public/components/up_img/up_img.js
const app = getApp()
const util = require('../../utils/util.js');
const http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    disabled: {
      type: Boolean,
      value: false,
      observer: 'changeDisabled'
    },
    //存储图片  [{path:图片路径}]
    imageList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    baseURL: app.globalData.baseURL,
    imageURL: app.globalData.imageURL,
    valueList:[]
  },
  observers:{
    'valueList':function () {
      this.triggerEvent('setImg', {
        imageList: this.data.valueList
      })
    },
    'imageList.**':function () {
      let valueList = this.data.imageList.map(item=>{
        return item.path
      })
      this.setData({
        valueList
      })
    }
  },
  lifetimes: {
    // attached: function () {
    //   // 在组件实例进入页面节点树时执行
    //   debugger
    // },
    // detached: function() {
    //   // 在组件实例被从页面节点树移除时执行
    //   this.setData({
    //     imageList: [],
    //     valueList: []
    //   })
    // },
    // error(err){
    //   console.log(err)
    // }
  },
  attached: function () {

  },
  detached: function () {
    // 在组件实例被从页面节点树移除时执行
    // this.setData({
    //   imageList: [],
    //   valueList: []
    // })
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
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let imageList = _this.data.imageList;
          let seeImg = _this.data.seeImg;
          _this.setData({
            flag: true,
            disabled:true
          })
          wx.showLoading({
            title: '请等待',
          })
          let j = 0;
          let arr = []
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            arr[i] = _this.upImg(res.tempFilePaths[i], i + _this.data.valueList.length)
          }
          Promise.all(arr).then(()=>{
            _this.setData({
              disabled:false
            })
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
      let del = 'imageList[' + i + '].del'
      let error = 'imageList[' + i + '].error'
      let imgStr = 'imageList[' + i + '].path'
      let x = Math.ceil(Math.random()*1000)
      return new Promise(resolve => {
        wx.cloud.uploadFile({
          cloudPath: `images/${x}${(new Date()).getTime()}`,
          filePath: tempFilePaths, // 文件路径
          success(res) {
            console.log(res)
            if(res.statusCode === 200){
              _this.setData({
                [imgStr]: res.fileID,
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
    //点击查看图片
    seeImg(e) {
      let imageList = this.data.imageList
      let index = e.currentTarget.dataset.index
      let showList = []
      for (let i = 0; i < imageList.length; i++) {
        showList.push(app.globalData.baseURL + imageList[i].path)
      }
      wx.previewImage({
        current: showList[index], // 当前显示图片的http链接
        urls: showList // 需要预览的图片http链接列表
      })
    },
    //删除图片
    delImg(e) {
      let index = e.currentTarget.dataset.index
      let imageList = this.data.imageList
      let valueList = util.deepCopy(this.data.valueList)
      if(!imageList[index].error){
        valueList.splice(index, 1)
      }
      imageList.splice(index, 1)

      this.setData({
        imageList,
        valueList
      })
    },
    // 当imageList 变化 赋值value
    // changeValueArr(){
    //   let valueList = this.data.imageList.map(item=>{
    //     return item.path
    //   })
    //   this.setData({
    //     valueList
    //   })
    // },
    //侦听valueList图片数量变化触发函数
    // changeImgArr(e) {
    //   this.triggerEvent('setImg', {
    //     imageList: this.data.valueList
    //   })
    // },
    //侦听上传事件 触发disabled事件
    changeDisabled(e) {
      this.triggerEvent('setDisabled', {
        disabled: this.data.disabled
      })
    }
  }
})
