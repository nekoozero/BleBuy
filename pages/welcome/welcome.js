// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        initialized:false,
        discoverying:false,
        connected:false,
        showOthers:true,
        data:[], 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: function(res) {
        wx.setStorageSync('system', res.system);
      },
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
      
      wx.closeBluetoothAdapter({
        success: function(res) {},
      });
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


  initBle: function () {
    if (this.data.initialized == false) {
      var that = this;
      //先初始化蓝牙适配器
      wx.openBluetoothAdapter({
        success: function (res) {
          wx.showToast({
            title: '成功初始化',
            icon: 'success',
            duration: 1200,

          });
          that.setData({
            initialized: true
          });

          //获取蓝牙适配器的状态（再此之前必须成功初始化蓝牙）
          wx.getBluetoothAdapterState({
            success: function (res) {
              // that.setData({
              //   availabled: res.available
              // });
            },
            fail: function (res) {
              // that.setData({
              //   msg: res.errMsg
              // });
            }
          });

        },
        fail: function (res) {
          that.setData({
            msg: "请确定已打开蓝牙"
          });
        }
      });



      //开启对蓝牙状态的监测事件
      wx.onBluetoothAdapterStateChange(function (res) {
        //如果检测到蓝牙被关闭，将初始化蓝牙信息更新为false
        if(res.available==false){
          that.setData({
            initialized:false,
            msg:"蓝牙已被关闭"
          });
        } else if (res.available == true){
          that.setData({
            msg: "蓝牙已打开"
          });  
        }
       
        that.setData({
          discoverying: res.discovering
        });
      });

    }
  },
  startScan:function(){
    let that = this;
    //把上一次的设备列表清空
    that.setData({
      data:[]
    })
    //开始扫描
    wx.startBluetoothDevicesDiscovery({
     // services: ['00001800-0000-1000-8000-00805f9b34fb','00001801-0000-1000-8000-00805f9634fb','0000180a-0000-1000-8000-00805f9b34fb','0000fff0-0000-1000-8000-00805f9b34fb'],
      services:[],
      allowDuplicatesKey: true,
      interval: 0,
      success: function (res) {


        //开启监听寻找到新设备的事件
        wx.onBluetoothDeviceFound(function (devices) {
          let list = that.data.data.concat(devices);
          that.setData({
            data: list
          });
          //获取在小程序蓝牙模块生效期间所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备。
          wx.getBluetoothDevices({
            success: function (res) {
              that.setData({
                data: res.devices
              })
            },
          });
        });
      },
      complete: function (res) {
        
      }
    });
  }
  ,
  stopScan: function () {
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        
      },
    });
  },

  other:function(){
    this.setData({
       showOthers:!this.data.showOthers
    });
  },
  changeRole:function(e){
    let role = e.currentTarget.dataset.role;
    this.setData({
      showOthers: !this.data.showOthers
    });
    wx.navigateTo({
      url: '/pages/welcome/login/login?role='+role,
    });
    
  },
  moretips:function(){
    console.log("sss");
    wx.showModal({
      title: '温馨提示',
      content: `1.连续多次连接、断开蓝牙可能会导致下次连接变慢，请耐心等待。

2.如果真的很长时间连接没反应，请关闭蓝牙或退出小程序，重新打开蓝牙进入小程序使用。

3.选择商品时，请务必不要关闭蓝牙。

4.退出小程序不使用蓝牙时，记得关闭自己的蓝牙设备。
      `,
      showCancel:false
    })
  }
})