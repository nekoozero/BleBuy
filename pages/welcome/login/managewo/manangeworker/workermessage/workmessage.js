// pages/welcome/login/managewo/manangeworker/workermessage/workmessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      worker:{
        id:'1',
        supplierloginid:'000001',
        suppliername:'nekoo',
        suppliertelphone:'15905101302',
        supplierdeltag:0,
        supplierwechat:'qxnekoo'
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // this.setData({
      //   "worker.id":options.workid
      // });
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
  turnon:function(){
    this.setData({
      "worker.supplierdeltag":1
    });
  },
  turnoff:function(){
    this.setData({
      'worker.supplierdeltag':0
    });
  },
  updateworker:function(event){
    let id = this.data.worker.id;
    wx.navigateTo({
      url: 'update/update?id='+id,
    })
  }
})