// public/components/bulge_btn/bulge_btn.js
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: [''],
  properties: {
    bgColor:{
      type:String,
      value: '#2475FB'
    },
    size:{
      type: Number,
      value: 28
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap () {
      this.triggerEvent('click');
    },
  }
})
