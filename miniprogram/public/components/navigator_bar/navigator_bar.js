// public/components/navigator_bar/navigator_bar.js
let config = require('config');

const app = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    bgColor: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    capsuleHeight: config.capsuleHeight,
    statusBarHeight: config.statusBarHeight,
    pixelRate: config.pixelRate,
  },
  lifetimes: {
    // attached: function () {
    //   // 在组件实例进入页面节点树时执行
    //   debugger
    // },
    // detached: function() {
    //   // 在组件实例被从页面节点树移除时执行
    //   this.setData({
    //     imgList: [],
    //     valueList: []
    //   })
    // },
    // error(err){
    //   console.log(err)
    // }
  },
  attached: function() {
    // 在组件实例进入页面节点树时执行
    this.setData({
      imgList: [],
      valueList: []
    })
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
    this.setData({
      imgList: [],
      valueList: []
    })
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {}
})
