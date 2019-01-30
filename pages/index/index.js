var mDevicesClouds = require('../../utils/devicesClouds.js');

Page({
  funListenConnectEvent: function(parm1) {
    //隐藏窗口
    wx.hideLoading()
    console.log("是否成功连接服务器: " + parm1)
    if (parm1) {
      wx.showToast({
        title: '恭喜，连接成功。',
        icon: 'none',
        duration: 1000
      })
      //开始订阅设备主题，小伙伴自行设计逻辑，比如拿到用户绑定的设备列表，一个一个去订阅
      mDevicesClouds.notifySubDeviceTopicEvent("deviceTopic");
 
    }else{
      wx.showToast({
        title: '抱歉，连接异常。',
        icon: 'none',
        duration: 3000
      })
    }
  },
  onLoad: function() {


    wx.showLoading({
      title: '加载中...',
    })

    //这个是监听服务器的连接回调
    mDevicesClouds.listenConnectEvent(true, this.funListenConnectEvent)
  },
  onClickItem1: function() {
    wx.navigateTo({
      url: "../deviceLight/deviceLight?uuid=a123456"
    })
  },
  onClickItem2: function() {
    wx.navigateTo({
      url: "../deviceSocket/deviceSocket?uuid=b123456"
    })
  },
  onUnload: function() {
    console.log("onUnload")
    //这个是取消监听服务器的连接回调
    //mDevicesClouds.listenConnectEvent(false, this.funListenConnectEvent)
  },
})