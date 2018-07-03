// pages/welcome/login/managebox/maintainbox/single/single.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
       
  },

  /**
   * 生命周期函数--监听页面加载
   * vie                         
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载……',
      mask:true
    });
    let that = this;
    let containernum = options.containernum;
    
    // let contypeid = options.contypeid;
    let id = options.id;
    this.setData({
      containernum: containernum,
      id:id
    });

    wx.request({
      url: 'https://www.jsqckj.cn/btunlockweb/distributors/editcontainer',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data:{
        conid:id
      },
      success:function(res){
          console.log(res);
          if(res.data.message=="SUCCESS")
          that.setData({
              grids: res.data.data.Congrids,
              container: res.data.data.Containers,
              
          });
          wx.hideLoading();
      }
    
    })
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
  updateMe:function(event){
    let that =this;
    wx.navigateTo({
      url: 'updatesingle/updatesingle?id=' + that.data.id + "&containernum=" + that.data.containernum,
    })
    
  }
})