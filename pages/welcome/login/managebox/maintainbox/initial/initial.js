// pages/welcome/login/managebox/maintainbox/initial/initial.js
const util = require('util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     loading:false,
     disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let id = options.containerid;
     let mac = options.mac;
     this.setData({
       containerId: id,
       mac:mac
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
    wx.closeBluetoothAdapter({
      success: function(res) {},
    })
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
  initial:function(){
    let that= this;
    wx.openBluetoothAdapter({
      success: function(res) {
        that.setData({
          initMsg:'成功'
        });
      },
      fail:function(res){
        that.setData({
          initMsg: '失败，请确定蓝牙和定位服务已打开'
        });
      }
    })
  },
  connect:function(){
    let that= this;
    let mac = that.data.mac;
    wx.createBLEConnection({
      //deviceId: '54:6C:0E:BD:80:9D',
      deviceId: mac,
      success: function(res) {
         that.setData({
           connMsg:'成功'
         });
      },
      fail:function(res){
        console.log(res);
        that.setData({
          connMsg:'请确定已初始化'
        })
      }
    });
    wx.onBLEConnectionStateChange(function(res){
      
      if(res.connected==true){
        that.setData({
          connMsg: '成功'
        });
      }else if(res.connected==false){
        that.setData({
          connMsg: '请确定已初始化'
        })
      }
    })
  },
  disconnect:function(){
    let that =this;
    let mac = that.data.mac;
    wx.closeBLEConnection({
      //deviceId: '54:6C:0E:BD:80:9D',
      deviceId: mac,
      success: function(res) {
        that.setData({
          disConnMsg: '蓝牙已断开'
        })
      },
    })
  },
  startinitial:function(){
    let that =this;
    wx.showLoading({
      title: '正在初始化,请勿有其他操作',
      mask:true
    });
    that.setData({
      loading:true,
      diabled:true
    });
    let mac = that.data.mac;
    let distributorId = wx.getStorageSync("distributors").distributorid;
    let conId = this.data.containerId; 
   
    wx.request({
      url: 'https://www.jsqckj.cn/btunlockweb/distributors/conInitial',
      data:{
        disid: distributorId,
        conid: conId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success:function(res){
        let data = res.data.data.initial.gridInfos


        let pickpass=res.data.data.initial.pickpass;
        let sendpick = [0,1];   //发送的取货key数组 要改
        for (let i = 0; i < 32; i = i + 2) {
          sendpick.push(pickpass.substr(i, 2));
        }
        let sendpickArray = new Uint8Array(sendpick.map(function (h) {
          return parseInt(h,16);
        })).buffer;     //取货 key Arraybuffer 
        console.log(sendpickArray);

        let supplypass = res.data.data.initial.supplypass;
        let sendsupply = [0,0];   //发送的补货key数组 要改
        for(let i=0;i<32;i=i+2){
          sendsupply.push(supplypass.substr(i,2));
        }
        let sendsupplyArray = new Uint8Array(sendsupply.map(function (h) {
          return parseInt(h,16);
        })).buffer;    //补货key ArrayBuffer
        console.log(sendsupplyArray);
       

        //补货码数组 30个
        let datasupp = data.map(function(x){
          return x.congridpass;
        });
        
//这里是针对IOS的手机  IOS写特征值是要先获取一下设备的服务和服务下的特征值  并且这些里面的字母都要大写  android不需要
        
          //获取此蓝牙设备的服务名
          wx.getBLEDeviceServices({
            deviceId: mac,
            success: function (res) {
              console.log(res);
                
              //获取到服务后获得特征值
              wx.getBLEDeviceCharacteristics({
                deviceId: mac,
                serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
                success: function (res) {
                  console.log(res);
                  //发第一个数据包
                  wx.writeBLECharacteristicValue({
                    deviceId: mac,
                    //serviceId: '0000ffe0-0000-1000-8000-00805f9b34fb',
                    //characteristicId: '0000ffe1-0000-1000-8000-00805f9b34fb',  //自己的板子
                    serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
                    characteristicId: '0000FFF1-0000-1000-8000-00805F9B34FB',  //老师的板子
                    value: sendsupplyArray,
                    success: function (res) {
                      console.log('第一个发送成功')
                      util.sleep(1000);
                      //发第二个数据包
                      wx.writeBLECharacteristicValue({
                        deviceId: mac,
                        //serviceId: '0000ffe0-0000-1000-8000-00805f9b34fb',
                        //characteristicId: '0000ffe1-0000-1000-8000-00805f9b34fb',  //自己的板子
                        serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
                        characteristicId: '0000FFF1-0000-1000-8000-00805F9B34FB',  //老师的板子
                        value: sendpickArray,
                        success: function () {
                          console.log('第二个发送成功');
                          util.sleep(1000);
                          //把剩下的八个包发送出去,每个包四个格子的密码
                          let all = [];
                          all.push(datasupp[0] + datasupp[1] + datasupp[2] + datasupp[3]);
                          all.push(datasupp[4] + datasupp[5] + datasupp[6] + datasupp[7]);
                          all.push(datasupp[8] + datasupp[9] + datasupp[10] + datasupp[11]);
                          all.push(datasupp[12] + datasupp[13] + datasupp[14] + datasupp[15]);
                          all.push(datasupp[16] + datasupp[17] + datasupp[18] + datasupp[19]);
                          all.push(datasupp[20] + datasupp[21] + datasupp[22] + datasupp[23]);
                          all.push(datasupp[24] + datasupp[25] + datasupp[26] + datasupp[27]);
                          all.push(datasupp[28] + datasupp[29] + '00000000' + '00000000');

                          for (let i = 2; i < 10; i++) {
                            let sendsign = [0, i];
                            let singleArr = all[i - 2];
                            for (let i = 0, x = 2; i < 32; i = i + 2, x = x + 1) {
                              sendsign.push(singleArr.substr(i, 2));
                            }

                            let signArray = new Uint8Array(sendsign.map(function (h) {
                              return parseInt(h, 16);
                            })).buffer;    //八个包 单个包的arrayBuffer
                            console.log();

                            wx.writeBLECharacteristicValue({
                              deviceId: mac,
                              //serviceId: '0000ffe0-0000-1000-8000-00805f9b34fb',
                              //characteristicId: '0000ffe1-0000-1000-8000-00805f9b34fb',  //自己的板子
                              serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
                              characteristicId: '0000FFF1-0000-1000-8000-00805F9B34FB',  //老师的板子
                              value: signArray,
                              success: function (res) {
                                console.log('第' + i + '包完成');



                              },
                              fail: function (res) {
                                console.log(res);
                                return;
                              }
                            })
                            util.sleep(1000);

                          }


                          wx.request({
                            url: 'https://www.jsqckj.cn/btunlockweb/containers/updatecontainerstatus',
                            data: {
                              conid: conId
                            },
                            method: "POST",
                            header: {
                              'content-type': 'application/x-www-form-urlencoded'
                            },
                            success: function (res) {
                              wx.hideLoading();
                              if (res.data.code == 200) {
                                wx.showToast({
                                  title: '初始化成功',
                                  icon: 'success',
                                  duration: 2000
                                });
                                wx.navigateTo({
                                  url: '../maintainbox',
                                })
                              }
                            }
                          })
                        }, fail: function (res) {
                          console.log(res);
                          wx.showModal({
                            title: '提示',
                            content: '失败了',
                          });
                          wx.hideLoading();
                          that.setData({
                            loading: false,
                            disabled: false
                          });
                        }, complete: function (ers) {


                        }
                      })
                    },
                    fail: function (res) {
                      wx.showModal({
                        title: '提示',
                        content: '失败了',
                      });
                      wx.hideLoading();
                      console.log(res);
                      that.setData({
                        loading: false,
                        disabled: false,
                        msg: res.errMsg
                      });

                    }
                  })
                }, fail: function (err) {
                  console.log(err);
                }
              });
          
             //写入结束
            },
          });
         
        
      }
    });
   
  }
})




