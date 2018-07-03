// pages/welcome/login/managebox/requirebox/requirebox.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
      let that = this;
      wx.showLoading({
        title: '正在加载……',
        mask: true
      });
      let distributorsId = wx.getStorageSync("distributors").distributorid;
      wx.request({
        url: 'https://www.jsqckj.cn/btunlockweb/containers/checkconbydisid',
        header:{
          'content-type':'application/x-www-form-urlencoded'
        },
        method:'POST',
        data:{
          disid: distributorsId,
          conname:'' 
        },
        success:function(res){
          wx.hideLoading();
          that.setData({
            listData:res.data.data.list
          })
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
  lookdetails:function(event){
    let id = event.currentTarget.dataset.id;
    let boxType = event.currentTarget.dataset.btype;
    let status = event.currentTarget.dataset.status;
    let mac = event.currentTarget.dataset.mac;
    let containernum = event.currentTarget.dataset.containernum;
    let contypeid= event.currentTarget.dataset.contypeid;
    if(status==0){
      wx.navigateTo({
        url: 'initial/initial?containerid='+id+'&mac='+mac
      })
    }else if(status==1){
      wx.navigateTo({
        url: "single/single?id="+ id +"&containernum="+containernum,
      })
    }
   
  }
})