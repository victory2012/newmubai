const mqtt = {
  // hostname: '47.96.8.239',
  hostname: "47.99.120.144",
  port: 8083,
  clientId: `wechat${new Date().getTime()}`,
  timeout: 30,
  keepAliveInterval: 100,
  cleanSession: false,
  useSSL: false,
  reconnect: true // 断开后 是否重连
};
export default mqtt;
