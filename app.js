//app.js

var mDeviceClouds = require('/utils/devicesClouds.js');
var util = require('/utils/mqtt/util.js')
var {
  Client,
  Message
} = require('/utils/mqtt/paho-mqtt.js')

App({
  data: {
    logged: false,
    takeSession: false,
    requestResult: '',
    client: null
  },
  setOnMessageArrived: function(onMessageArrived) {
    if (typeof onMessageArrived === 'function') {
      this.data.onMessageArrived = onMessageArrived
    }
  },
  setOnConnectionLost: function(onConnectionLost) {
    if (typeof onConnectionLost === 'function') {
      this.data.onConnectionLost = onConnectionLost
    }
  },
  doConnect: function() {
    var that = this;
    if (that.data.client && that.data.client.isConnected()) {
      console.log('不要重复连接');
      return
    }
    var client = new Client(this.globalData.server_domain, this.globalData.clientId());
    client.connect({
      userName: this.globalData.userName,
      password: this.globalData.password,
      useSSL: true,
      reconnect: true, //设置断线重连，默认是断线不重连
      cleanSession: true,
      keepAliveInterval: this.globalData.keepAliveInterval,
      onFailure: function(errorCode) {
        mDeviceClouds.notifyConnectEvent(false)
        //console.log("connect failed code:" + errorCode.errorCode)
        //console.log("connect failed message:" + errorCode.errorMessage)
      },
      onSuccess: function() {
        that.data.client = client
        client.onMessageArrived = function(msg) {
          if (typeof that.data.onMessageArrived === 'function') {
            return that.data.onMessageArrived(msg)
          }
          // console.log("onMessageArrived topic:" + msg.destinationName)
          // console.log("onMessageArrived payload:" + msg.payloadString)
          mDeviceClouds.notifyDeviceStatusEvent(msg.destinationName, msg.payloadString)
        }
        client.onConnectionLost = function(responseObject) {
          if (typeof that.data.onConnectionLost === 'function') {
            return that.data.onConnectionLost(responseObject)
          }
          if (responseObject.errorCode !== 0) {
            //console.log("onConnectionLost:" + responseObject.errorMessage);
          }
        }
        //console.log("connect success..")
        //连接成功mqtt服务器回调
        mDeviceClouds.notifyConnectEvent(true)
      }
    });
  },
  onLaunch: function() {

    //延迟链接，以防后面的收不到链接成功回调
    var that = this
    setTimeout(function() {
      that.doConnect();
    }, 800)

    // 订阅某个设备推送状态函数：参数 device对象
    mDeviceClouds.listenSubDeviceTopicEvent(true, function(device) {
      var client = that.data.client;
      if (client && client.isConnected()) {
        //console.log('订阅成功');
        return client.subscribe(device, {
          qos: 1
        });
      }
      //console.log('订阅失败');
    })
    // 发送消息给设备
    mDeviceClouds.listenWriteDeviceEvent(true, function(device, message, qos = 1, retained = false) {
      var client = that.data.client;
      if (client && client.isConnected()) {
        var message = new Message(message);
        message.destinationName = device;
        message.qos = qos;
        message.retained = retained;
        console.log('发送ok');
        return client.send(message);
      }
    })
  },
  globalData: {
    //连接的域名：注意格式，不要带端口号
    server_domain: "wss://7qfp623.mqtt.iot.gz.baidubce.com/mqtt",
    //心跳
    keepAliveInterval: 60,
    //本工程的链接mqtt服务器的名字和密码
    userName: "7qfp623/wechatclient",
    password: "YS92fo65tMWPeJSx",
    //请保持唯一，一旦多个客户端用相同的clientID连接服务器就会挤掉之前的链接，后者先得。
    clientId: function() {
      // var len = 16; //长度
      // var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      // var maxPos = $chars.length;
      // var pwd = 'WC_';
      // for (let i = 0; i < len; i++) {
      //   pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      // }
      // return pwd;
      return "DeviceId-3qi2sszsg8";

    }, //因为百度云限制clientId，如果你的服务器不限制，根据需求你用随机数也可以的。参考上面的随机数获取方法即可！
  }
})