
//初始化数据
function tabbarinit() {
 return [
      { "current":0,
        "pagePath": "/pages/welcome/login/managebox/managebox",
        "iconPath": "/img/off.png",
        "selectedIconPath": "/img/on.png",
        "text": "货柜管理"
        
      },
      {
        "current": 0,
        "pagePath": "/pages/welcome/login/managewo/managewo",
        "iconPath": "/img/onstaff.png",
        "selectedIconPath": "/img/offstaff.png",
        "text": "配货员管理"

      },
      {
        "current": 0,
        "pagePath": "/pages/welcome/login/manageme/manageme",
        "iconPath": "/img/aboutf.png",
        "selectedIconPath": "/img/aboutt.png",
        "text": "个人中心"
        
      }
    ]

}

/**
 * tabbar主入口
 * @param  {String} bindName 
 * @param  {[type]} id       [表示第几个tabbar，以0开始]
 * @param  {[type]} target   [当前对象]
 */
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}


module.exports = {
  tabbar: tabbarmain
}