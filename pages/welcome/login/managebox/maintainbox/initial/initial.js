// pages/welcome/login/managebox/maintainbox/initial/initial.js
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
        console.log(res);
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
        


        //发第一个数据包
        wx.writeBLECharacteristicValue({
          deviceId: mac,
          //serviceId: '0000ffe0-0000-1000-8000-00805f9b34fb',
          //characteristicId: '0000ffe1-0000-1000-8000-00805f9b34fb',  //自己的板子
           serviceId: '0000fff0-0000-1000-8000-00805f9b34fb',
           characteristicId: '0000fff1-0000-1000-8000-00805f9b34fb',  //老师的板子
          value: sendsupplyArray,
          success: function (res) {
            console.log('第一个发送成功')
            util.sleep(1000);
            //发第二个数据包
            wx.writeBLECharacteristicValue({
              deviceId: mac,
              //serviceId: '0000ffe0-0000-1000-8000-00805f9b34fb',
              //characteristicId: '0000ffe1-0000-1000-8000-00805f9b34fb',  //自己的板子
               serviceId: '0000fff0-0000-1000-8000-00805f9b34fb',
               characteristicId: '0000fff1-0000-1000-8000-00805f9b34fb',  //老师的板子
              value: sendpickArray,
              success:function(){
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

                  for(let i=2;i<10;i++){
                    let sendsign=[0,i];
                    let singleArr=all[i-2];
                     for (let i = 0, x = 2; i < 32; i = i + 2, x = x + 1) {
                       sendsign.push(singleArr.substr(i, 2));
                     }

                     let signArray = new Uint8Array(sendsign.map(function (h) {
                       return parseInt(h,16);
                     })).buffer;    //八个包 单个包的arrayBuffer
                     console.log();

                    wx.writeBLECharacteristicValue({
                      deviceId: mac,
                      //serviceId: '0000ffe0-0000-1000-8000-00805f9b34fb',
                      //characteristicId: '0000ffe1-0000-1000-8000-00805f9b34fb',  //自己的板子
                       serviceId: '0000fff0-0000-1000-8000-00805f9b34fb',
                       characteristicId: '0000fff1-0000-1000-8000-00805f9b34fb',  //老师的板子
                      value: signArray,
                      success: function (res) {
                        console.log('第'+i+'包完成');



                      },
                      fail:function(res){
                        console.log(res);
                        return;
                      }
                    })
                    util.sleep(1000);

                  }

                  wx.showLoading({
                    title: '正在初始化',
                  });
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
              },fail:function(res){
                console.log(res);
              }
            })
          },
          fail:function (res) {
            console.log(res);
            that.setData({
              msg: res.errMsg
            });
          },
          complete: function (res) {
            that.setData({
              msg: res.errMsg
            });
          }
        })


        // that.setData({
        //   pickpass: pickpass,       //取货加密
        //   supplypass: supplypass,   //补货加密
        //   datasupp: datasupp    //30个格子的补货码
        // });
        
      }
    });
   
  }
})

    //     let gridarr = res.data.data.initial.gridInfos;
    //     let a1 = gridarr.slice(0,9);
    //     let a2 = gridarr.slice(9,18);
    //     let a3 = gridarr.slice(18,27);
    //     let a4 = gridarr.slice(27);
    //     for(let i =0;i<6;i++){
    //       a4.push({ congridpass: '', congridstandbyone:''});
    //     }
    //     let all = [];
    //     all.push(a1);
    //     all.push(a2);
    //     all.push(a3);
    //     all.push(a4);

    //     let startindex = 0;
    //     for (let index = 0; index < 4; index++) {
    //       let type = 0;
    //       let arr = [];
    //       for (let i = 0; i < 9; i++) {
    //         let a = all[index]; 
    //         arr[i * 2 + 2] = a[i].congridstandbyone;  //顾客取货码
    //         arr[i * 2 + 3] = a[i].congridpass;   //补货码
    //       }
    //       arr[0] = 0, arr[1] = startindex;


    //       //这里进行蓝牙传输

    //       startindex = startindex + 9;
    //     }

    //   }
    // })

     // let typedArray = new Int8Array(arr).buffer;

// wx.writeBLECharacteristicValue({
//   deviceId: id,
//   // serviceId: '0000ffe0-0000-1000-8000-00805f9b34fb',
//   // characteristicId: '0000ffe1-0000-1000-8000-00805f9b34fb',
//   serviceId: '0000fff0-0000-1000-8000-00805f9b34fb',
//   characteristicId: '0000fff1-0000-1000-8000-00805f9b34fb',
//   value: typedArray,
//   success: function (res) {
//     that.setData({
//       msg: "发送成功"
//     });
//     console.log("初始化完成");
//   },
//   fail: function (res) {
//     that.setData({
//       msg: res.errMsg
//     });
//   },
//   complete: function (res) {
//     that.setData({
//       msg: res.errMsg
//     });
//   }
// })
