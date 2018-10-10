// mqtt相关配置， 详情文档 在下方链接
// http://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
// let env = window.location.host === "www.myriadiot.net";
let locationHost = window.location.host;
let env = locationHost.indexOf('myriadiot');
const mqtt = {
  hostname: env > 0 ? '47.99.120.144' : '47.96.8.239',
  port: 443,
  clientId: `wechat${new Date().getTime()}`,
  timeout: 30,
  keepAliveInterval: 100,
  cleanSession: false,
  useSSL: true,
  reconnect: true // 断开后 是否重连
};
console.log(mqtt);
export default mqtt;
