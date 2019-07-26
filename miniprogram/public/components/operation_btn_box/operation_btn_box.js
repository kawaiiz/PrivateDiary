// public/components/operation_btn_box/operation_btn_box.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    articleId:{
      type:String,
      value:'11'
    },
    sign:{
      type:Number,
      value:null
    },
    index:{
      type:Number,
      value:null
    },
    coverImg:{
      type:String,
      value:null
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
    gotoEdit(e){
      let url = e.currentTarget.dataset.url
      this.triggerEvent('gotoEdit',{
        url
      });
    },
    setSign(){
      this.triggerEvent('setSign',{
        index:this.data.index,
        id:this.data.articleId,
        sign:this.data.sign
      });
    }
  }
})
