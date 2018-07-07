// pages/choose/distributor/box.js
const util = require('util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      
      chosen:[],
      total:0,
      disabled:false,
      loading:false
  },  
  itemTap:function(event){
   // let id = event.currentTarget.dataset.itemId;
    let id = event.currentTarget.dataset.boxId;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        id:options.id    //mac地址
      });
      let that = this;
      let id = that.data.id;
      wx.showLoading({
        title: '正在加载……',
      })
      wx.request({
        url: 'https://www.jsqckj.cn/btunlockweb//congrids/listbyconmac',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          conmac: id
        },
        success: function (res) {
          console.log(res)
          if (res.data.message == "SUCCESS") {
            that.setData({
              grids: res.data.data.grids,
              conid: res.data.data.grids[0].congridbyconid
            });
            
          }
          wx.hideLoading();
        }
      })
     
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
     
     let that = this;
     let id = this.data.id;
     let p = new Promise((resolve,reject)=>{
       wx.closeBLEConnection({
         deviceId: id,
         success: function (res) { },
       });
     })
     
     
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
  onReady: function () {
    
  },
  add:function(e){
    let that = this;
    if (e.currentTarget.dataset.open){
      let x = that.data.chosen.filter(function(s){
        return s != that.data.grids[e.currentTarget.dataset.index];
      });
      if(x.length==that.data.chosen.length){
        x.push(that.data.grids[e.currentTarget.dataset.index])
      }
      let totals = 0
      if(x.length==1){
        totals = x[0].congridprice
      }else if(x.length==0){
        totals=0
      }else{
        totals = x.reduce(function (a, b) {
          if ((typeof a == "object") && (typeof b == "object")) {
            let price = Number(a.congridprice) + Number(b.congridprice);
            return price.toFixed(2);
          } else {
            let price = Number(a) + Number(b.congridprice);
            return price.toFixed(2);
          }
          
          
        });
      }
      
      that.setData({
        chosen:x,
        total:totals
      });
    }
  },
  scanDetail:function(){
      var message = '';
      if(this.data.chosen.length!=0){
        this.data.chosen.forEach(function (element, index, array) {
          message = message + (index + 1) + ". " + element.congridname + "   价格: " + element.congridprice + "元" + "\r\n";
        });
        message = message + "总价： " + this.data.total + " 元";
      }else{
        message="您还没有已选商品╮(╯▽╰)╭，赶紧去抢购吧！"
      }
      
      wx.showModal({
        title: '浏览详情', 
        content: message,
        showCancel:false,
      });
  },
  payforit:function(){
    let that = this;
    that.setData({
      disabled:true,
      loading:true
    });
    //用户openId
    let openid=wx.getStorageSync('openid');
    let total = this.data.total*100;
    //下单请求的需要的参数
    let  obj = {
      body: '趣彩:货柜商品',
      outTradeNo: 'nekoo',
      totalFee: total,
      spbillCreateIp: '118.25.64.97',
      notifyUrl: 'https://www.jsqckj.cn/btunlockweb/pay/parseOrderNotifyResult',
      tradeType: 'JSAPI',
      openid: openid,
      deviceInfo: "货柜"
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    wx.request({
      //下单请求
      url: 'https://www.jsqckj.cn/btunlockweb/pay/unifiedOrder',
      data: JSON.stringify(obj),
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        let packages = "prepay_id=" + res.data.prepayId;
        let nonceStr = res.data.nonceStr;
       
        let paySign;
        //二次签名
        wx.request({
          url: 'https://www.jsqckj.cn/btunlockweb/pay/createSign',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            appId: 'wx4aec5a100fb5633f',
            nonceStr: res.data.nonceStr,
            package: packages,
            signType: 'MD5',
            timeStamp: timestamp + ""
          },
          method: 'POST',
          success: function (res) {
            
            that.setData({
              loading: false,
              disabled: false
            });

            paySign = res.data.data.paySign;

            //启动支付功能 弹出输入密码页面
            wx.requestPayment({
              appId: 'wx4aec5a100fb5633f',
              timeStamp: timestamp + "",
              nonceStr: nonceStr,
              package: packages,
              signType: 'MD5',
              paySign: paySign,
              'success': function (res) {
                //到这里支付流程全部结束
                 that.setData({
                   loading: false,
                   disabled: false
                 });
                 let conmac = that.data.id;
                 let chosen = that.data.chosen;
                 let chosenId = [];
                 let chosenOrder = [];
                 for (let x of chosen) {
                   chosenId.push(x.congridid);
                   chosenOrder.push(x.congridorderby);
                 }


                 wx.request({
                   //获取柜子密码
                   url: 'https://www.jsqckj.cn/btunlockweb/congrids/getpickpass',
                   data: {
                     "gridid[]": chosenId
                   },
                   header: {
                     'content-type': 'application/x-www-form-urlencoded'
                   },
                  method: 'POST',
                  success: function (res) {
                    console.log(res);
                    
                    let a = res.data.data.pickGrids.map(function (obj) {
                      let ar = [];
                      ar.push(1);
                      ar.push(obj.number);
                      let str = obj.pickpass + '0000000000000000';
                      for (let i = 0; i < 32; i = i + 2) {
                        ar.push(str.substr(i, 2));
                      }
                      return ar;
                    }) 

                    that.setData({
                      //payComplete: true,
                      datagram: res.data.data.pickGrids,
                      chosenOrder: chosenOrder,
                      a:a
                    });
                    
                    // 这里直接调用函数就行了  
                    that.opengrids();
                   }
                 })
                 
              },
              'fail': function (res) { 
                console.log(res);
                that.setData({
                  loading: false,
                  disabled: false
                });
               },
              'complete': function (res) { 
                console.log(res);
                that.setData({
                  loading: false,
                  disabled: false
                });
               }
            })
          }
        })
      },

      fail: function (res) {
        console.log('错误原因' + ':' + res);
        that.setData({
          loading: false,
          disabled: false
        });
      }
    })
  },



  opengrids:function(){
    wx.showLoading({
      title: '正在打开……',
    });
    let that = this;
    let mac= that.data.id;
    let openid = wx.getStorageInfoSync("openid");
    let total = this.data.total;
    let conid = this.data.conid;
    let chosenOrder = this.data.chosenOrder;
    let a = that.data.a;    //选中的列表，发送蓝牙用
    console.log(chosenOrder);


    //获取蓝牙服务
    wx.getBLEDeviceServices({
      deviceId: that.data.id,
      success: function (res) {

        //获取特征值
        wx.getBLEDeviceCharacteristics({
          deviceId: that.data.id,
          serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
          success: function (res) {
            wx.showLoading({
              title: '请耐心等待……',
            });
            for (let index = 0; index < a.length; index++) {
              let sendArr = new Uint8Array(a[index].map(function (h) {
                return parseInt(h, 16);
              })).buffer;
              wx.writeBLECharacteristicValue({
                deviceId: mac,
                // serviceId: '0000ffe0-0000-1000-8000-00805f9b34fb',
                //characteristicId: '0000ffe1-0000-1000-8000-00805f9b34fb',  //自己的板子
                serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
                characteristicId: '0000FFF1-0000-1000-8000-00805F9B34FB',  //老师的板子
                value: sendArr,
                success: function (res) {
                  console.log("第" + index + "包发送完成");
                  that.setData({
                    suc: true
                  });
                  if (index == a.length - 1) {
                    wx.request({
                      url: 'https://www.jsqckj.cn/btunlockweb/customers/paysucess',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      method: 'POST',
                      data: {
                        openid: openid,
                        serialnumber: '',
                        cusbuytotal: total,
                        conid: conid,
                        'number[]': chosenOrder,

                      },
                      success: function (res) {
                        wx.hideLoading();
                        let p = new Promise(function (resolve, reject) {
                          wx.showModal({
                            title: '提示',
                            content: '门已打开，请取走货物！',
                            showCancel: false
                          });
                          that.setData({
                            chosen: [],
                            total: 0,
                            payComplete: false,
                            chosenOrder: [],
                            datagram: []
                          });
                          resolve();
                        }).then(function (res) {
                          let id = that.data.id;
                          wx.request({
                            url: 'https://www.jsqckj.cn/btunlockweb//congrids/listbyconmac',
                            header: {
                              'content-type': 'application/x-www-form-urlencoded'
                            },
                            method: 'POST',
                            data: {
                              conmac: id
                            },
                            success: function (res) {
                              if (res.data.message == "SUCCESS") {
                                that.setData({
                                  grids: res.data.data.grids,
                                  conid: res.data.data.grids[0].congridbyconid
                                });

                              }
                            }
                          })
                        })
                      }
                    })
                  }
                },
                fail: function (res) {
                  that.setData({
                    suc: false
                  });
                }
              })
              util.sleep(1100);
            }

          },
          fail: function (err) {
            //获取特征值失败
            console.log(err);
          }
        })
      },
      fail:function(err){
        //获取服务失败
        console.log(err)
      }
    })

    
    wx.hideLoading();
    
  }
})
    

  
 
