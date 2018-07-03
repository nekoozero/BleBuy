// pages/welcome/login/managebox/maintainbox/single/updatesingle/updatesingle.js
const util = require('util');
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
    wx.showLoading({
      title: '正在加载……',
      mask:true
    })


    let that = this;
    let id = options.id;
    this.setData({
      id:id
    });
    let suppliesName=[];

    let containernum = options.containernum;
    this.setData({
      containernum: containernum
    });
    wx.request({
      url: 'https://www.jsqckj.cn/btunlockweb/distributors/editcontainer',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        conid: id
      },
      success: function (res) {
        console.log(res);
        let nowSupplier;
        if (res.data.message == "SUCCESS"){
          if (res.data.data.Conbysupplier.length!=0){
            for (let x of res.data.data.Suppliers) {
              if (x.supplierid == res.data.data.Conbysupplier[0].supplierid) {
                nowSupplier = x.suppliername;
                break;
              }
            }
          }else{
            res.data.data.Conbysupplier[0] = { supplierid:'0'};
            nowSupplier='暂无';
        }
          res.data.data.Suppliers.map(x => suppliesName.push(x.suppliername));
        
          that.setData({
            grids: res.data.data.Congrids,   //设置小格子
            container: res.data.data.Containers,  //设置柜子
            allSupplies:res.data.data.Suppliers,  //获取所有补货员
            suppliername: suppliesName,       //获取所有补货员的名字
            nowSupplier: nowSupplier,    //获取当前补货员的名字
            supplierId: res.data.data.Conbysupplier[0].supplierid  //发到数据库里的补货员Id
          });
          wx.hideLoading();
        }
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
  //更新信息
  updateit:function(event){
    let that = this;
    let bigbox={
      arr:[]
    };
    let length = this.data.grids.length; 
    for(let i=0;i<length;i++){
       let n = 'name'+i;
       let p = 'price'+i;
       let num = that.data.grids[i].congridorderby;
       let name = event.detail.value[n];
       let price  = event.detail.value[p];
       let good = new util.Goods(name,price,num);
       bigbox.arr.push(good);
    }
    let supplyId = [];
    supplyId.push(that.data.supplierId);
    console.log(supplyId)
    wx.showLoading({
      title: '正在修改……',
    }) 
    wx.request({
     
      url: 'https://www.jsqckj.cn/btunlockweb/congrids/updateContainer',
      method:'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      }, 
      data:{
        conid:that.data.id,
        conname: event.detail.value.conname,
        conaddress: event.detail.value.place,
        goos: JSON.stringify(bigbox.arr),
        "supplyid[]": supplyId
      },
      success:function(res){
        console.log(res);
        wx.navigateTo({
          url: '../single?containernum=' + that.data.containernum+"&id="+that.data.id,
        })
          
      },
      complete:function(res){
        wx.hideLoading();
      }
    });
    
  },
  //切换补货员
  choose:function(event){
    let that = this; 
    let supplies = that.data.allSupplies[event.detail.value]
    this.setData({
      nowSupplier: supplies.suppliername,
      supplierId: supplies.supplierid
    })
  }
})