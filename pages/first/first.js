// pages/first/first.js
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

   
  
    let that= this;
    wx.showLoading({
      title: '正在登陆……',
    })
    wx.login({
      success: function (res) {
        console.log(res);
        that.setData({
          res:res
        });
        wx.request({
          url: 'https://www.jsqckj.cn/btunlockweb/customers/selectbyopenid',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          data: {
            code: res.code 
          },
          success: function (res) {
            console.log(res);
            wx.hideLoading();
            wx.setStorageSync("openid", res.data.data.custome.customeropenid);
            wx.redirectTo({
              url: '../welcome/welcome',
            });
          }, 
         fail:function(res){ 
           console.log(res);
           //第二次登陆 
           let ress =  that.data.res;
           wx.request({
             url: 'https://www.jsqckj.cn/btunlockweb/customers/selectbyopenid',
             header: {
               'content-type': 'application/x-www-form-urlencoded'
             },
             method: 'POST',
             data: {
               code: ress.code
             },
             success: function (res) {
               console.log(res);
               wx.hideLoading();
               wx.setStorageSync("openid", res.data.data.custome.customeropenid);
               wx.redirectTo({
                 url: '../welcome/welcome',
               });
             },
             fail:function(err){
               console.log(err);
               //第三次点登陆
               let resss = that.data.res;
               wx.request({
                 url: 'https://www.jsqckj.cn/btunlockweb/customers/selectbyopenid',
                 header: {
                   'content-type': 'application/x-www-form-urlencoded'
                 },
                 method: 'POST',   
                 data: {
                   code: resss.code
                 },
                 success: function (res) {
                   console.log(res);
                   wx.hideLoading();
                   wx.setStorageSync("openid", res.data.data.custome.customeropenid);
                   wx.redirectTo({
                     url: '../welcome/welcome',
                   });
                 },
                 faile:function(err){
                   console.log(err);
                 }
               });
             }
           })
         }
        })
      },
      fail: function () {
        that.setData({
          msg: '获取用户信息失败！'

        });
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
  
  }
})