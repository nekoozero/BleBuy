// pages/welcome/login/update/details/details.js
const util = require('util');
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    id:"",
    deviceId:"",
    connected:false,
    pickGrids:[],
    disabled:false,
    loading:false,
    dis:false,
    loa:false,
    submmited:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // console.log(options)  
    that.setData({
      id:options.id,
      // deviceId:options.deviceId,
      disId: options.disId,
      num:options.num
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
      let that =this;
      //如果deviceId不为空  则还没有连接过 一旦连接过 deviceId都不会为空
      if(that.data.deviceId!=null){
        wx.closeBLEConnection({
          deviceId: that.data.deviceId,
          success: function (res) { 
          //  console.log("断开蓝牙了！");
          },
        })
      }
      
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
  //扫码连接  兼容ios
  startconn:function(){
      let that = this; 
      wx.scanCode({
        success:function(res){

               
          

          let arr = res.result.split('&&');
          let deviceId = '';
          //根据使用机型选择使用mac还是uuid
          if (wx.getStorageSync('system').includes("Android")) {
            deviceId = arr[0];
            that.setData({
              deviceId: deviceId
            });
            that.connectBle();
           
          } else {

            //扫码连接  ios
            let boxid = arr[0];
            //这边改为0
            deviceId = arr[1];

            //搜索设备前 需要打开蓝牙适配器 
            let pro = new Promise((resolve,reject)=>{
              wx.openBluetoothAdapter({
                success: function(res) {
                  resolve();
                },
              });
 
            });
            pro.then((res)=>{
              wx.startBluetoothDevicesDiscovery({
                allowDuplicatesKey: false,
                success: function (res) {
                  wx.onBluetoothDeviceFound(function (res) {
                    //检测搜索到的设备
                    //console.log(res);
                    //console.log(deviceId, res.devices[0].localName)
                    //ios将uuid传入下一个页面
                    let connId = res.devices[0].deviceId;

                    //deviceId(mac地址)  localname会被修改成mac地址
                    if (deviceId == res.devices[0].localName) {
                      that.setData({
                        deviceId: connId
                      });

                      that.connectBle();
                      
                    }
                    //检测搜索到的设备 完毕
                  })
                },
                fail: function (err) {
                  //console.log(err);
                }
              })
            })
            

            
          }



               
        }
      })
  }
  ,
  connectBle:function(event){
    wx.showLoading({
      title: '正在连接蓝牙……',
      mask:true
    })
    let that = this;
    let deviceId = that.data.deviceId;
    wx.openBluetoothAdapter({
      success: function(res) {
        

      },
      fail:function(res){
        wx.hideLoading();
         that.setData({
             msg:"请确定已打开蓝牙"
         });

      },
      complete:function(){
        wx.createBLEConnection({
          deviceId: deviceId,
          success: function (res) {
            that.setData({
              connected: true,
              msg: '连接成功'
            });
            //连接成功后  就会停止扫描 android此方法会失败
            wx.stopBluetoothDevicesDiscovery({
              success: function(res) {},
              fail:function(err){

              }
            })
          },
          complete: function () {
            wx.hideLoading();
          },
          fail: function (res) {
            //console.log(res);
            that.setData({
              msg: '连接失败'
            });
          }
        })
      }
    });
    
  },
  disConnectBle:function(event){
    wx.showLoading({
      title: '正在断开……',
    })
    let that = this;
    let deviceId = event.currentTarget.dataset.deviceId;
    wx.closeBLEConnection({
      deviceId: deviceId,
      success: function(res) {
         that.setData({
           msg:'蓝牙已断开',
           connected:false
         });
         wx.closeBluetoothAdapter();
      },
      fail:function(err){
        // console.log(err);
      },
      complete:function(){
        wx.hideLoading();
      }
    })
  },
  //更新货柜信息
  buhuo:function(){
    
    let that = this;

    //将按钮禁用
    that.setData({
      disabled:true,
      loading:true
    });
    if (!that.data.connected){
      wx.showModal({
        title: '提示',
        content: '请先连接蓝牙！',
        showCancel:false
      })
      that.setData({
        disabled: false,
        loading: false
      });
      return ;
    }

    wx.showLoading({
      title: '正在获取数据……',
      mask:true
    })
   
    let supId = wx.getStorageSync("distributors").supplierid;
    wx.request({
      url: 'https://www.jsqckj.cn/btunlockweb/congrids/opengrids',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        conid:that.data.id,
        supid: supId
      },
      success:function(res){
       // console.log("下面要补货的东西：");
       // console.log(res);
        wx.hideLoading();
        wx.showLoading({
          title: '正在操作……',
          
        });
        if (res.data.data.pickGrids.length==0){
          that.setData({
            disabled: false,
            loading: false
          });
          wx.hideLoading();
          that.setData({
            msgg: '暂无货物更新！'
          });
          return;
        }
        //保存数据  上传服务器需要
        that.setData({
          pickGrids: res.data.data.pickGrids
        })
        //处理数据
        let a = res.data.data.pickGrids.map(function (obj) {
          let ar = [];
          ar.push(1);
          ar.push(obj.number.toString(16));    //格子号改成16进制
          let str = obj.reppass + obj.reppassnew+obj.pickpassnew;
          for (let i = 0; i < 32; i = i + 2) {
            ar.push(str.substr(i, 2));
          }
          return ar;
        });
        
        //ios下需要先获取服务和特征值
        //获取服务
        wx.getBLEDeviceServices({
          deviceId: that.data.deviceId,
          success: function(res) {
            //获取特征值
            wx.getBLEDeviceCharacteristics({
              deviceId: that.data.deviceId,
              serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
              success: function(res) {
                //获取服务和特征值后 开始传输数据

                for (let index = 0; index < a.length; index++) {
                  let data = a[index];
                  let sendData = new Uint8Array(data.map(function (h) {
                    return parseInt(h, 16);
                  })).buffer;
                  wx.writeBLECharacteristicValue({
                    deviceId: that.data.deviceId,
                    //serviceId: '0000ffe0-0000-1000-8000-00805f9b34fb',
                    //characteristicId: '0000ffe1-0000-1000-8000-00805f9b34fb',  //自己的板子
                    serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
                    characteristicId: '0000FFF1-0000-1000-8000-00805F9B34FB',  //老师的板子
                    value: sendData,
                    success: function (res) {
                    //  console.log("第" + index + "个格子完成");
                      that.setData({
                        suc: true
                      });
                    //  console.log(a.length - 1);
                      //如果是最后一个格子完成后 则给提示 并将按钮复位
                      if (index == a.length - 1) {
                        // wx.showModal({
                        //   title: '提示',
                        //   content: '密码已更换完成，请将数据提交到服务器！',
                        //   showCancel:false
                        // });

                        that.setData({
                          disabled: false,
                          loading: false,
                          submmited: false
                        });
                      }

                    }, fail: function (res) {
                      that.setData({
                        suc: false
                      });

                      //失败了 将按钮复位
                      that.setData({
                        disabled: false,
                        loading: false
                      });
                    //  console.log(res);
                    }
                  });
                  util.sleep(1200);
                }



                 //这里传输数据结束
              },
            })
          },
        })
        


        
        wx.hideLoading();
      }
    })
  },

  //提交到服务器
  submit:function(){
    let that = this;
    if (that.data.submmited==true){
      wx.showModal({
        title: '警告',
        content: '不要重复提交！',
        showCancel:false
      });
      return;
    }
    that.setData({
      dis:true,
      loa:true
    });
    let supId = wx.getStorageSync("distributors").supplierid;
    if (that.data.pickGrids.length==0){
      that.setData({
        msgg:'暂无货物更新！'
      });
      that.setData({
        dis:false,
        loa:false
      });
      return;
    }else{
    //  console.log(that.data.pickGrids)
      wx.request({
        url: 'https://www.jsqckj.cn/btunlockweb/suppliers/addrecords',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          conid: that.data.id,
          supid: supId,
          pickgrid: JSON.stringify(that.data.pickGrids)
        },
        success: function (res) {
        //  console.log(res);
          let p  = new Promise((resolve,reject)=>{
            wx.showModal({
              title: '提示',
              content: '货物更新已全部完成！',
              showCancel: false
            });
            that.setData({
              dis: false,
              loa: false,
              submmited: true
            });
            resolve();
          });

          p.then(()=>{
            that.onUnload();
            wx.navigateBack({

            });
          });
         

        },fail:function(err){
           wx.showModal({
             title: '提示',
             content: '失败了',
             showCancel:false
           });
           that.setData({
             dis: false,
             loa: false,
             
           });
        }
      })
    }
    
  },
  backto:function(){
    wx.redirectTo({
      url: '../update.wxml',
    })
  }
})