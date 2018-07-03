Page({
  data: {
    listData: []
  },

  onLoad: function () {
    let that = this;
    let supplyId = wx.getStorageSync("distributors").supplierid;
    wx.request({
      url: 'https://www.jsqckj.cn/btunlockweb/suppliers/checkconbysup',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        supid: supplyId
      },
      success:function(res){
        console.log(res);
        that.setData({
          listData: res.data.data.containersList
        });
      }
    })
  },
  details: function(event){
     let deviceId = event.currentTarget.dataset.deviceId;
     let id = event.currentTarget.dataset.id;
     let disId = event.currentTarget.dataset.distributorId;
     let num = event.currentTarget.dataset.num;
     wx.navigateTo({
       url: 'details/details?deviceId=' + deviceId + "&id=" + id + "&disId=" + disId+"&num="+num
     })
  }

})