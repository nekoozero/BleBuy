// pages/welcome/login/managewo/addworker/addworker.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },
  addworker:function(e){
    let that= this;
    let flag=true;
     for(let x in e.detail.value){
       if (e.detail.value[x].trim()==""){
         this.setData({
           msg:'所有项均不得为空'
         });
         flag = false;
         break;
       }else{
         flag=true;
       }
      
     }
     if(flag){
       this.setData({
         msg:''
       });
       console.log(
);
      
       let obj = e.detail.value;
       obj.supplierbydisid = wx.getStorageSync("distributors").distributorid
       wx.request({
         url: 'https://www.jsqckj.cn/btunlockweb/suppliers/supplieradd',
         header: {
           'content-type': 'application/x-www-form-urlencoded'
         },
         method: 'POST',
         data: {
           supplierbydisid: obj.supplierbydisid,
           supplierloginid: obj.supplierloginid,
           suppliername: obj.suppliername,
           supplierpassword: obj.supplierpassword,
           suppliertelphone: obj.suppliertelphone,
           supplierwechat: obj.supplierwechat,
         },
         success:function(res){
            if(res.data.data.status==101){
              that.setData({
                msg:res.data.data.msg
              });
            }else if(res.data.data.status==100){
              wx.showToast({
                title: '创建成功',
                icon:'success',
                duration:2000
              });
              wx.hideToast();
              wx.redirectTo({
                url: '../managewo',
              })
            }
         }
       })
     }
     
  }
})