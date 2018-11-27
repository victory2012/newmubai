// mqtt相关配置， 详情文档 在下方链接
// http://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
// let env = window.location.host === "www.myriadiot.net";
/* eslint-disable */
import Paho from 'Paho';

// let locationHost = window.location.host;
// let env = locationHost.indexOf('myriadiot');

const mqtt = {
  // hostname: env > 0 ? 'www.myriadiot.net' : '47.96.8.239',
  // port: env > 0 ? 443 : 8083,
  hostname: 'www.myriadiot.net',
  port: 443,
  clientId: `wechat`,
  timeout: 30,
  keepAliveInterval: 100,
  cleanSession: false,
  useSSL: true,
  reconnect: true // 断开后 是否重连
};
export default {
  mqttClient: () => {
    return new Paho.MQTT.Client(
      mqtt.hostname,
      mqtt.port,
      `${mqtt.clientId}${new Date().getTime()}`
    );
  },
  mqttConfig: () => mqtt
};
