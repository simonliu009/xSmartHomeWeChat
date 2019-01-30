
/**
  Copyright (c) 2019
  License: xuhongv
  https://github.com/xuhongv
**/

var mOnFire = require("onfire.js");

var FLAG_EVENT = 'FLAG_EVENT';
var EVENT_CONNECT_SUCCESS = 'EVENT_CONNECT_SUCCESS';
var EVENT_CONNECT_FAIL = 'EVENT_CONNECT_FAIL';
var EVENT_CONNECT_LOST = 'EVENT_CONNECT_LOST';
var EVENT_MQTT_DEVICE_PUB = 'EVENT_MQTT_DEVICE_PUB';
var EVENT_MQTT_DEVICE_SUB = 'EVENT_MQTT_DEVICE_SUB';
var EVENT_MQTT_DEVICE_SUB_TOPIC = 'EVENT_MQTT_DEVICE_SUB_TOPIC';


/*******      实现方法    *******/
//连接服务器回调
function notifyConnectEvent(isConnected) {
  if (isConnected)
    mOnFire.fire(EVENT_CONNECT_SUCCESS, true);
  else
    mOnFire.fire(EVENT_CONNECT_FAIL, false);
}

//设备状态消息推送回调 topic是主题 ，status是mqtt的payload部分
function notifyDeviceStatusEvent(topic, status) {
  mOnFire.fire(EVENT_MQTT_DEVICE_PUB, topic, status);
}

//推送控制设备消息 device作为一个对象 
function notifyWriteDeviceEvent(device, payload, qos = 0, retained = false) {
  mOnFire.fire(EVENT_MQTT_DEVICE_SUB, device, payload, qos, retained);
}


//通知本地要接收此设备状态 device作为一个对象
function notifySubDeviceTopicEvent(device) {
  mOnFire.fire(EVENT_MQTT_DEVICE_SUB_TOPIC, device);
}


/*******      使用方法    *******/
//监听连接服务器的监听回调
function listenConnectEvent(isSetListener, funtion) {
  //方法重载，根据参数个数判断是否设置监听或取消监听
  if (isSetListener) {
    mOnFire.on(EVENT_CONNECT_SUCCESS, funtion)
    mOnFire.on(EVENT_CONNECT_FAIL, funtion)
  } else {
    //传入方法，取消监听回调
    mOnFire.un(funtion)
    mOnFire.un(funtion)
  }
}

//监听设备主动推送的监听回调
function listenDeviceStatusEvent(isSetListener, funtion) {
  //方法重载，根据参数个数判断是否设置监听或取消监听
  if (isSetListener) {
    mOnFire.on(EVENT_MQTT_DEVICE_PUB, funtion)
  } else {
    //传入方法，取消监听回调
    mOnFire.un(funtion)
  }
}

//推送控制设备状态消息 device作为一个对象
function listenWriteDeviceEvent(isSetListener, funtion) {
  //方法重载，根据参数个数判断是否设置监听或取消监听
  if (isSetListener) {
    mOnFire.on(EVENT_MQTT_DEVICE_SUB, funtion)
  } else {
    //传入方法，取消监听回调
    mOnFire.un(funtion)
  }
}


//设置本地要订阅此设备状态消息 device作为一个对象
function listenSubDeviceTopicEvent(isSetListener, funtion) {
  //方法重载，根据参数个数判断是否设置监听或取消监听
  if (isSetListener) {
    mOnFire.on(EVENT_MQTT_DEVICE_SUB_TOPIC, funtion)
  } else {
    //传入方法，取消监听回调
    mOnFire.un(funtion)
  }
}


module.exports = {
  //本地连接mqtt服务器回调
  notifyConnectEvent: notifyConnectEvent,
  listenConnectEvent: listenConnectEvent,

  //设备状态发生改变回调
  notifyDeviceStatusEvent: notifyDeviceStatusEvent,
  listenDeviceStatusEvent: listenDeviceStatusEvent,

  //控制设备
  notifyWriteDeviceEvent: notifyWriteDeviceEvent,
  listenWriteDeviceEvent: listenWriteDeviceEvent,

  //设置本地订阅此设备发出的广播
  notifySubDeviceTopicEvent: notifySubDeviceTopicEvent,
  listenSubDeviceTopicEvent: listenSubDeviceTopicEvent,

}