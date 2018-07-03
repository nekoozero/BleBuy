// pages/welcome/login/managewo/manangeworker/manangeworker.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [
      { "id": "1", "workId": "000001", name: "小红",used:1 },
      { "id": "2", "workId": "000002", name: "小明", used: 0},
      { "id": "3", "workId": "000003", name: "小花", used: 1 }
    ]
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
  lookworker:function(event){
    let id = event.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: 'workermessage/workmessage?workid='+id,
    })
  }
})