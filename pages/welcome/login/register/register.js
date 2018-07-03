// pages/welcome/login/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
       btnval:'获取验证码'
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
  getphone:function(event){
    this.setData({
      iphone:event.detail.value
    });
  }
  ,
  register:function(event){
    let obj = event.detail.value;
    for(let x in obj){
      if(obj[x].trim()==''){
        this.setData({
          msg:'所有选项均不能为空！'
        });
        return;
      }
    }
    if(obj.password!=obj.repassword){
      this.setData({
        msg:'确认密码错误！'
      });
      return;
    }
    if (isNaN(Number(obj.telphone)) || obj.telphone.length!=11){
       this.setData({
         msg:'手机格式不正确！'
       });
       return ;
    }
    if (obj.verifycode != this.data.verifycode){
      this.setData({
        msg: '验证码错误！'
      });
      return;
    }
    let that = this;
    wx.request({
      url: 'https://www.jsqckj.cn/btunlockweb/distributors/register',
      data: 
        {
          loginid: obj.loginid,
          password: obj.password,
          telphone: obj.telphone
        },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method:'POST',

      //成功返回数据
      success:function(res){
        if (res.data.data.status == 100){
          wx.showToast({ 
            title: '注册成功',
            icon:'success',
            duration:2000
          });
          wx.redirectTo({
            url: '../login?role=1',
          });
        }else if(res.data.data.status==101){
          that.setData({
            msg: '此账号已有人注册，请重新填写！'
          }); 
          return;
        }else if(res.data.data.status==102){
          that.setData({
            msg: '服务器烦忙，请稍后再试！'
          });
          return;
        }else if(res.data.data.status==103){
          that.setData({
            msg: '此手机已被注册，请重新输入！'
          });
        }
      } 
    })
    that.setData({
      msg:''
    });
  },
  sendMsg:function(event){

    if (isNaN(Number(this.data.iphone)) || this.data.iphone.length != 11) {
      this.setData({
        msg: '手机格式不正确'
      });
      return;
    }
     let that = this;
     that.setData({
       btnval:'重新发送验证码',
       msg:''
     });
     wx.showLoading({
       title: '获取中……',
     })
     wx.request({
       
       url: 'https://www.jsqckj.cn/btunlockweb/distributors/smsSend',
       header:{
         'content-type': 'application/x-www-form-urlencoded'
       },
       method:'POST',
       data:{
         phone: that.data.iphone
       },
       success:function(res){
         wx.hideLoading();
         if (res.data.data.status!="0"){

           that.setData({
             msg: '获取验证码失败，请重新获取！'
           });
         }else{
           that.setData({
             verifycode: res.data.data.verifycode
           })
         }
         
       }
     })
  }
})