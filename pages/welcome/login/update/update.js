Page({
  data: {
    listData: []
  },

  onLoad: function () {
    let that = this;
    let supplyId = wx.getStorageSync("distributors").supplierid;
    console.log(supplyId);
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
        let arr = res.data.data.containersList.map(item=>{
          let a = item.containemac.split(',');
          if (wx.getStorageSync('system').includes("Android")){
            item.containemac =a[0];
          }else{
            item.containemac = a[1];
          }
          return item;
        })
        that.setData({
          listData: arr
        });
      },
      fail:function(err){
        console.log(err);
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