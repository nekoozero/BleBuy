// pages/welcome/login/managebox/querybox/querybox.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    loading:false,
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
     wx.request({
       url: 'https://www.jsqckj.cn/btunlockweb/containertype/list',
       method:'POST',
       success:function(res){
            that.setData({
              listData:res.data.data.list
            })
       }
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
    let that = this;
    wx.request({
      url: 'https://www.jsqckj.cn/btunlockweb/containertype/list',
      method: 'POST',
      success: function (res) {
        that.setData({
          listData: res.data.data.list
        })
      }
    });
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


  //查看货柜详细信息
  lookdetails:function(event){
    let id=event.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'boxdetail/boxdetail?imgurl='+id,
    })
  },
  //提交后
  submit:function(event){

    let that = this;
    that.setData({
      loading:true,
      disabled:true
    });

    //从缓存中取出分销商的id
    let distributorsId = wx.getStorageSync("distributors").distributorid;

    let formData = event.detail.value;

    //在这里将把表单里的数据转为数字
    for (let x in formData) {
      if (formData[x]== "") {
        formData[x]= 0;
      }
      if (isNaN(Number(formData[x]))){
        wx.showModal({
          title: '提示',
          content: '请填入正确的数字',
          showCancel:false
        }); 
        return;
      }else{
        formData[x]  = parseInt(formData[x]);
      }
    }
    //循环将每种格式的货柜发送给服务端
    for (let x in formData){
      if(formData[x]!=0){
        console.log(x, formData[x], distributorsId)
        wx.request({
          url: 'https://www.jsqckj.cn/btunlockweb/containertype/generate',
          
          data: {
            contypeid: x,
            count:formData[x],
            disid: distributorsId
          },
          //这个老是忘了加，导致报错参数传递不进去
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success:function(res){
            that.setData({
              loading:false,
              disabled:false
            })
            if(res.data.data.status==300){
              wx.showToast({
                title: '申请成功',
                duration: 2000,
                icon: 'success'
              });
              //返回
              wx.navigateBack({

              });
            }
            
          }
        });
      } else if (formData[x] == 0){
          that.setData({
            loading:false,
            disabled:false
          });
          return;

      }
    }
  },
  back:function(){
    wx.navigateBack({
      
    })
  }
})