// pages/welcome/login/personal/updatepass/updatepass.js
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
    let password = getApp().globalData.password;
    this.setData({
      password:password
    });
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
  submitpass: function (e) {


    let info = wx.getStorageSync('distributors');
    

    const that = this;
    let oldpass = e.detail.value.oldpass;
    let newpass = e.detail.value.newpass;
    let conpass = e.detail.value.conpass;
    let userId;
    if (oldpass.trim() == '' || newpass.trim() == '' || conpass.trim() == ''){
      that.setData({
        msg:'输入栏不得为空'
      });
      return ;
    }
    if ('supplierid' in info) {
      //补货员的
      userId = info.supplierloginid;
       if (getApp().globalData.spassword != oldpass){
         that.setData({ 
           msg: '旧密码错误'
         });
         return;
       }
       if (newpass != conpass) {
         that.setData({
           msg: '确认密码错误'
         });
         return;
       }
       wx.request({
         url: 'https://www.jsqckj.cn/btunlockweb/suppliers/updatepass',
         method:'POST',
         header: {
           'content-type': 'application/x-www-form-urlencoded'
         },
         data:{
           loginid: userId,
           oldpass: oldpass,
           newpass: newpass
         },
         success:function(res){
           if (res.data.data.status == 100) {
             getApp().globalData.spassword = newpass;
             wx.showToast({
               title: '修改完成',
               icon: 'success',
               duration: 2000
             });
             wx.hideToast();
           }
         }
       })
       
    } else {
      //分销商的
      userId = info.distributorloginid;
      if (getApp().globalData.password != oldpass) {
        that.setData({
          msg: '旧密码错误'
        });
        return;
      }
      if (newpass != conpass) {
        that.setData({
          msg: '确认密码错误'
        });
        return;
      }
      wx.request({
        url: 'https://www.jsqckj.cn/btunlockweb/distributors/updatepass',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          loginid: userId,
          oldpass: oldpass,
          newpass: newpass
        },
        success: function (res) {
          if(res.data.data.status==100){
            getApp().globalData.password = newpass;
            wx.showToast({
              title: '修改完成',
              icon: 'success',
              duration: 2000
            });
            wx.hideToast();
          }
          
        }
      })
    }
    
    
    wx.navigateBack({
      
    })
  }
})