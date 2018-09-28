'use strict'
const URL = require('./URL.config');
console.log(process.env.pack_ENV, "===>", URL);
module.exports = {
  NODE_ENV: '"production"',
  API_HOST: URL
  // API_HOST: '"http://47.96.8.239/api"' // 测试
  // API_HOST: '"http://www.myriadiot.net/api"' // 开发
}
