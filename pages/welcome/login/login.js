Page({
  data: {
    phone: '',
    password: '',
    error:''
  },

  onLoad:function(options){
    this.setData({
      role:options.role
    });
  
  },

  // 获取输入账号  
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码  
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录  
  // loginUpdate: function () {
  //   if (this.data.phone.length == 0 || this.data.password.length == 0) {
  //      this.setData({
  //        error:"账号或密码不得为空！"
  //      });
  //   } else {
  //     // 这里修改成跳转的页面  
  //     wx.switchTab({
  //       url: 'update/update',
  //     })
  //   }
  // },
  loginManage:function(){
    wx.showLoading({
      title: '正在登陆……',
      mask:true
    })
    let that = this;
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      this.setData({
        error: "账号或密码不得为空！"
      });
      wx.hideLoading();
    } else {
      wx.request({
        url: 'https://www.jsqckj.cn/btunlockweb/distributors/login',
        data:{
          loginid: that.data.phone,
          password:that.data.password
        },
        method:'POST',
        header:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:function(res){
           if(res.data.data.status==100){
             that.setData({
               error:''
             });
             wx.showToast({
               title: '登陆成功',
               duration:2000,
               icon:'success'
             });
             //同步放入缓存中 
             wx.setStorageSync("distributors", res.data.data.distributors);
             //将密码放入到全局变量中 以便之后修改密码用
             getApp().globalData.password = that.data.password;
             wx.redirectTo({
              url: 'managebox/managebox',
             })
           }else if(res.data.data.status==101){
             that.setData({
               error:'账号不存在，请重新输入！'
             });
           }else if(res.data.data.status==102){
             that.setData({
                error:'密码输入错误，请重新输入！'
             })
           }
        },
        complete:function(res){
          wx.hideLoading();
        }
      });
   
    }
  },
  register:function(){
    wx.navigateTo({
      url: 'register/register',
    })
  },

  // 补货员登录
  loginUpdate:function(){
    wx.showLoading({
      title: '正在登陆……',
      mask: true
    })
    let that = this;
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      this.setData({
        error: "账号或密码不得为空！"
      });
    } else {
      wx.request({
        url: 'https://www.jsqckj.cn/btunlockweb/suppliers/login',
        method:'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{
          loginid: that.data.phone,
          password: that.data.password
        },
        success:function(res){
          console.log(res);
          if (res.data.data.status == 100) {
            that.setData({
              error: ''
            });
            wx.showToast({
              title: '登陆成功',
              duration: 2000,
              icon: 'success'
            });
          //同步放入缓存中 
            wx.setStorageSync("distributors", res.data.data.distributors);
          //将密码放入到全局变量中 以便之后修改密码用
            getApp().globalData.spassword = that.data.password;
            wx.switchTab({
              url: 'update/update',
            })
          }else if(res.data.data.status==101) {
            that.setData({
              error: '账号不存在，请重新输入！'
            });
          }else if(res.data.data.status==102) {
            that.setData({
              error: '密码输入错误，请重新输入！'
            })
          }
          wx.hideLoading();
        }
      })

    }
  }
})  