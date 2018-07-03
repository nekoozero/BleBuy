// component/deviceItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemName:{
      type:String,
    },
    itemDeviceId:{
      type:String
    },
    deviceId:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
     connected:false,
     connecting:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeConn:function(e){
      let deviceId = e.currentTarget.dataset.id;
      var that = this;
      wx.closeBLEConnection({
        deviceId: deviceId,
        success: function (res) {
          that.setData({
            connected: false
          });
          wx.showToast({
            title: '断开成功',
            icon: 'success',
            duration: 1200,
          });
        },
        fail: function (res) {
          that.setData({
            msg: "断开失败" + res.errMsg
          });
        }
      });
    },
    createConn:function(e){
      let deviceId = e.currentTarget.dataset.id;
      console.log(deviceId);
      var that = this;
      that.setData({
        connecting:true
      });
      wx.createBLEConnection({
        deviceId: deviceId,
        success: function (res) {
          console.log(deviceId)
        that.stopScan();
          wx.showToast({
            title: '连接成功',
            icon: 'success',
            duration: 1200,
          });
          that.setData({
            connected: true,
            connecting: false
          });
          wx.navigateTo({
            url: '/pages/welcome/box/box?id=' + deviceId,
        
          })

          
        },
        fail: function (res) {
          that.setData({
            connecting:false
          })
        }
      });
    },
    stopScan: function () {
      let that =this;
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          that.setData({
            // discovering: false
          });
        },
      });
    }
  }
})
