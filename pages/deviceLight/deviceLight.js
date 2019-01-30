// pages/deviceSocket/deviceSocket.js


var mDeviceClouds = require('../../utils/devicesClouds.js');


Page({

  callBackDeviceStatus: function (options) {
    console.log("拿到服务器传过来的设备信息：" + options);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("拿到上个界面传来的设备信息：" + options.uuid);
    this.setData({
      uuid: options.uuid
    })

    //设置监听函数
    mDeviceClouds.listenDeviceStatusEvent(true, this.callBackDeviceStatus);

    //控制设备，此函数任意地方调用!
    //因为我的百度云身份策略是指定的主题订阅和发送，如果不一样，服务器会主动断开连接。大家注意下！！！
    mDeviceClouds.notifyWriteDeviceEvent("/light/deviceOut", "hello world , i am from wechat");
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //取消监听函数，释放内存
    mDeviceClouds.listenDeviceStatusEvent(false, this.callBackDeviceStatus);

  }
})