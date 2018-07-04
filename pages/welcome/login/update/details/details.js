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
      deviceId:options.deviceId,
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
      let deviceId = that.data.deviceId;
      wx.closeBLEConnection({
        deviceId: deviceId,
        success: function(res) {},
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
  connectBle:function(event){
    wx.showLoading({
      title: '正在连接蓝牙……',
      mask:true
    })
    let that = this;
    let deviceId = that.data.deviceId;
    wx.openBluetoothAdapter({
      success: function(res) {
        wx.createBLEConnection({
          deviceId: deviceId,
          success: function (res) {
            that.setData({
              connected: true,
              msg:'连接成功'
            });
          },
          complete:function(){
            wx.hideLoading();
          },
          fail:function(res){
            console.log(res);
            that.setData({
              msg: '连接失败'
            });
          }
        })

      },
      fail:function(res){
        wx.hideLoading();
         that.setData({
             msg:"请确定已打开蓝牙"
         });
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
        console.log("下面要补货的东西：");
        console.log(res);
        wx.hideLoading();
        wx.showLoading({
          title: '正在操作……',
          
        });
        //保存数据  上传服务器需要
        that.setData({
          pickGrids: res.data.data.pickGrids
        })
        //处理数据
        let a = res.data.data.pickGrids.map(function (obj) {
          let ar = [];
          ar.push(1);
          ar.push(obj.number);
          let str = obj.reppass + obj.reppassnew+obj.pickpassnew;
          for (let i = 0; i < 32; i = i + 2) {
            ar.push(str.substr(i, 2));
          }
          return ar;
        })
        for(let index=0;index<a.length;index++){
          let data = a[index];
          let sendData = new Uint8Array(data.map(function (h) {
            return parseInt(h, 16);
          })).buffer;  
          wx.writeBLECharacteristicValue({
             deviceId: that.data.deviceId,
             //serviceId: '0000ffe0-0000-1000-8000-00805f9b34fb',
             //characteristicId: '0000ffe1-0000-1000-8000-00805f9b34fb',  //自己的板子
             serviceId: '0000fff0-0000-1000-8000-00805f9b34fb',
             characteristicId: '0000fff1-0000-1000-8000-00805f9b34fb',  //老师的板子
             value: sendData,
             success: function (res) {
              console.log("第"+index+"个格子完成");
              that.setData({
                suc:true
              });
              console.log(a.length-1);
              //如果是最后一个格子完成后 则给提示 并将按钮复位
              if(index==a.length-1){
                // wx.showModal({
                //   title: '提示',
                //   content: '密码已更换完成，请将数据提交到服务器！',
                //   showCancel:false
                // });

                that.setData({
                  disabled: false,
                  loading: false
                });
             }
             
            },fail:function(res){
              that.setData({
                suc: false
              });

              //失败了 将按钮复位
              that.setData({
                disabled: false,
                loading: false
              });
              console.log(res);
            }
          });
          util.sleep(1100);
        }
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
        msgg:'请先更新货柜信息！'
      });
      that.setData({
        dis:false,
        loa:false
      });
      return;
    }else{
      console.log(that.data.pickGrids)
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
          console.log(res)
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
    
  }
})