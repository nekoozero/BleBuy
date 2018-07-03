// component/littleBox/littleBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    open:{
      type:Boolean
    },
    index:{
      type:String
    },

    num:{
      type: String,
      
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
       chosen:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
       choose:function(){
         this.setData({
           chosen:true
         })
       },
       nochoose:function(){
          wx.showToast({
            title: '来晚了~~',
            duration:1200,
            image:'/img/icon_intro.png'
          })
       },
       cancel:function(){
         this.setData({
           chosen:false
         })
       } 
  }
})
